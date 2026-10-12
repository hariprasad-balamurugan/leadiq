import { Schema, model, Document } from 'mongoose';

export interface IContact {
  name: string;
  title: string;
  email: string;
  phone?: string;
  linkedin?: string;
}

export interface IScoreBreakdown {
  signal: string;
  maxPoints: number;
  points: number;
  matched: boolean;
  description: string;
}

export interface ILead extends Document {
  name: string;
  website: string;
  industry: string;
  location: string;
  employeeCount: number;
  technologies: string[];
  revenueEstimate: number;
  growthSignals: string[];
  contact: IContact;
  leadScore: number;
  priority: 'High' | 'Medium' | 'Low';
  scoreBreakdown: IScoreBreakdown[];
  verified: boolean;
  isSaved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true, trim: true, index: true },
    website: { 
      type: String, 
      required: true, 
      trim: true,
      match: [/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/, 'Please provide a valid website URL']
    },
    industry: { type: String, required: true, trim: true, index: true },
    location: { type: String, required: true, trim: true, index: true },
    employeeCount: { type: Number, required: true, min: 1 },
    technologies: [{ type: String, trim: true }],
    revenueEstimate: { type: Number, default: 0, min: 0 },
    growthSignals: [{ type: String, trim: true }],
    contact: {
      name: { type: String, required: true },
      title: { type: String, required: true },
      email: { 
        type: String, 
        required: true, 
        index: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
      },
      phone: { type: String },
      linkedin: { type: String }
    },
    leadScore: { type: Number, default: 0, index: true },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Low',
      index: true
    },
    scoreBreakdown: [
      {
        signal: { type: String, required: true },
        maxPoints: { type: Number, required: true },
        points: { type: Number, required: true },
        matched: { type: Boolean, required: true },
        description: { type: String, required: true }
      }
    ],
    verified: { type: Boolean, default: false },
    isSaved: { type: Boolean, default: false, index: true }
  },
  {
    timestamps: true
  }
);

// Compound index for fast deduplication checks
LeadSchema.index({ website: 1, 'contact.email': 1 });

export const LeadModel = model<ILead>('Lead', LeadSchema);
