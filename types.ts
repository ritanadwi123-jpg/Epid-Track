
export enum DiseaseCategory {
  INFECTIOUS = 'Infectious',
  NON_COMMUNICABLE = 'Non-Communicable',
  RESPIRATORY = 'Respiratory',
  WATERBORNE = 'Waterborne',
  ZOONOTIC = 'Zoonotic'
}

export enum CaseStatus {
  ACTIVE = 'Active',
  RESOLVED = 'Resolved',
  OUTBREAK = 'Outbreak'
}

export enum LabStatus {
  NOT_TESTED = 'Not Tested',
  PENDING = 'Pending',
  POSITIVE = 'Positive',
  NEGATIVE = 'Negative'
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other'
}

export interface EpidemiologicalInvestigation {
  symptoms: string[];
  onsetDate: string;
  travelHistory: string;
  contactCount: number;
  labStatus: LabStatus;
  exposureSource: string;
  investigatorName: string;
  updatedAt: string;
}

export interface DiseaseRecord {
  id: string;
  patientName: string;
  patientAge: number;
  patientGender: Gender;
  diseaseName: string;
  category: DiseaseCategory;
  date: string;
  location: string;
  status: CaseStatus;
  notes?: string;
  investigation?: EpidemiologicalInvestigation;
}

export interface AIAnalysisResult {
  summary: string;
  recommendations: string[];
  googleAppsScript: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}
