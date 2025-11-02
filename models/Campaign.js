const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  // Firebase User ID who created the campaign
  userId: {
    type: String,
    required: true,
    index: true
  },
  
  // Campaign Basic Info
  name: {
    type: String,
    required: true,
    trim: true
  },
  
  goal: {
    type: String,
    required: true,
    enum: ['מכירות', 'לידים', 'חשיפה', 'מעורבות', 'תנועה', 'sales', 'leads', 'awareness', 'engagement', 'traffic']
  },
  
  targetAudience: {
    type: String,
    trim: true
  },
  
  budget: {
    daily: {
      type: Number,
      required: true,
      min: 0
    },
    total: {
      type: Number,
      min: 0
    },
    currency: {
      type: String,
      default: 'ILS'
    }
  },
  
  // Campaign Status
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'completed', 'cancelled', 'failed', 'debug'],
    default: 'draft',
    index: true
  },
  
  // Platforms where campaign is deployed
  platforms: [{
    name: {
      type: String,
      enum: ['Facebook', 'Google', 'TikTok', 'Instagram', 'YouTube'],
      required: true
    },
    
    // Platform-specific IDs
    campaignId: String,
    adSetId: String,
    adGroupId: String,
    adId: String,
    creativeId: String,
    videoId: String,
    
    // Platform status
    status: {
      type: String,
      enum: ['pending', 'active', 'paused', 'failed', 'completed'],
      default: 'pending'
    },
    
    // Deployment info
    deployedAt: Date,
    lastSyncedAt: Date,
    
    // Error tracking
    error: String,
    errorAt: Date
  }],
  
  // Creative Assets
  creative: {
    headline: String,
    description: String,
    websiteUrl: String,
    callToAction: String,
    
    // Video info
    videoFile: {
      filename: String,
      size: Number,
      duration: Number,
      format: String,
      uploadedAt: Date
    },
    
    // AI Analysis
    aiAnalysis: {
      videoQuality: Number,
      hooks: [String],
      recommendations: [String],
      analyzedAt: Date
    }
  },
  
  // Performance Metrics (aggregated from all platforms)
  metrics: {
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 },
    spend: { type: Number, default: 0 },
    reach: { type: Number, default: 0 },
    
    // Calculated metrics
    ctr: { type: Number, default: 0 },
    cpc: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 },
    costPerConversion: { type: Number, default: 0 },
    
    // Last update
    lastUpdated: Date
  },
  
  // Historical performance data
  performanceHistory: [{
    date: { type: Date, required: true },
    platform: String,
    impressions: Number,
    clicks: Number,
    conversions: Number,
    spend: Number,
    reach: Number
  }],
  
  // Targeting
  targeting: {
    countries: [String],
    cities: [String],
    ageMin: Number,
    ageMax: Number,
    gender: {
      type: String,
      enum: ['all', 'male', 'female']
    },
    interests: [String],
    languages: [String]
  },
  
  // Schedule
  schedule: {
    startDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    endDate: Date,
    timezone: {
      type: String,
      default: 'Asia/Jerusalem'
    }
  },
  
  // Notes and metadata
  notes: String,
  tags: [String],
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  deployedAt: Date,
  pausedAt: Date,
  completedAt: Date,
  cancelledAt: Date,
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for performance
campaignSchema.index({ userId: 1, status: 1 });
campaignSchema.index({ userId: 1, createdAt: -1 });
campaignSchema.index({ 'platforms.name': 1 });
campaignSchema.index({ 'schedule.startDate': 1, 'schedule.endDate': 1 });

// Virtual for active platforms count
campaignSchema.virtual('activePlatformsCount').get(function() {
  return this.platforms.filter(p => p.status === 'active').length;
});

// Method to update metrics from platform data
campaignSchema.methods.updateMetrics = function(platformMetrics) {
  // Aggregate metrics from all platforms
  let totalImpressions = 0;
  let totalClicks = 0;
  let totalConversions = 0;
  let totalSpend = 0;
  let totalReach = 0;
  
  platformMetrics.forEach(pm => {
    totalImpressions += pm.impressions || 0;
    totalClicks += pm.clicks || 0;
    totalConversions += pm.conversions || 0;
    totalSpend += pm.spend || 0;
    totalReach += pm.reach || 0;
  });
  
  // Update metrics
  this.metrics.impressions = totalImpressions;
  this.metrics.clicks = totalClicks;
  this.metrics.conversions = totalConversions;
  this.metrics.spend = totalSpend;
  this.metrics.reach = totalReach;
  
  // Calculate derived metrics
  this.metrics.ctr = totalImpressions > 0 ? (totalClicks / totalImpressions * 100) : 0;
  this.metrics.cpc = totalClicks > 0 ? (totalSpend / totalClicks) : 0;
  this.metrics.conversionRate = totalClicks > 0 ? (totalConversions / totalClicks * 100) : 0;
  this.metrics.costPerConversion = totalConversions > 0 ? (totalSpend / totalConversions) : 0;
  this.metrics.lastUpdated = new Date();
  
  return this.save();
};

// Method to add performance history entry
campaignSchema.methods.addPerformanceEntry = function(platform, data) {
  this.performanceHistory.push({
    date: new Date(),
    platform: platform,
    impressions: data.impressions || 0,
    clicks: data.clicks || 0,
    conversions: data.conversions || 0,
    spend: data.spend || 0,
    reach: data.reach || 0
  });
  
  // Keep only last 90 days
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  this.performanceHistory = this.performanceHistory.filter(
    entry => entry.date >= ninetyDaysAgo
  );
  
  return this.save();
};

// Method to pause campaign
campaignSchema.methods.pause = async function() {
  this.status = 'paused';
  this.pausedAt = new Date();
  
  // Update platform status
  this.platforms.forEach(platform => {
    if (platform.status === 'active') {
      platform.status = 'paused';
    }
  });
  
  return this.save();
};

// Method to resume campaign
campaignSchema.methods.resume = async function() {
  this.status = 'active';
  this.pausedAt = null;
  
  // Update platform status
  this.platforms.forEach(platform => {
    if (platform.status === 'paused') {
      platform.status = 'active';
    }
  });
  
  return this.save();
};

// Method to cancel campaign
campaignSchema.methods.cancel = async function() {
  this.status = 'cancelled';
  this.cancelledAt = new Date();
  
  // Update platform status
  this.platforms.forEach(platform => {
    if (platform.status === 'active' || platform.status === 'paused') {
      platform.status = 'completed';
    }
  });
  
  return this.save();
};

// Get campaign summary (without full history)
campaignSchema.methods.toSummary = function() {
  return {
    id: this._id,
    name: this.name,
    goal: this.goal,
    status: this.status,
    platforms: this.platforms.map(p => ({
      name: p.name,
      status: p.status,
      campaignId: p.campaignId
    })),
    budget: this.budget,
    metrics: this.metrics,
    schedule: this.schedule,
    createdAt: this.createdAt,
    deployedAt: this.deployedAt
  };
};

const Campaign = mongoose.model('Campaign', campaignSchema);

module.exports = Campaign;

