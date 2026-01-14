
import React from 'react';
import { DiseaseRecord, CaseStatus } from '../types';
import { Users, AlertTriangle, CheckCircle, Activity } from 'lucide-react';

interface StatsCardsProps {
  records: DiseaseRecord[];
}

export const StatsCards: React.FC<StatsCardsProps> = ({ records }) => {
  const totalPatients = records.length;
  const activeCases = records.filter(r => r.status === CaseStatus.ACTIVE).length;
  const outbreakCases = records.filter(r => r.status === CaseStatus.OUTBREAK).length;
  
  // Find most frequent disease
  const counts = records.reduce((acc: any, r) => {
    acc[r.diseaseName] = (acc[r.diseaseName] || 0) + 1;
    return acc;
  }, {});
  const topDisease = Object.entries(counts).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || 'N/A';

  const stats = [
    { label: 'Total Patients', value: totalPatients, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Reports', value: activeCases, icon: Activity, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Outbreak Linked', value: outbreakCases, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Prevalent Disease', value: topDisease, icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, idx) => (
        <div key={idx} className={`${stat.bg} p-4 rounded-xl border border-white shadow-sm flex items-center`}>
          <div className={`${stat.color} p-3 rounded-lg bg-white mr-4 shadow-sm`}>
            <stat.icon size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
