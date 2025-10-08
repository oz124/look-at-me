// Platform Verification API - Secure backend for verifying platform connections
// This endpoint handles the verification of platform access tokens and user info

const { ValidationService, SecurityLogger } = require('../../src/lib/security');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  console.log("📥 Received POST request to /api/platforms/verify");

  try {
    const { platform, accessToken } = req.body;

    // Validate input
    if (!platform || !accessToken) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required parameters: platform, accessToken' 
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

    console.log(`🔍 Verifying ${sanitizedPlatform} connection...`);

    let result;
    switch (sanitizedPlatform) {
      case 'Facebook':
        result = await verifyFacebookConnection(sanitizedAccessToken);
        break;
      case 'Google':
        result = await verifyGoogleConnection(sanitizedAccessToken);
        break;
      case 'TikTok':
        result = await verifyTikTokConnection(sanitizedAccessToken);
        break;
      default:
        throw new Error(`Platform ${sanitizedPlatform} not supported`);
    }

    console.log(`✅ ${sanitizedPlatform} connection verified successfully`);

    res.status(200).json({
      success: true,
      message: `${sanitizedPlatform} connection verified successfully`,
      result: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error verifying platform connection:', error);
    
    // Log security event for failed verification
    SecurityLogger.logSecurityEvent('PLATFORM_VERIFICATION_FAILED', {
      error: error.message,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      platform: req.body?.platform
    });
    
    res.status(500).json({ 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

// Facebook Connection Verification
async function verifyFacebookConnection(accessToken) {
  try {
    console.log("🔍 Verifying Facebook connection...");
    
    // Get user info
    const userResponse = await fetch(`https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email`);
    const userData = await userResponse.json();
    
    if (!userData.id) {
      throw new Error("Invalid Facebook access token");
    }

    // Get ad accounts
    const adAccountsResponse = await fetch(`https://graph.facebook.com/v18.0/me/adaccounts?access_token=${accessToken}`);
    const adAccountsData = await adAccountsResponse.json();
    
    // Get pages
    const pagesResponse = await fetch(`https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`);
    const pagesData = await pagesResponse.json();

    return {
      success: true,
      platform: 'Facebook',
      user_info: {
        id: userData.id,
        name: userData.name,
        email: userData.email
      },
      ad_accounts: adAccountsData.data || [],
      pages: pagesData.data || [],
      permissions: ['ads_management', 'pages_manage_ads', 'pages_read_engagement'],
      message: 'Facebook connection verified successfully'
    };

  } catch (error) {
    console.error('Error verifying Facebook connection:', error);
    return {
      success: false,
      platform: 'Facebook',
      error: error.message,
      message: `Failed to verify Facebook connection: ${error.message}`
    };
  }
}

// Google Connection Verification
async function verifyGoogleConnection(accessToken) {
  try {
    console.log("🔍 Verifying Google connection...");
    
    // Get user info
    const userResponse = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`);
    const userData = await userResponse.json();
    
    if (!userData.id) {
      throw new Error("Invalid Google access token");
    }

    // Get accessible customers (Google Ads)
    const customersResponse = await fetch(`https://googleads.googleapis.com/v16/customers:listAccessibleCustomers`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
        'Content-Type': 'application/json'
      }
    });
    
    let customersData = { resourceNames: [] };
    if (customersResponse.ok) {
      customersData = await customersResponse.json();
    }

    // Get YouTube channels
    const youtubeResponse = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true&access_token=${accessToken}`);
    let youtubeData = { items: [] };
    if (youtubeResponse.ok) {
      youtubeData = await youtubeResponse.json();
    }

    return {
      success: true,
      platform: 'Google',
      user_info: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        picture: userData.picture
      },
      ad_accounts: customersData.resourceNames || [],
      youtube_channels: youtubeData.items || [],
      permissions: ['adwords', 'youtube', 'userinfo'],
      message: 'Google connection verified successfully'
    };

  } catch (error) {
    console.error('Error verifying Google connection:', error);
    return {
      success: false,
      platform: 'Google',
      error: error.message,
      message: `Failed to verify Google connection: ${error.message}`
    };
  }
}

// TikTok Connection Verification
async function verifyTikTokConnection(accessToken) {
  try {
    console.log("🔍 Verifying TikTok connection...");
    
    // Get user info
    const userResponse = await fetch(`https://open-api.tiktok.com/platform/oauth/user/info/?access_token=${accessToken}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const userData = await userResponse.json();
    
    if (!userData.data || !userData.data.user) {
      throw new Error("Invalid TikTok access token");
    }

    // Get advertiser accounts
    const advertisersResponse = await fetch('https://business-api.tiktok.com/open_api/v1.3/oauth2/advertiser/get/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    let advertisersData = { data: { list: [] } };
    if (advertisersResponse.ok) {
      advertisersData = await advertisersResponse.json();
    }

    return {
      success: true,
      platform: 'TikTok',
      user_info: {
        id: userData.data.user.open_id,
        display_name: userData.data.user.display_name,
        avatar_url: userData.data.user.avatar_url
      },
      advertiser_accounts: advertisersData.data?.list || [],
      permissions: ['user.info.basic', 'video.publish', 'video.list'],
      message: 'TikTok connection verified successfully'
    };

  } catch (error) {
    console.error('Error verifying TikTok connection:', error);
    return {
      success: false,
      platform: 'TikTok',
      error: error.message,
      message: `Failed to verify TikTok connection: ${error.message}`
    };
  }
}
