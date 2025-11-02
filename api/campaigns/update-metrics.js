// Update Campaign Metrics - Fetch and update performance metrics for a campaign
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

    const { campaignId, userId, platformTokens } = req.body;

    // Validate input
    if (!campaignId || !userId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required parameters: campaignId, userId (Firebase UID)' 
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

    console.log(`📊 Updating metrics for campaign: ${campaign.name}`);
    console.log(`👤 Firebase User: ${userId}`);

    // Fetch metrics from each platform
    const platformMetrics = [];
    
    for (const platform of campaign.platforms) {
      if (!platform.campaignId || platform.status !== 'active') {
        continue; // Skip inactive or undeployed platforms
      }

      try {
        // Get access token from request (sent by client)
        const platformKey = platform.name.toLowerCase();
        const platformData = platformTokens?.[platformKey];
        
        if (!platformData || !platformData.accessToken) {
          console.warn(`No access token for ${platform.name}, skipping...`);
          continue;
        }

        let metrics;
        const dateRange = {
          since: campaign.schedule.startDate.toISOString().split('T')[0],
          until: new Date().toISOString().split('T')[0]
        };

        switch (platform.name) {
          case 'Facebook':
            metrics = await fetchFacebookMetrics(
              platformData.accessToken,
              platform.campaignId,
              platformData.accountId || platformData.adAccountId,
              dateRange
            );
            break;
          case 'Google':
            metrics = await fetchGoogleMetrics(
              platformData.accessToken,
              platformData.customerId,
              platform.campaignId,
              dateRange
            );
            break;
          case 'TikTok':
            metrics = await fetchTikTokMetrics(
              platformData.accessToken,
              platformData.advertiserId,
              platform.campaignId,
              dateRange
            );
            break;
        }

        if (metrics) {
          platformMetrics.push(metrics);
          
          // Add to performance history
          await campaign.addPerformanceEntry(platform.name, metrics);
        }

      } catch (error) {
        console.error(`Error fetching metrics for ${platform.name}:`, error);
      }
    }

    // Update aggregated campaign metrics
    if (platformMetrics.length > 0) {
      await campaign.updateMetrics(platformMetrics);
      console.log(`✅ Campaign metrics updated successfully`);
    } else {
      console.log(`⚠️ No platform metrics available`);
    }

    res.status(200).json({
      success: true,
      message: 'Campaign metrics updated',
      metrics: campaign.metrics,
      platformCount: platformMetrics.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error updating campaign metrics:', error);
    SecurityLogger.logError(error, { context: 'update-campaign-metrics' });
    
    res.status(500).json({
      success: false,
      error: 'Failed to update campaign metrics',
      details: error.message
    });
  }
};

// Helper functions to fetch metrics from each platform
async function fetchFacebookMetrics(accessToken, campaignId, adAccountId, dateRange) {
  try {
    const since = dateRange.since;
    const until = dateRange.until;

    const insightsUrl = `https://graph.facebook.com/v18.0/${campaignId}/insights?fields=impressions,clicks,spend,reach,actions&time_range={'since':'${since}','until':'${until}'}&access_token=${accessToken}`;

    const response = await fetch(insightsUrl);
    if (!response.ok) return null;

    const data = await response.json();
    const insights = data.data?.[0] || {};
    
    const actions = insights.actions || [];
    const conversions = actions.reduce((sum, action) => {
      if (action.action_type.includes('conversion') || action.action_type.includes('purchase') || action.action_type.includes('lead')) {
        return sum + parseInt(action.value || 0);
      }
      return sum;
    }, 0);

    return {
      platform: 'Facebook',
      impressions: parseInt(insights.impressions) || 0,
      clicks: parseInt(insights.clicks) || 0,
      spend: parseFloat(insights.spend) || 0,
      reach: parseInt(insights.reach) || 0,
      conversions,
      ctr: ((parseInt(insights.clicks) / parseInt(insights.impressions)) * 100).toFixed(2),
      cpc: (parseFloat(insights.spend) / parseInt(insights.clicks)).toFixed(2),
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching Facebook metrics:', error);
    return null;
  }
}

async function fetchGoogleMetrics(accessToken, customerId, campaignId, dateRange) {
  try {
    const query = `
      SELECT metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions
      FROM campaign
      WHERE campaign.id = ${campaignId}
      AND segments.date BETWEEN '${dateRange.since}' AND '${dateRange.until}'
    `;

    const response = await fetch(
      `https://googleads.googleapis.com/v14/customers/${customerId.replace(/-/g, '')}/googleAds:searchStream`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    const results = data.results || [];
    
    let totalImpressions = 0;
    let totalClicks = 0;
    let totalCost = 0;
    let totalConversions = 0;

    results.forEach(r => {
      totalImpressions += parseInt(r.metrics?.impressions) || 0;
      totalClicks += parseInt(r.metrics?.clicks) || 0;
      totalCost += parseInt(r.metrics?.costMicros) || 0;
      totalConversions += parseFloat(r.metrics?.conversions) || 0;
    });

    const cost = totalCost / 1000000;

    return {
      platform: 'Google',
      impressions: totalImpressions,
      clicks: totalClicks,
      spend: parseFloat(cost.toFixed(2)),
      reach: Math.floor(totalImpressions * 0.7),
      conversions: Math.floor(totalConversions),
      ctr: ((totalClicks / totalImpressions) * 100).toFixed(2),
      cpc: (cost / totalClicks).toFixed(2),
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching Google metrics:', error);
    return null;
  }
}

async function fetchTikTokMetrics(accessToken, advertiserId, campaignId, dateRange) {
  try {
    const params = new URLSearchParams({
      advertiser_id: advertiserId,
      report_type: 'BASIC',
      data_level: 'AUCTION_CAMPAIGN',
      dimensions: JSON.stringify(['campaign_id']),
      metrics: JSON.stringify(['spend', 'impressions', 'clicks', 'conversion']),
      start_date: dateRange.since,
      end_date: dateRange.until,
      filtering: JSON.stringify([{ field: 'campaign_id', operator: 'EQUALS', value: campaignId }])
    });

    const response = await fetch(
      `https://business-api.tiktok.com/open_api/v1.3/reports/integrated/get/?${params.toString()}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    if (data.code !== 0) return null;

    const reportData = data.data?.list?.[0]?.metrics || {};

    return {
      platform: 'TikTok',
      impressions: parseInt(reportData.impressions) || 0,
      clicks: parseInt(reportData.clicks) || 0,
      spend: parseFloat(reportData.spend) || 0,
      reach: Math.floor((parseInt(reportData.impressions) || 0) * 0.8),
      conversions: parseInt(reportData.conversion) || 0,
      ctr: ((parseInt(reportData.clicks) / parseInt(reportData.impressions)) * 100).toFixed(2),
      cpc: (parseFloat(reportData.spend) / parseInt(reportData.clicks)).toFixed(2),
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching TikTok metrics:', error);
    return null;
  }
}

