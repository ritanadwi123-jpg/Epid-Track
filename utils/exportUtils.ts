
import { DiseaseRecord } from '../types';

export const exportToCSV = (records: DiseaseRecord[]) => {
  // Define headers
  const headers = [
    'Patient ID',
    'Patient Name',
    'Age',
    'Gender',
    'Disease Name',
    'Category',
    'Report Date',
    'Location',
    'Case Status',
    'PE Status',
    'Symptoms',
    'Onset Date',
    'Travel History',
    'Contact Count',
    'Lab Status',
    'Exposure Source',
    'Investigator'
  ];

  // Map data to rows
  const rows = records.map(record => {
    const inv = record.investigation;
    return [
      record.id,
      `"${record.patientName.replace(/"/g, '""')}"`,
      record.patientAge,
      record.patientGender,
      `"${record.diseaseName}"`,
      record.category,
      record.date,
      `"${record.location}"`,
      record.status,
      inv ? 'Completed' : 'Pending',
      inv ? `"${inv.symptoms.join('; ')}"` : '',
      inv ? inv.onsetDate : '',
      inv ? `"${inv.travelHistory.replace(/"/g, '""')}"` : '',
      inv ? inv.contactCount : 0,
      inv ? inv.labStatus : 'Not Tested',
      inv ? `"${inv.exposureSource}"` : '',
      inv ? `"${inv.investigatorName}"` : ''
    ];
  });

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  // Create blob and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  const timestamp = new Date().toISOString().split('T')[0];
  link.setAttribute('href', url);
  link.setAttribute('download', `EpiTrack_Data_${timestamp}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
