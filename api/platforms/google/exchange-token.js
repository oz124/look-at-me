// API route for Google OAuth token exchange
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
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: process.env.VITE_GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri
      })
    });

    if (!tokenResponse.ok) {
      throw new Error(`Google token exchange failed: ${tokenResponse.statusText}`);
    }

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return res.status(400).json({
        error: 'Google token exchange failed',
        details: tokenData.error
      });
    }

    // Get user information
    const userResponse = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenData.access_token}`);
    const userData = await userResponse.json();

    // Get YouTube channel information
    const youtubeResponse = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&mine=true&access_token=${tokenData.access_token}`);
    const youtubeData = await youtubeResponse.json();

    // Get Google Ads account information
    const adsResponse = await fetch(`https://googleads.googleapis.com/v14/customers?access_token=${tokenData.access_token}`);
    const adsData = await adsResponse.json();

    return res.json({
      success: true,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      token_type: tokenData.token_type,
      expires_in: tokenData.expires_in,
      scope: tokenData.scope,
      user: userData,
      youtube: youtubeData,
      ads: adsData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Google Token Exchange Error:', error);
    return res.status(500).json({
      error: 'Failed to exchange Google token',
      details: error.message
    });
  }
};
