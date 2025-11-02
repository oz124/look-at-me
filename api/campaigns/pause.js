// Pause/Resume Campaign API - Pause or resume a campaign on all platforms
const mongoose = require('mongoose');
const Campaign = require('../../models/Campaign');
const { SecurityLogger } = require('../../src/lib/security');

// Connect to MongoDB if not already connected
async function connectToMongo() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    // Connect to MongoDB
    await connectToMongo();

    const { campaignId, userId, action, platformTokens } = req.body; // action: 'pause', 'resume', or 'cancel'

    // Validate input
    if (!campaignId || !userId || !action) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required parameters: campaignId, userId (Firebase UID), action' 
      });
    }

    if (!['pause', 'resume', 'cancel'].includes(action)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid action. Must be "pause", "resume", or "cancel"' 
      });
    }

    // Validate campaign ID (MongoDB ObjectId)
    if (!mongoose.Types.ObjectId.isValid(campaignId)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid campaign ID format' 
      });
    }

    // userId is Firebase UID (string), no validation needed

    // Find campaign
    const campaign = await Campaign.findOne({ _id: campaignId, userId });

    if (!campaign) {
      return res.status(404).json({ 
        success: false, 
        error: 'Campaign not found or unauthorized' 
      });
    }

    const actionText = action === 'pause' ? 'Pausing' : action === 'resume' ? 'Resuming' : 'Cancelling';
    console.log(`🎯 ${actionText} campaign: ${campaign.name}`);

    // Perform action on each platform
    const platformResults = [];
    
    for (const platform of campaign.platforms) {
      if (!platform.campaignId) {
        continue; // Skip if no platform campaign ID
      }

      try {
        let result;
        
        // Get access token for this platform from request (sent by client)
        // Client should send platformTokens object with tokens from localStorage/Firebase
        const platformKey = platform.name.toLowerCase();
        const platformData = platformTokens?.[platformKey];
        
        if (!platformData || !platformData.accessToken) {
          console.warn(`No access token found for ${platform.name}, skipping...`);
          result = { success: false, error: `No access token for ${platform.name}` };
        } else {
          switch (platform.name) {
            case 'Facebook':
              result = await pauseResumeFacebookCampaign(
                platform.campaignId, 
                platformData.accessToken, 
                action
              );
              break;
            case 'Google':
              result = await pauseResumeGoogleCampaign(
                platform.campaignId,
                platformData.customerId,
                platformData.accessToken,
                action
              );
              break;
            case 'TikTok':
              result = await pauseResumeTikTokCampaign(
                platform.campaignId,
                platformData.accessToken,
                action
              );
              break;
            default:
              result = { success: false, error: 'Platform not supported' };
          }
        }

        platformResults.push({
          platform: platform.name,
          success: result.success,
          error: result.error
        });

        // Update platform status if successful
        if (result.success) {
          if (action === 'pause') {
            platform.status = 'paused';
          } else if (action === 'resume') {
            platform.status = 'active';
          } else if (action === 'cancel') {
            platform.status = 'completed';
          }
          platform.lastSyncedAt = new Date();
        } else {
          platform.error = result.error;
          platform.errorAt = new Date();
        }

      } catch (error) {
        console.error(`Error ${action}ing ${platform.name}:`, error);
        platformResults.push({
          platform: platform.name,
          success: false,
          error: error.message
        });
      }
    }

    // Update campaign status
    if (action === 'pause') {
      await campaign.pause();
    } else if (action === 'resume') {
      await campaign.resume();
    } else if (action === 'cancel') {
      await campaign.cancel();
    }

    console.log(`✅ Campaign ${action}d successfully`);

    // Log action
    SecurityLogger.logSecurityEvent('CAMPAIGN_STATUS_CHANGED', {
      campaignId,
      userId,
      action,
      ip: req.ip
    });

    res.status(200).json({
      success: true,
      message: `Campaign ${action}d successfully`,
      campaign: campaign.toSummary(),
      platformResults,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`❌ Error ${req.body.action}ing campaign:`, error);
    SecurityLogger.logError(error, { context: 'pause-resume-campaign' });
    
    res.status(500).json({
      success: false,
      error: `Failed to ${req.body.action} campaign`,
      details: error.message
    });
  }
};

// ============================================
// Platform-specific pause/resume functions
// ============================================

async function pauseResumeFacebookCampaign(campaignId, accessToken, action) {
  try {
    // Cancel means permanently delete/archive the campaign
    const status = action === 'cancel' ? 'DELETED' : 
                   action === 'pause' ? 'PAUSED' : 'ACTIVE';
    
    const response = await fetch(`https://graph.facebook.com/v18.0/${campaignId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: status,
        access_token: accessToken
      })
    });

    const data = await response.json();

    if (data.success || response.ok) {
      console.log(`✅ Facebook campaign ${action}d:`, campaignId);
      return { success: true };
    } else {
      console.error('Facebook API error:', data);
      return { success: false, error: data.error?.message || 'Unknown error' };
    }
  } catch (error) {
    console.error('Error pausing/resuming/cancelling Facebook campaign:', error);
    return { success: false, error: error.message };
  }
}

async function pauseResumeGoogleCampaign(campaignId, customerId, accessToken, action) {
  try {
    // Cancel means remove/delete the campaign
    const status = action === 'cancel' ? 'REMOVED' : 
                   action === 'pause' ? 'PAUSED' : 'ENABLED';
    
    const data = {
      operations: [{
        update: {
          resource_name: `customers/${customerId}/campaigns/${campaignId}`,
          status: status
        },
        update_mask: 'status'
      }]
    };

    const response = await fetch(
      `https://googleads.googleapis.com/v16/customers/${customerId}/campaigns:mutate`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }
    );

    if (response.ok) {
      console.log(`✅ Google campaign ${action}d:`, campaignId);
      return { success: true };
    } else {
      const error = await response.text();
      console.error('Google Ads API error:', error);
      return { success: false, error };
    }
  } catch (error) {
    console.error('Error pausing/resuming/cancelling Google campaign:', error);
    return { success: false, error: error.message };
  }
}

async function pauseResumeTikTokCampaign(campaignId, accessToken, action) {
  try {
    // Cancel means delete the campaign
    const operation = action === 'cancel' ? 'DELETE' : 
                     action === 'pause' ? 'DISABLE' : 'ENABLE';
    
    const response = await fetch('https://business-api.tiktok.com/open_api/v1.3/campaign/update/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        campaign_id: campaignId,
        operation: operation
      })
    });

    const data = await response.json();

    if (data.code === 0) {
      console.log(`✅ TikTok campaign ${action}d:`, campaignId);
      return { success: true };
    } else {
      console.error('TikTok API error:', data);
      return { success: false, error: data.message };
    }
  } catch (error) {
    console.error('Error pausing/resuming/cancelling TikTok campaign:', error);
    return { success: false, error: error.message };
  }
}

