// API route for Facebook OAuth token exchange
// This endpoint handles the exchange of authorization code for access token

const { ValidationService, SecurityLogger } = require('../../../src/lib/security');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { code, redirectUri } = req.body;

    // Validate and sanitize inputs
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Valid authorization code is required' });
    }

    if (!redirectUri || typeof redirectUri !== 'string') {
      return res.status(400).json({ error: 'Valid redirect URI is required' });
    }

    // Sanitize inputs
    const sanitizedCode = ValidationService.sanitizeInput(code);
    const sanitizedRedirectUri = ValidationService.sanitizeInput(redirectUri);

    // Validate redirect URI format
    try {
      new URL(sanitizedRedirectUri);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid redirect URI format' });
    }

    // Exchange code for access token
    const tokenUrl = new URL('https://graph.facebook.com/v18.0/oauth/access_token');
    tokenUrl.searchParams.append('client_id', process.env.VITE_FACEBOOK_APP_ID);
    tokenUrl.searchParams.append('client_secret', process.env.FACEBOOK_APP_SECRET);
    tokenUrl.searchParams.append('code', sanitizedCode);
    tokenUrl.searchParams.append('redirect_uri', sanitizedRedirectUri);

    const tokenResult = await fetch(tokenUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!tokenResult.ok) {
      SecurityLogger.logSecurityEvent('FACEBOOK_TOKEN_EXCHANGE_FAILED', {
        status: tokenResult.status,
        statusText: tokenResult.statusText,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
      throw new Error(`Facebook token exchange failed: ${tokenResult.statusText}`);
    }

    const tokenData = await tokenResult.json();

    if (tokenData.error) {
      SecurityLogger.logSecurityEvent('FACEBOOK_API_ERROR', {
        error: tokenData.error,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
      return res.status(400).json({
        error: 'Facebook token exchange failed',
        details: tokenData.error
      });
    }

    // Get user information
    const userResponse = await fetch(`https://graph.facebook.com/v18.0/me?fields=id,name,email,picture&access_token=${tokenData.access_token}`);
    const userData = await userResponse.json();

    // Get pages (for business accounts)
    const pagesResponse = await fetch(`https://graph.facebook.com/v18.0/me/accounts?access_token=${tokenData.access_token}`);
    const pagesData = await pagesResponse.json();

    return res.json({
      success: true,
      access_token: tokenData.access_token,
      token_type: tokenData.token_type,
      expires_in: tokenData.expires_in,
      user: userData,
      pages: pagesData.data || [],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Facebook Token Exchange Error:', error);
    return res.status(500).json({
      error: 'Failed to exchange Facebook token',
      details: error.message
    });
  }
};
