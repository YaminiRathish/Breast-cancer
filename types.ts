
export enum AppView {
  HOME = 'HOME',
  DIAGNOSIS = 'DIAGNOSIS',
  HISTORY = 'HISTORY',
  ADMIN_PANEL = 'ADMIN_PANEL',
  MAILBOX = 'MAILBOX'
}

export enum DiagnosisMode {
  IMAGE = 'IMAGE',
  CLINICAL = 'CLINICAL'
}

export enum ProcessingStep {
  IDLE = 'IDLE',
  PREPROCESSING = 'PREPROCESSING',
  CNN_EXTRACTION = 'CNN_EXTRACTION',
  ML_CLASSIFICATION = 'ML_CLASSIFICATION',
  XAI_CALCULATION = 'XAI_CALCULATION',
  AI_INSIGHTS = 'AI_INSIGHTS',
  COMPLETE = 'COMPLETE'
}

export type SeverityLevel = string;

export enum CystType {
  SIMPLE = 'Simple Cyst',
  COMPLICATED = 'Complicated Cyst',
  COMPLEX = 'Complex Cystic and Solid Mass',
  OIL = 'Oil Cyst',
  GALACTOCELE = 'Galactocele',
  SEBACEOUS = 'Sebaceous Cyst'
}

export interface FeatureImportance {
  feature: string;
  value: number;
  impact: 'positive' | 'negative';
}

export interface DiagnosisResult {
  id: string;
  timestamp: number;
  mode: DiagnosisMode;
  prediction: 'Malignant' | 'Benign' | 'Normal' | 'Cyst';
  cystType?: string;
  severity: SeverityLevel;
  confidence: number;
  imageUrl?: string;
  shapValues: FeatureImportance[];
  aiInterpretation: string;
  localizedFindings: string;
  roi: { x: number; y: number; width: number; height: number };
  isMedicalAlert: boolean;
}

export interface Clinician {
  name: string;
  email: string;
  id: string;
  role: string;
  isVerified: boolean;
  onboardedAt: number;
  isAdmin?: boolean;
  password?: string;
  avatar?: string;
}

export interface OnboardingRequest {
  id: string;
  name: string;
  email: string;
  licenseNumber: string;
  hospital: string;
  role: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  timestamp: number;
  faceImageData?: string;
  password?: string;
}

export interface InternalEmail {
  id: string;
  sender: string;
  senderEmail: string;
  recipient: string;
  subject: string;
  body: string;
  timestamp: number;
  isRead: boolean;
  type: string;
}

export enum ClinicianRole {
  ONCOLOGIST = 'Senior Oncologist',
  RADIOLOGIST = 'Radiologist',
  PATHOLOGIST = 'Pathologist',
  RESEARCHER = 'Research Lead'
}
