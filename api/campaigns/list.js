// Get User Campaigns - Returns all campaigns for the authenticated user
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
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    // Connect to MongoDB
    await connectToMongo();

    // Get userId from query parameter
    const userId = req.query.userId;

    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        error: 'User authentication required' 
      });
    }

    // userId is Firebase UID (string), no ObjectId validation needed
    console.log(`📊 Fetching campaigns for Firebase User: ${userId}`);

    // Get campaigns for this user
    const campaigns = await Campaign.find({ userId })
      .sort({ createdAt: -1 }) // Most recent first
      .select('-performanceHistory') // Exclude large history data
      .lean(); // Convert to plain JS objects for better performance

    console.log(`📊 Found ${campaigns.length} campaigns for user ${userId}`);

    // Log access
    SecurityLogger.logSecurityEvent('CAMPAIGNS_ACCESSED', {
      userId,
      count: campaigns.length,
      ip: req.ip
    });

    res.status(200).json({
      success: true,
      campaigns,
      count: campaigns.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error fetching campaigns:', error);
    SecurityLogger.logError(error, { context: 'list-campaigns' });
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch campaigns',
      details: error.message
    });
  }
};

