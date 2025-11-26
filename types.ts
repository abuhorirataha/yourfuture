
import { ReactNode } from 'react';

export type SimulationMode = 'PERSONAL' | 'BUSINESS' | 'STUDENT' | 'GOVERNMENT';

// AI Analysis Result Structure
export interface AnalysisResult {
  riskLevel: 'DANGER' | 'WARNING' | 'NEUTRAL' | 'POSITIVE';
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  prediction: string;
  strategy: string;
  executionSteps: string[]; // New field for actionable steps
}

// Personal Inputs
export interface PersonalProfile {
  fullName: string;
  age: string;
  jobTitle: string;
  monthlyIncome: string;
  savings: string;
  healthStatus: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  socialStatus: 'SINGLE' | 'MARRIED' | 'FAMILY';
  lifestyle: 'ACTIVE' | 'SEDENTARY' | 'STRESSED';
  decision: string; // The specific decision they want to analyze
}

export interface UserState {
  age: number;
  job: string;
  salary: number;
  savings: number;
  stress: number;
  health: number;
  // Student Specific
  studentLevel?: 'PRIMARY' | 'MIDDLE' | 'SECONDARY';
  studentStream?: 'SCIENTIFIC' | 'LITERARY';
  subjectGrades?: Record<string, number>;
  hobbies?: string;
  electiveSubject?: string;
}

// Business Inputs
export interface BusinessProfile {
  companyName: string;
  industry: string;
  capital: string;
  targetMarket: string;
  decision: string; // Replaced competitors with decision
}

// Government Inputs
export interface GovernmentProfile {
  entityName: string;
  sector: string;
  population: string;
  challenges: string;
  goals: string;
  planningPeriod: 'SHORT' | 'MEDIUM' | 'LONG';
}

export interface TimelinePoint {
  period: string;
  // Personal
  health?: number;
  wealth?: number;
  relationships?: number;
  happiness?: number;
  // Business
  revenue?: number;
  marketShare?: number;
  innovation?: number;
  brandReputation?: number;
  // Student
  academicFit?: number;
  marketDemand?: number;
  skillDevelopment?: number;
  financialProspects?: number;
  // Government
  publicSatisfaction?: number;
  economicGrowth?: number;
  socialStability?: number;
  internationalStanding?: number;
}

// Digital Sudan App Types (Legacy/Future Use)
export interface UserProfile {
  nationalId: string;
  fullName: string;
  birthDate?: string;
  bloodType?: string;
  jobTitle?: string;
  address?: string;
  phoneNumber?: string;
  isVerified?: boolean;
  photoUrl?: string;
}

export interface ServiceDefinition {
  id: string;
  title: string;
  category: string;
  icon: ReactNode;
  fees: number;
  requiredDocs: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}