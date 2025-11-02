const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'נא להזין כתובת אימייל תקינה']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  
  // Subscription Plan
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'regular', 'unlimited'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'cancelled', 'expired'],
      default: 'active'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date,
      default: function() {
        // Free plan - expires in 1 year
        const date = new Date();
        date.setFullYear(date.getFullYear() + 1);
        return date;
      }
    },
    price: {
      type: Number,
      default: 0
    },
    billingCycle: {
      type: String,
      enum: ['free', 'monthly', 'yearly'],
      default: 'free'
    }
  },
  
  // Usage Tracking
  usage: {
    analysesCount: {
      type: Number,
      default: 0
    },
    analysesLimit: {
      type: Number,
      default: 3 // Free plan default
    },
    currentPeriodStart: {
      type: Date,
      default: Date.now
    },
    currentPeriodEnd: {
      type: Date,
      default: function() {
        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        return date;
      }
    },
    lastAnalysisDate: Date
  },
  
  // Connected Platforms
  connectedPlatforms: {
    facebook: {
      connected: { type: Boolean, default: false },
      accessToken: String,
      pageId: String,
      accountId: String,
      connectedAt: Date
    },
    google: {
      connected: { type: Boolean, default: false },
      accessToken: String,
      refreshToken: String,
      customerId: String,
      connectedAt: Date
    },
    tiktok: {
      connected: { type: Boolean, default: false },
      accessToken: String,
      advertiserIds: [String],
      connectedAt: Date
    }
  },
  
  // Campaigns History
  campaigns: [{
    campaignId: String,
    name: String,
    goal: String,
    platforms: [String],
    budget: Number,
    status: String,
    createdAt: { type: Date, default: Date.now },
    deployedAt: Date,
    results: mongoose.Schema.Types.Mixed
  }],
  
  // User Settings
  settings: {
    language: {
      type: String,
      enum: ['hebrew', 'english'],
      default: 'hebrew'
    },
    notifications: {
      email: { type: Boolean, default: true },
      campaignUpdates: { type: Boolean, default: true },
      billingAlerts: { type: Boolean, default: true }
    },
    timezone: {
      type: String,
      default: 'Asia/Jerusalem'
    }
  },
  
  // Payment Information
  payment: {
    stripeCustomerId: String,
    paymentMethod: String,
    lastPaymentDate: Date,
    nextBillingDate: Date,
    paymentHistory: [{
      date: Date,
      amount: Number,
      currency: { type: String, default: 'ILS' },
      status: String,
      invoiceId: String,
      description: String
    }]
  },
  
  // Account Status
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  
  passwordResetToken: String,
  passwordResetExpires: Date,
  
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  
  // Account metadata
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ 'subscription.plan': 1 });
userSchema.index({ 'subscription.status': 1 });
userSchema.index({ 'usage.currentPeriodEnd': 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to check if user can analyze (based on plan limits)
userSchema.methods.canAnalyze = function() {
  const now = new Date();
  
  // Check if subscription is active
  if (this.subscription.status !== 'active') {
    return { allowed: false, reason: 'subscription_inactive' };
  }
  
  // Check if subscription expired
  if (this.subscription.endDate < now) {
    return { allowed: false, reason: 'subscription_expired' };
  }
  
  // Check if current period expired (reset counter)
  if (this.usage.currentPeriodEnd < now) {
    this.usage.analysesCount = 0;
    this.usage.currentPeriodStart = now;
    const periodEnd = new Date(now);
    periodEnd.setMonth(periodEnd.getMonth() + 1);
    this.usage.currentPeriodEnd = periodEnd;
  }
  
  // Unlimited plan
  if (this.subscription.plan === 'unlimited') {
    return { allowed: true };
  }
  
  // Check usage limits
  if (this.usage.analysesCount >= this.usage.analysesLimit) {
    return { 
      allowed: false, 
      reason: 'limit_reached',
      current: this.usage.analysesCount,
      limit: this.usage.analysesLimit
    };
  }
  
  return { allowed: true };
};

// Method to increment analysis count
userSchema.methods.incrementAnalysisCount = function() {
  this.usage.analysesCount += 1;
  this.usage.lastAnalysisDate = new Date();
  return this.save();
};

// Method to upgrade subscription
userSchema.methods.upgradeSubscription = function(plan, price, billingCycle) {
  this.subscription.plan = plan;
  this.subscription.price = price;
  this.subscription.billingCycle = billingCycle;
  this.subscription.status = 'active';
  this.subscription.startDate = new Date();
  
  const endDate = new Date();
  if (billingCycle === 'monthly') {
    endDate.setMonth(endDate.getMonth() + 1);
  } else if (billingCycle === 'yearly') {
    endDate.setFullYear(endDate.getFullYear() + 1);
  }
  this.subscription.endDate = endDate;
  
  // Update usage limits
  switch(plan) {
    case 'free':
      this.usage.analysesLimit = 3;
      break;
    case 'regular':
      this.usage.analysesLimit = 30;
      break;
    case 'unlimited':
      this.usage.analysesLimit = -1; // Unlimited
      break;
  }
  
  return this.save();
};

// Virtual for account lock
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Method to handle failed login attempts
userSchema.methods.incLoginAttempts = function() {
  // If previous lock has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  const maxAttempts = 5;
  const lockTime = 2 * 60 * 60 * 1000; // 2 hours
  
  // Lock account after max attempts
  if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + lockTime };
  }
  
  return this.updateOne(updates);
};

// Get user safe object (without sensitive data)
userSchema.methods.toSafeObject = function() {
  return {
    id: this._id,
    email: this.email,
    name: this.name,
    phone: this.phone,
    subscription: {
      plan: this.subscription.plan,
      status: this.subscription.status,
      endDate: this.subscription.endDate,
      price: this.subscription.price
    },
    usage: {
      analysesCount: this.usage.analysesCount,
      analysesLimit: this.usage.analysesLimit,
      currentPeriodEnd: this.usage.currentPeriodEnd
    },
    connectedPlatforms: {
      facebook: { connected: this.connectedPlatforms.facebook.connected },
      google: { connected: this.connectedPlatforms.google.connected },
      tiktok: { connected: this.connectedPlatforms.tiktok.connected }
    },
    settings: this.settings,
    isEmailVerified: this.isEmailVerified,
    createdAt: this.createdAt
  };
};

const User = mongoose.model('User', userSchema);

module.exports = User;

