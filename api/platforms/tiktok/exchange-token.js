// API route for TikTok OAuth token exchange
// This endpoint handles the exchange of authorization code for access token

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { code, redirectUri } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://open-api.tiktok.com/oauth/access_token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_key: process.env.VITE_TIKTOK_CLIENT_ID,
        client_secret: process.env.TIKTOK_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri
      })
    });

    if (!tokenResponse.ok) {
      throw new Error(`TikTok token exchange failed: ${tokenResponse.statusText}`);
    }

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return res.status(400).json({
        error: 'TikTok token exchange failed',
        details: tokenData.error
      });
    }

    // Get user information
    const userResponse = await fetch('https://open-api.tiktok.com/user/info/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        access_token: tokenData.access_token,
        fields: ['open_id', 'union_id', 'avatar_url', 'display_name']
      })
    });

    const userData = await userResponse.json();

    // Get user videos
    const videosResponse = await fetch('https://open-api.tiktok.com/video/list/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        access_token: tokenData.access_token,
        fields: ['id', 'title', 'cover_image_url', 'create_time', 'video_description']
      })
    });

    const videosData = await videosResponse.json();

    return res.json({
      success: true,
      access_token: tokenData.access_token,
      token_type: tokenData.token_type,
      expires_in: tokenData.expires_in,
      scope: tokenData.scope,
      user: userData,
      videos: videosData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('TikTok Token Exchange Error:', error);
    return res.status(500).json({
      error: 'Failed to exchange TikTok token',
      details: error.message
    });
  }
};
