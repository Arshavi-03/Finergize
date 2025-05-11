import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import axios from 'axios';

// Define interfaces for our survey data types
interface SurveyResponse {
  questionId: string;
  response: string | number | string[];
  timestamp: Date;
}

interface PreliminarySurveyData {
  location: string;
  age: string;
  interest: string;
  literacy_level: string;
  completedAt?: Date;
}

interface RecommendationFeature {
  id: string;
  name: string;
  score: number;
  explanation: string;
  tip: string;
}

interface UserProfile {
  knowledge_level: string;
  income_level: string;
}

interface RecommendationResult {
  prioritized_features: RecommendationFeature[];
  user_profile: UserProfile;
  generatedAt?: Date;
}

interface SurveyResponsesObject {
  [key: string]: string | number | string[];
}

// Schema for security events
const securityEventSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['PIN_SETUP', 'PIN_CHANGE', 'PIN_VERIFIED', 'PIN_BLOCKED', 'PIN_RESET', 'BIOMETRIC_SETUP', 'BIOMETRIC_VERIFIED', 'PHONE_VERIFIED'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  details: String,
  metadata: mongoose.Schema.Types.Mixed
});

// Schema for survey responses
const surveyResponseSchema = new mongoose.Schema({
  questionId: String,
  response: mongoose.Schema.Types.Mixed, // Can be string, number, or array
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

// Schema for preliminary survey data
const preliminarySurveySchema = new mongoose.Schema({
  location: String,
  age: String,
  interest: String,
  literacy_level: String,
  completedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

// Schema for recommendations
const recommendationSchema = new mongoose.Schema({
  id: String,
  name: String,
  score: Number,
  explanation: String,
  tip: String
}, { _id: false });

// Schema for user profile from recommendations
const userProfileSchema = new mongoose.Schema({
  knowledge_level: String,
  income_level: String
}, { _id: false });

// Schema for full recommendation results
const recommendationResultSchema = new mongoose.Schema({
  prioritized_features: [recommendationSchema],
  user_profile: userProfileSchema,
  generatedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

// Main user schema with survey section added
const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  phone: { 
    type: String, 
    required: true, 
    unique: true 
  },
  village: { 
    type: String, 
    required: true 
  },
  district: { 
    type: String, 
    required: true 
  },
  state: { 
    type: String, 
    required: true 
  },
  pincode: { 
    type: String, 
    required: true 
  },
  aadhaarNumber: { 
    type: String, 
    required: true, 
    unique: true 
  },
  preferredLanguage: { 
    type: String, 
    default: 'english' 
  },

  // Add survey section
  survey: {
    preliminary: preliminarySurveySchema,
    responses: [surveyResponseSchema],
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: Date,
    recommendations: recommendationResultSchema
  },

  // Keep existing security section
  security: {
    biometric: {
      enabled: { 
        type: Boolean, 
        default: false 
      },
      deviceId: { 
        type: String 
      },
      lastVerified: { 
        type: Date 
      }
    },

    pin: {
      enabled: { 
        type: Boolean, 
        default: false 
      },
      value: { 
        type: String 
      },
      lastChanged: { 
        type: Date 
      },
      attempts: { 
        type: Number, 
        default: 0 
      },
      blocked: { 
        type: Boolean, 
        default: false 
      },
      blockExpires: { 
        type: Date 
      },
      requiresChange: { 
        type: Boolean, 
        default: false 
      }
    },

    previousPins: {
      type: [String],
      default: [],
      validate: [
        function(val: string[]) {
          return val.length <= 3;
        },
        'Cannot store more than 3 previous PINs'
      ]
    },

    phoneVerified: { 
      type: Boolean, 
      default: false 
    },
    phoneVerificationCode: { 
      type: String 
    },
    phoneVerificationExpiry: { 
      type: Date 
    },

    events: {
      type: [securityEventSchema],
      default: []
    },

    lastSuccessfulLogin: { 
      type: Date 
    },
    lastFailedLogin: { 
      type: Date 
    }
  }
}, {
  timestamps: true
});

// Add interface for User document
interface UserDocument extends mongoose.Document {
  name: string;
  phone: string;
  village: string;
  district: string;
  state: string;
  pincode: string;
  aadhaarNumber: string;
  preferredLanguage: string;
  survey?: {
    preliminary?: PreliminarySurveyData;
    responses: SurveyResponse[];
    completed: boolean;
    completedAt?: Date;
    recommendations?: RecommendationResult;
  };
  security: {
    biometric: {
      enabled: boolean;
      deviceId?: string;
      lastVerified?: Date;
    };
    pin: {
      enabled: boolean;
      value?: string;
      lastChanged?: Date;
      attempts: number;
      blocked: boolean;
      blockExpires?: Date;
      requiresChange: boolean;
    };
    previousPins: string[];
    phoneVerified: boolean;
    phoneVerificationCode?: string;
    phoneVerificationExpiry?: Date;
    events: Array<{
      type: string;
      timestamp: Date;
      details?: string;
      metadata?: Record<string, unknown>;
    }>;
    lastSuccessfulLogin?: Date;
    lastFailedLogin?: Date;
  };
  
  // Methods
  isPinBlocked(): boolean;
  verifyPin(pin: string): Promise<boolean>;
  recordFailedPinAttempt(): Promise<void>;
  resetPinAttempts(): Promise<void>;
  setPin(pin: string): Promise<void>;
  resetPin(): Promise<string>;
  changePin(currentPin: string, newPin: string): Promise<void>;
  setPreliminarySurvey(data: PreliminarySurveyData): Promise<PreliminarySurveyData>;
  fetchSurveyQuestions(): Promise<unknown[]>;
  addSurveyResponse(questionId: string, response: string | number | string[]): Promise<SurveyResponse[]>;
  submitSurvey(): Promise<RecommendationResult>;
  getSurveyResponsesForApi(): SurveyResponsesObject;
  resetSurvey(): Promise<{ responses: SurveyResponse[]; completed: boolean }>;
}

// Maintain existing indexes
userSchema.index({ 'security.pin.enabled': 1 });
userSchema.index({ phone: 1 });
userSchema.index({ aadhaarNumber: 1 });
// Add index for survey completion status
userSchema.index({ 'survey.completed': 1 });

// Maintain all existing methods
userSchema.methods.isPinBlocked = function(this: UserDocument): boolean {
  if (!this.security.pin.blocked) return false;
  if (!this.security.pin.blockExpires) return false;
  return new Date() < this.security.pin.blockExpires;
};

userSchema.methods.verifyPin = async function(this: UserDocument, pin: string): Promise<boolean> {
  if (this.isPinBlocked()) {
    const timeLeft = Math.ceil((this.security.pin.blockExpires!.getTime() - Date.now()) / (1000 * 60));
    throw new Error(`PIN is blocked. Try again in ${timeLeft} minutes.`);
  }

  const isValid = await bcrypt.compare(pin, this.security.pin.value!);
  
  if (!isValid) {
    await this.recordFailedPinAttempt();
    const remainingAttempts = 5 - this.security.pin.attempts;
    throw new Error(`Invalid PIN. ${remainingAttempts} attempts remaining`);
  }

  await this.resetPinAttempts();
  
  this.security.events.push({
    type: 'PIN_VERIFIED',
    timestamp: new Date(),
    details: 'PIN verified successfully'
  });

  return true;
};

userSchema.methods.recordFailedPinAttempt = async function(this: UserDocument): Promise<void> {
  this.security.pin.attempts += 1;
  this.security.lastFailedLogin = new Date();
  
  if (this.security.pin.attempts >= 5) {
    this.security.pin.blocked = true;
    this.security.pin.blockExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes block
    
    this.security.events.push({
      type: 'PIN_BLOCKED',
      timestamp: new Date(),
      details: 'PIN blocked due to multiple failed attempts'
    });
  }
  
  await this.save();
};

userSchema.methods.resetPinAttempts = async function(this: UserDocument): Promise<void> {
  this.security.pin.attempts = 0;
  this.security.pin.blocked = false;
  this.security.pin.blockExpires = undefined;
  this.security.lastSuccessfulLogin = new Date();
  await this.save();
};

userSchema.methods.setPin = async function(this: UserDocument, pin: string): Promise<void> {
  if (!/^\d{4}$/.test(pin)) {
    throw new Error('PIN must be exactly 4 digits');
  }

  // Check if PIN was used before
  if (this.security.previousPins.length > 0) {
    for (const oldPin of this.security.previousPins) {
      if (await bcrypt.compare(pin, oldPin)) {
        throw new Error('Cannot reuse a previous PIN');
      }
    }
  }

  const hashedPin = await bcrypt.hash(pin, 10);
  
  // Store current PIN in previous PINs if it exists
  if (this.security.pin.value) {
    this.security.previousPins.push(this.security.pin.value);
    if (this.security.previousPins.length > 3) {
      this.security.previousPins.shift();
    }
  }

  this.security.pin.value = hashedPin;
  this.security.pin.enabled = true;
  this.security.pin.lastChanged = new Date();
  this.security.pin.attempts = 0;
  this.security.pin.blocked = false;
  this.security.pin.blockExpires = undefined;
  this.security.pin.requiresChange = false;
  
  this.security.events.push({
    type: 'PIN_SETUP',
    timestamp: new Date(),
    details: 'PIN successfully set'
  });

  await this.save();
};

userSchema.methods.resetPin = async function(this: UserDocument): Promise<string> {
  const tempPin = Math.floor(1000 + Math.random() * 9000).toString();
  await this.setPin(tempPin);
  
  this.security.pin.requiresChange = true;
  this.security.events.push({
    type: 'PIN_RESET',
    timestamp: new Date(),
    details: 'PIN reset to temporary value'
  });

  await this.save();
  return tempPin;
};

userSchema.methods.changePin = async function(this: UserDocument, currentPin: string, newPin: string): Promise<void> {
  const isValid = await this.verifyPin(currentPin);
  if (!isValid) {
    throw new Error('Current PIN is incorrect');
  }

  await this.setPin(newPin);
  
  this.security.events.push({
    type: 'PIN_CHANGE',
    timestamp: new Date(),
    details: 'PIN changed successfully'
  });

  await this.save();
};

// Add new methods for survey functionality

// Set preliminary survey data
userSchema.methods.setPreliminarySurvey = async function(this: UserDocument, data: PreliminarySurveyData): Promise<PreliminarySurveyData> {
  // Initialize survey if it doesn't exist
  if (!this.survey) {
    this.survey = {
      responses: [],
      completed: false
    };
  }
  
  this.survey.preliminary = {
    location: data.location,
    age: data.age,
    interest: data.interest,
    literacy_level: data.literacy_level,
    completedAt: new Date()
  };
  
  await this.save();
  return this.survey.preliminary;
};

// Fetch survey questions from the API
userSchema.methods.fetchSurveyQuestions = async function(this: UserDocument): Promise<unknown[]> {
  if (!this.survey || !this.survey.preliminary) {
    throw new Error('Preliminary survey data must be set before fetching questions');
  }
  
  try {
    // Build query params from preliminary data
    const params = new URLSearchParams({
      location: this.survey.preliminary.location,
      age: this.survey.preliminary.age,
      interest: this.survey.preliminary.interest,
      literacy_level: this.survey.preliminary.literacy_level
    });
    
    // Call the external API
    const response = await axios.get(`https://finergize-recommend.onrender.com/api/survey?${params.toString()}`);
    
    if (!response.data.success || !Array.isArray(response.data.survey)) {
      throw new Error('Invalid response from survey API');
    }
    
    return response.data.survey;
  } catch (error) {
    console.error('Error fetching survey questions:', error);
    throw new Error('Failed to fetch survey questions');
  }
};

// Add or update a survey response
userSchema.methods.addSurveyResponse = async function(
  this: UserDocument, 
  questionId: string, 
  response: string | number | string[]
): Promise<SurveyResponse[]> {
  // Initialize survey if it doesn't exist
  if (!this.survey) {
    this.survey = {
      responses: [],
      completed: false
    };
  }
  
  // Find if response exists already
  const existingIndex = this.survey.responses.findIndex((r: SurveyResponse) => r.questionId === questionId);
  
  if (existingIndex >= 0) {
    // Update existing response
    this.survey.responses[existingIndex].response = response;
    this.survey.responses[existingIndex].timestamp = new Date();
  } else {
    // Add new response
    this.survey.responses.push({
      questionId,
      response,
      timestamp: new Date()
    });
  }
  
  await this.save();
  return this.survey.responses;
};

// Submit survey and get recommendations
userSchema.methods.submitSurvey = async function(this: UserDocument): Promise<RecommendationResult> {
  if (!this.survey || !this.survey.preliminary || this.survey.responses.length === 0) {
    throw new Error('Survey data is incomplete');
  }
  
  try {
    // Convert survey responses from array to object format for the API
    const responseObj: SurveyResponsesObject = {};
    this.survey.responses.forEach((item: SurveyResponse) => {
      responseObj[item.questionId] = item.response;
    });
    
    // Build request payload
    const requestData = {
      responses: responseObj,
      user_context: {
        location: this.survey.preliminary.location,
        age: this.survey.preliminary.age,
        interest: this.survey.preliminary.interest,
        literacy_level: this.survey.preliminary.literacy_level
      }
    };
    
    // Call the recommendations API
    const response = await axios.post('https://finergize-recommend.onrender.com/api/recommend', requestData);
    
    if (!response.data.success || !response.data.recommendations) {
      throw new Error('Invalid response from recommendation API');
    }
    
    // Save recommendations
    this.survey.recommendations = {
      prioritized_features: response.data.recommendations.prioritized_features,
      user_profile: response.data.recommendations.user_profile,
      generatedAt: new Date()
    };
    
    // Mark survey as completed
    this.survey.completed = true;
    this.survey.completedAt = new Date();
    
    await this.save();
    return this.survey.recommendations;
  } catch (error) {
    console.error('Error submitting survey:', error);
    throw new Error('Failed to get recommendations');
  }
};

// Get survey responses in a format suitable for the recommendation API
userSchema.methods.getSurveyResponsesForApi = function(this: UserDocument): SurveyResponsesObject {
  if (!this.survey || !this.survey.responses) {
    return {};
  }
  
  const responseObj: SurveyResponsesObject = {};
  this.survey.responses.forEach((item: SurveyResponse) => {
    responseObj[item.questionId] = item.response;
  });
  
  return responseObj;
};

// Reset survey data
userSchema.methods.resetSurvey = async function(this: UserDocument): Promise<{ responses: SurveyResponse[]; completed: boolean }> {
  this.survey = {
    responses: [],
    completed: false
  };
  await this.save();
  return this.survey;
};

export default (mongoose.models.User as mongoose.Model<UserDocument>) || 
  mongoose.model<UserDocument>('User', userSchema);