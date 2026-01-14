
import { DiseaseRecord, DiseaseCategory, CaseStatus, Gender } from './types';

export const INITIAL_DATA: DiseaseRecord[] = [
  {
    id: 'P-001',
    patientName: 'Budi Sudarsono',
    patientAge: 28,
    patientGender: Gender.MALE,
    diseaseName: 'Dengue Fever',
    category: DiseaseCategory.ZOONOTIC,
    date: '2023-10-15',
    location: 'Jakarta Selatan',
    status: CaseStatus.ACTIVE,
    notes: 'High fever and joint pain.'
  },
  {
    id: 'P-002',
    patientName: 'Siti Aminah',
    patientAge: 34,
    patientGender: Gender.FEMALE,
    diseaseName: 'Influenza A',
    category: DiseaseCategory.RESPIRATORY,
    date: '2023-11-02',
    location: 'Surabaya Pusat',
    status: CaseStatus.OUTBREAK,
    notes: 'Close contact with P-005.'
  },
  {
    id: 'P-003',
    patientName: 'Anton Wijaya',
    patientAge: 55,
    patientGender: Gender.MALE,
    diseaseName: 'Malaria',
    category: DiseaseCategory.ZOONOTIC,
    date: '2023-09-20',
    location: 'Papua Barat',
    status: CaseStatus.RESOLVED,
    notes: 'Travel history to endemic area.'
  },
  {
    id: 'P-004',
    patientName: 'Lina Marlina',
    patientAge: 9,
    patientGender: Gender.FEMALE,
    diseaseName: 'Dengue Fever',
    category: DiseaseCategory.ZOONOTIC,
    date: '2023-10-16',
    location: 'Jakarta Selatan',
    status: CaseStatus.ACTIVE
  }
];

export const CATEGORY_COLORS: Record<DiseaseCategory, string> = {
  [DiseaseCategory.INFECTIOUS]: 'bg-red-100 text-red-800',
  [DiseaseCategory.NON_COMMUNICABLE]: 'bg-blue-100 text-blue-800',
  [DiseaseCategory.RESPIRATORY]: 'bg-purple-100 text-purple-800',
  [DiseaseCategory.WATERBORNE]: 'bg-teal-100 text-teal-800',
  [DiseaseCategory.ZOONOTIC]: 'bg-orange-100 text-orange-800'
};
