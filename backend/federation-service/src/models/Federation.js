import mongoose from 'mongoose';

const federationSchema = new mongoose.Schema({
  // Basic Federation Information
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  
  // Contact Information
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  website: String,
  
  // Location Information
  address: {
    street: String,
    city: String,
    state: String,
    country: {
      type: String,
      required: true
    },
    postalCode: String
  },
  region: {
    type: String,
    required: true,
    enum: ['africa', 'europe', 'asia', 'north-america', 'south-america', 'oceania']
  },
  
  // Sports Coverage
  sports: [{
    sport: {
      type: String,
      required: true,
      enum: ['football', 'basketball', 'rugby', 'athletics', 'cricket', 'tennis', 'swimming']
    },
    levels: [String] // ['youth', 'amateur', 'professional']
  }],
  
  // Verification & Accreditation
  accreditationLevel: {
    type: String,
    enum: ['local', 'regional', 'national', 'international'],
    default: 'local'
  },
  accreditationId: String,
  accreditationDate: Date,
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Platform admin who verified them
  },
  
  // Statistics
  stats: {
    totalPlayers: { type: Number, default: 0 },
    activePlayers: { type: Number, default: 0 },
    totalMatches: { type: Number, default: 0 },
    scoutsRegistered: { type: Number, default: 0 }
  },
  
  // Settings & Preferences
  settings: {
    autoVerifyPlayers: { type: Boolean, default: false },
    allowScoutAccess: { type: Boolean, default: true },
    dataRetentionDays: { type: Number, default: 365 }
  }
}, {
  timestamps: true
});

// Index for efficient searching
federationSchema.index({ name: 'text', description: 'text' });
federationSchema.index({ region: 1, country: 1 });
federationSchema.index({ 'sports.sport': 1 });

// Virtual for contact information
federationSchema.virtual('contactInfo').get(function() {
  return {
    email: this.email,
    phone: this.phone,
    website: this.website,
    address: this.address
  };
});

// Method to add a sport
federationSchema.methods.addSport = function(sport, levels) {
  this.sports.push({ sport, levels });
  return this.save();
};

// Static method to find federations by region and sport
federationSchema.statics.findByRegionAndSport = function(region, sport) {
  return this.find({
    region: region,
    'sports.sport': sport
  });
};

export default mongoose.model('Federation', federationSchema);
