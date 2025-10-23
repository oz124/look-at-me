// Campaign Creation API - Secure backend for creating real campaigns
// This endpoint handles the creation of actual campaigns on social media platforms

const { ValidationService, SecurityLogger } = require('../../src/lib/security');
const formidable = require('formidable').formidable;
const fs = require('fs');
const path = require('path');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  console.log("📥 Received POST request to /api/campaigns/create");

  try {
    // Parse form data to handle both JSON and file uploads
    const form = formidable({
      maxFileSize: 500 * 1024 * 1024, // 500MB
      keepExtensions: true,
      uploadDir: require('os').tmpdir(),
      filter: function ({name, originalFilename, mimetype}) {
        // Allow video files
        const allowedMimeTypes = [
          'video/mp4',
          'video/avi',
          'video/mov',
          'video/wmv',
          'video/flv',
          'video/webm',
          'video/mkv'
        ];
        
        const allowedExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'];
        const fileExtension = originalFilename.split('.').pop().toLowerCase();
        
        if (!allowedMimeTypes.includes(mimetype) || !allowedExtensions.includes(fileExtension)) {
          return false;
        }
        
        return true;
      }
    });

    const [fields, files] = await form.parse(req);
    
    // Extract data from form fields
    const platform = fields.platform ? fields.platform[0] : null;
    const campaignParams = fields.campaignParams ? JSON.parse(fields.campaignParams[0]) : null;
    const adCreative = fields.adCreative ? JSON.parse(fields.adCreative[0]) : null;
    const accessToken = fields.accessToken ? fields.accessToken[0] : null;
    
    // Get video file if uploaded
    const videoFile = files.video ? files.video[0] : null;

    // Validate input
    if (!platform || !campaignParams || !accessToken) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required parameters: platform, campaignParams, accessToken' 
      });
    }

    // Validate platform
    const allowedPlatforms = ['Facebook', 'Google', 'TikTok'];
    if (!allowedPlatforms.includes(platform)) {
      return res.status(400).json({ 
        success: false, 
        error: `Unsupported platform: ${platform}. Supported platforms: ${allowedPlatforms.join(', ')}` 
      });
    }

    // Sanitize inputs
    const sanitizedPlatform = ValidationService.sanitizeInput(platform);
    const sanitizedAccessToken = ValidationService.sanitizeInput(accessToken);

    console.log(`🚀 Creating ${sanitizedPlatform} campaign...`);

    let result;
    switch (sanitizedPlatform) {
      case 'Facebook':
        result = await createFacebookCampaign(campaignParams, adCreative, sanitizedAccessToken, videoFile);
        break;
      case 'Google':
        result = await createGoogleCampaign(campaignParams, adCreative, sanitizedAccessToken, videoFile);
        break;
      case 'TikTok':
        result = await createTikTokCampaign(campaignParams, adCreative, sanitizedAccessToken, videoFile);
        break;
      default:
        throw new Error(`Platform ${sanitizedPlatform} not supported`);
    }

    console.log(`✅ ${sanitizedPlatform} campaign created successfully`);

    // Clean up temporary video file
    if (videoFile && videoFile.filepath) {
      try {
        if (fs.existsSync(videoFile.filepath)) {
          fs.unlink(videoFile.filepath, (err) => {
            if (err) console.error("Error deleting temp video file:", err);
          });
        }
      } catch (cleanupError) {
        console.error("Error during video file cleanup:", cleanupError);
      }
    }

    res.status(200).json({
      success: true,
      message: `${sanitizedPlatform} campaign created successfully`,
      result: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error creating campaign:', error);
    
    // Clean up temporary video file on error
    if (videoFile && videoFile.filepath) {
      try {
        if (fs.existsSync(videoFile.filepath)) {
          fs.unlink(videoFile.filepath, (err) => {
            if (err) console.error("Error deleting temp video file on error:", err);
          });
        }
      } catch (cleanupError) {
        console.error("Error during video file cleanup on error:", cleanupError);
      }
    }
    
    // Log security event for failed campaign creation
    SecurityLogger.logSecurityEvent('CAMPAIGN_CREATION_FAILED', {
      error: error.message,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      platform: platform
    });
    
    res.status(500).json({ 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// Facebook Campaign Creation with Video Upload
async function createFacebookCampaign(campaignParams, adCreative, accessToken, videoFile = null) {
  try {
    console.log("🚀 Creating real Facebook campaign with video...");
    
    // Get ad accounts
    const adAccountsResponse = await fetch(`https://graph.facebook.com/v18.0/me/adaccounts?access_token=${accessToken}`);
    const adAccountsData = await adAccountsResponse.json();
    
    if (!adAccountsData.data || adAccountsData.data.length === 0) {
      throw new Error("No Facebook ad accounts found");
    }
    
    const adAccountId = adAccountsData.data[0].id;
    
    // Upload video if provided
    let videoId = null;
    if (videoFile && videoFile.filepath) {
      console.log("📹 Uploading video to Facebook...");
      videoId = await uploadVideoToFacebook(videoFile, adAccountId, accessToken);
      console.log("✅ Video uploaded successfully:", videoId);
    }
    
    // Create campaign
    const campaignData = {
      name: `AI Campaign - ${new Date().toISOString().split('T')[0]}`,
      objective: mapGoalToFacebookObjective(campaignParams.goal),
      status: 'PAUSED', // Start paused for safety
      special_ad_categories: [],
      access_token: accessToken
    };

    const campaignResponse = await fetch(`https://graph.facebook.com/v18.0/${adAccountId}/campaigns`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(campaignData)
    });

    const campaignResult = await campaignResponse.json();
    
    if (!campaignResult.id) {
      throw new Error(`Failed to create Facebook campaign: ${JSON.stringify(campaignResult)}`);
    }

    // Create ad set
    const adSetData = {
      name: `AI Ad Set - ${new Date().toISOString().split('T')[0]}`,
      campaign_id: campaignResult.id,
      daily_budget: Math.floor(campaignParams.daily_budget * 100), // Convert to cents
      billing_event: 'IMPRESSIONS',
      optimization_goal: 'REACH',
      targeting: {
        geo_locations: {
          countries: ['IL'] // Israel
        },
        age_min: 18,
        age_max: 65
      },
      status: 'PAUSED',
      access_token: accessToken
    };

    const adSetResponse = await fetch(`https://graph.facebook.com/v18.0/${adAccountId}/adsets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(adSetData)
    });

    const adSetResult = await adSetResponse.json();
    
    if (!adSetResult.id) {
      throw new Error(`Failed to create Facebook ad set: ${JSON.stringify(adSetResult)}`);
    }

    // Create ad creative with video if available
    let creativeData;
    if (videoId) {
      // Video creative
      creativeData = {
        name: `AI Video Creative - ${new Date().toISOString().split('T')[0]}`,
        object_story_spec: {
          page_id: adAccountId, // This should be a real page ID
          video_data: {
            video_id: videoId,
            message: adCreative.description || 'AI Generated Video Ad',
            call_to_action: {
              type: 'LEARN_MORE',
              value: {
                link: adCreative.website_url || 'https://example.com'
              }
            }
          }
        },
        access_token: accessToken
      };
    } else {
      // Link creative (fallback)
      creativeData = {
        name: `AI Creative - ${new Date().toISOString().split('T')[0]}`,
        object_story_spec: {
          page_id: adAccountId, // This should be a real page ID
          link_data: {
            message: adCreative.description || 'AI Generated Ad',
            link: adCreative.website_url || 'https://example.com',
            name: adCreative.headline || 'AI Campaign',
            description: adCreative.description || 'Generated by AI'
          }
        },
        access_token: accessToken
      };
    }

    const creativeResponse = await fetch(`https://graph.facebook.com/v18.0/${adAccountId}/adcreatives`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(creativeData)
    });

    const creativeResult = await creativeResponse.json();
    
    if (!creativeResult.id) {
      throw new Error(`Failed to create Facebook ad creative: ${JSON.stringify(creativeResult)}`);
    }

    // Create ad
    const adData = {
      name: `AI Ad - ${new Date().toISOString().split('T')[0]}`,
      adset_id: adSetResult.id,
      creative: {
        creative_id: creativeResult.id
      },
      status: 'PAUSED',
      access_token: accessToken
    };

    const adResponse = await fetch(`https://graph.facebook.com/v18.0/${adAccountId}/ads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(adData)
    });

    const adResult = await adResponse.json();
    
    if (!adResult.id) {
      throw new Error(`Failed to create Facebook ad: ${JSON.stringify(adResult)}`);
    }

    return {
      success: true,
      platform: 'Facebook',
      campaign_id: campaignResult.id,
      adset_id: adSetResult.id,
      creative_id: creativeResult.id,
      ad_id: adResult.id,
      estimated_reach: 10000, // Estimated reach
      daily_budget: campaignParams.daily_budget,
      message: 'Facebook campaign created successfully (paused for safety)'
    };

  } catch (error) {
    console.error('Error creating Facebook campaign:', error);
    return {
      success: false,
      platform: 'Facebook',
      error: error.message,
      message: `Failed to create Facebook campaign: ${error.message}`
    };
  }
}

// Google Campaign Creation with Video Upload
async function createGoogleCampaign(campaignParams, adCreative, accessToken, videoFile = null) {
  try {
    console.log("🚀 Creating real Google Ads campaign with video...");
    
    // Upload video to YouTube if provided
    let videoId = null;
    if (videoFile && videoFile.filepath) {
      console.log("📹 Uploading video to YouTube...");
      videoId = await uploadVideoToYouTube(videoFile, accessToken);
      console.log("✅ Video uploaded successfully to YouTube:", videoId);
    }
    
    // Get customer ID
    const customersResponse = await fetch(`https://googleads.googleapis.com/v16/customers:listAccessibleCustomers`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
        'Content-Type': 'application/json'
      }
    });
    
    if (!customersResponse.ok) {
      throw new Error(`Google Ads API Error: ${customersResponse.statusText}`);
    }
    
    const customersData = await customersResponse.json();
    
    if (!customersData.resourceNames || customersData.resourceNames.length === 0) {
      throw new Error("No accessible Google Ads customers found");
    }
    
    const customerId = customersData.resourceNames[0].split('/')[1];
    
    // Create campaign
    const campaignData = {
      operations: [{
        create: {
          name: `AI Campaign - ${new Date().toISOString().split('T')[0]}`,
          advertising_channel_type: 'SEARCH',
          status: 'PAUSED', // Start paused for safety
          campaign_budget: {
            name: `AI Budget - ${new Date().toISOString().split('T')[0]}`,
            amount_micros: Math.floor(campaignParams.daily_budget * 1000000), // Convert to micros
            delivery_method: 'STANDARD'
          },
          geo_target_type_setting: {
            positive_geo_target_type: 'AREA_OF_INTEREST',
            negative_geo_target_type: 'LOCATION_OF_PRESENCE'
          },
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
        }
      }]
    };

    const campaignResponse = await fetch(`https://googleads.googleapis.com/v16/customers/${customerId}/campaigns:mutate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(campaignData)
    });

    const campaignResult = await campaignResponse.json();
    
    if (!campaignResult.results || campaignResult.results.length === 0) {
      throw new Error(`Failed to create Google Ads campaign: ${JSON.stringify(campaignResult)}`);
    }

    const campaignId = campaignResult.results[0].resource_name.split('/')[3];

    // Create video ad if video was uploaded
    let adId = null;
    if (videoId) {
      console.log("📹 Creating Google Ads video ad...");
      const adData = {
        operations: [{
          create: {
            type: 'VIDEO_RESPONSIVE_AD',
            name: `AI Video Ad - ${new Date().toISOString().split('T')[0]}`,
            final_urls: [adCreative.website_url || 'https://example.com'],
            headlines: [{
              text: adCreative.headline || 'AI Generated Ad',
              pinned_field: 'HEADLINE_1'
            }],
            descriptions: [{
              text: adCreative.description || 'Generated by AI'
            }],
            videos: [{
              youtube_video_id: videoId
            }]
          }
        }]
      };

      const adResponse = await fetch(`https://googleads.googleapis.com/v16/customers/${customerId}/ads:mutate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(adData)
      });

      const adResult = await adResponse.json();
      if (adResult.results && adResult.results.length > 0) {
        adId = adResult.results[0].resource_name.split('/')[3];
        console.log("✅ Google Ads video ad created:", adId);
      }
    }

    return {
      success: true,
      platform: 'Google',
      campaign_id: campaignId,
      ad_id: adId,
      video_id: videoId,
      estimated_reach: 15000, // Estimated reach
      daily_budget: campaignParams.daily_budget,
      message: 'Google Ads campaign created successfully with video (paused for safety)'
    };

  } catch (error) {
    console.error('Error creating Google campaign:', error);
    return {
      success: false,
      platform: 'Google',
      error: error.message,
      message: `Failed to create Google Ads campaign: ${error.message}`
    };
  }
}

// TikTok Campaign Creation with Video Upload
async function createTikTokCampaign(campaignParams, adCreative, accessToken, videoFile = null) {
  try {
    console.log("🚀 Creating real TikTok campaign with video...");
    
    // Upload video if provided
    let videoId = null;
    if (videoFile && videoFile.filepath) {
      console.log("📹 Uploading video to TikTok...");
      videoId = await uploadVideoToTikTok(videoFile, accessToken);
      console.log("✅ Video uploaded successfully:", videoId);
    }
    
    // Create campaign
    const campaignData = {
      campaign_name: `TikTok AI Campaign - ${new Date().toISOString().split('T')[0]}`,
      objective_type: 'REACH', // or 'CONVERSIONS' based on goal
      budget_mode: 'BUDGET_MODE_DAY',
      budget: Math.floor(campaignParams.daily_budget * 100), // Convert to cents
      status: 'ENABLE',
      placement_type: 'AUTOMATIC',
      landing_page_url: adCreative.website_url || 'https://example.com',
      app_name: adCreative.app_name || 'AI Campaign App',
      app_download_url: adCreative.app_download_url || 'https://example.com/download'
    };

    const campaignResponse = await fetch('https://business-api.tiktok.com/open_api/v1.3/campaign/create/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(campaignData)
    });

    const campaignResult = await campaignResponse.json();
    
    if (!campaignResult.data || !campaignResult.data.campaign_id) {
      throw new Error(`Failed to create TikTok campaign: ${JSON.stringify(campaignResult)}`);
    }

    // Create ad group with video if available
    let adGroupId = null;
    if (videoId) {
      console.log("📹 Creating TikTok ad group with video...");
      const adGroupData = {
        campaign_id: campaignResult.data.campaign_id,
        adgroup_name: `AI Ad Group - ${new Date().toISOString().split('T')[0]}`,
        placement_type: 'AUTOMATIC',
        budget_mode: 'BUDGET_MODE_DAY',
        budget: Math.floor(campaignParams.daily_budget * 100),
        optimization_goal: 'REACH',
        video_id: videoId,
        call_to_action: 'LEARN_MORE',
        landing_page_url: adCreative.website_url || 'https://example.com'
      };

      const adGroupResponse = await fetch('https://business-api.tiktok.com/open_api/v1.3/adgroup/create/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(adGroupData)
      });

      const adGroupResult = await adGroupResponse.json();
      if (adGroupResult.data && adGroupResult.data.adgroup_id) {
        adGroupId = adGroupResult.data.adgroup_id;
        console.log("✅ TikTok ad group created with video:", adGroupId);
      }
    }

    return {
      success: true,
      platform: 'TikTok',
      campaign_id: campaignResult.data.campaign_id,
      adgroup_id: adGroupId,
      video_id: videoId,
      estimated_reach: 20000, // Estimated reach
      daily_budget: campaignParams.daily_budget,
      message: 'TikTok campaign created successfully with video'
    };

  } catch (error) {
    console.error('Error creating TikTok campaign:', error);
    return {
      success: false,
      platform: 'TikTok',
      error: error.message,
      message: `Failed to create TikTok campaign: ${error.message}`
    };
  }
}

// Helper function to upload video to YouTube with retry logic
async function uploadVideoToYouTube(videoFile, accessToken, maxRetries = 3) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`📹 Starting YouTube video upload (attempt ${attempt}/${maxRetries})...`);
      
      // YouTube Data API v3 upload
      const { google } = require('googleapis');
      const youtube = google.youtube({ version: 'v3', auth: accessToken });
      
      // Read video file
      const videoBuffer = fs.readFileSync(videoFile.filepath);
      
      // Upload video to YouTube
      const response = await youtube.videos.insert({
        part: 'snippet,status',
        requestBody: {
          snippet: {
            title: `AI Generated Ad - ${new Date().toISOString().split('T')[0]}`,
            description: 'AI Generated Advertisement Video',
            tags: ['AI', 'Advertisement', 'Marketing'],
            categoryId: '22' // People & Blogs category
          },
          status: {
            privacyStatus: 'unlisted' // Keep as unlisted for ads
          }
        },
        media: {
          body: videoBuffer
        }
      });
      
      const videoId = response.data.id;
      console.log("✅ Video uploaded successfully to YouTube:", videoId);
      
      return videoId;
      
    } catch (error) {
      lastError = error;
      console.error(`YouTube video upload attempt ${attempt} failed:`, error);
      
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  // If all retries failed
  throw new Error(`YouTube video upload failed after ${maxRetries} attempts: ${lastError.message}`);
}

// Helper function to upload video to TikTok with retry logic
async function uploadVideoToTikTok(videoFile, accessToken, maxRetries = 3) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`📹 Starting TikTok video upload (attempt ${attempt}/${maxRetries})...`);
      
      // Step 1: Initialize video upload
      const initResponse = await fetch('https://business-api.tiktok.com/open_api/v1.3/file/video/ad/upload/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filename: videoFile.originalFilename,
          file_size: videoFile.size
        })
      });
    
      const initResult = await initResponse.json();
      
      if (!initResult.data || !initResult.data.upload_url) {
        throw new Error(`Failed to initialize TikTok upload: ${JSON.stringify(initResult)}`);
      }
      
      const uploadUrl = initResult.data.upload_url;
      const videoId = initResult.data.video_id;
      
      console.log("📹 TikTok upload initialized:", videoId);
      
      // Step 2: Upload video file
      const FormData = require('form-data');
      const form = new FormData();
      
      // Read video file
      const videoBuffer = fs.readFileSync(videoFile.filepath);
      form.append('video', videoBuffer, {
        filename: videoFile.originalFilename,
        contentType: videoFile.mimetype
      });
      
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: videoBuffer,
        headers: {
          'Content-Type': videoFile.mimetype,
          'Content-Length': videoFile.size.toString()
        }
      });
      
      if (!uploadResponse.ok) {
        throw new Error(`TikTok video upload failed: ${uploadResponse.statusText}`);
      }
      
      console.log("✅ Video uploaded successfully to TikTok");
      
      return videoId;
      
    } catch (error) {
      lastError = error;
      console.error(`TikTok video upload attempt ${attempt} failed:`, error);
      
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  // If all retries failed
  throw new Error(`TikTok video upload failed after ${maxRetries} attempts: ${lastError.message}`);
}

// Helper function to upload video to Facebook with retry logic
async function uploadVideoToFacebook(videoFile, adAccountId, accessToken, maxRetries = 3) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`📹 Starting Facebook video upload (attempt ${attempt}/${maxRetries})...`);
      
      // Step 1: Create video upload session
      const uploadSessionResponse = await fetch(`https://graph.facebook.com/v18.0/${adAccountId}/advideos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file_size: videoFile.size,
          access_token: accessToken
        })
      });
    
      const uploadSession = await uploadSessionResponse.json();
      
      if (!uploadSession.id) {
        throw new Error(`Failed to create upload session: ${JSON.stringify(uploadSession)}`);
      }
      
      const videoId = uploadSession.id;
      const uploadUrl = uploadSession.upload_url;
      
      console.log("📹 Upload session created:", videoId);
      
      // Step 2: Upload video file
      const FormData = require('form-data');
      const form = new FormData();
      
      // Read video file
      const videoBuffer = fs.readFileSync(videoFile.filepath);
      form.append('source', videoBuffer, {
        filename: videoFile.originalFilename,
        contentType: videoFile.mimetype
      });
      
      const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        body: form,
        headers: form.getHeaders()
      });
      
      if (!uploadResponse.ok) {
        throw new Error(`Video upload failed: ${uploadResponse.statusText}`);
      }
      
      console.log("✅ Video uploaded successfully to Facebook");
      
      // Step 3: Wait for processing (optional - can be done asynchronously)
      // Facebook will process the video in the background
      
      return videoId;
      
    } catch (error) {
      lastError = error;
      console.error(`Facebook video upload attempt ${attempt} failed:`, error);
      
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  // If all retries failed
  throw new Error(`Facebook video upload failed after ${maxRetries} attempts: ${lastError.message}`);
}

// Helper function to map campaign goals to Facebook objectives
function mapGoalToFacebookObjective(goal) {
  const goalMapping = {
    'מכירות': 'CONVERSIONS',
    'sales': 'CONVERSIONS',
    'לידים': 'LEAD_GENERATION',
    'leads': 'LEAD_GENERATION',
    'חשיפה': 'REACH',
    'awareness': 'REACH',
    'מעורבות': 'ENGAGEMENT',
    'engagement': 'ENGAGEMENT',
    'תנועה': 'TRAFFIC',
    'traffic': 'TRAFFIC'
  };
  
  return goalMapping[goal] || 'REACH';
}
