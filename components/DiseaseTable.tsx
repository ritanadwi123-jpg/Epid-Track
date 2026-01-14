
import React from 'react';
import { DiseaseRecord, CaseStatus, Gender } from '../types';
import { CATEGORY_COLORS } from '../constants';
import { Trash2, Edit3, MapPin, Calendar, ClipboardList, CheckCircle2, Clock, User } from 'lucide-react';

interface DiseaseTableProps {
  records: DiseaseRecord[];
  onDelete: (id: string) => void;
  onInvestigate: (record: DiseaseRecord) => void;
}

export const DiseaseTable: React.FC<DiseaseTableProps> = ({ records, onDelete, onInvestigate }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
        <h3 className="font-semibold text-gray-700">Patient Case Registry (By Name)</h3>
        <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total: {records.length} Patients</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-6 py-3">Patient Identity</th>
              <th className="px-6 py-3">Diagnosis</th>
              <th className="px-6 py-3">Location & Date</th>
              <th className="px-6 py-3 text-center">PE Status</th>
              <th className="px-6 py-3 text-center">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {records.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                      <User size={16} />
                    </div>
                    <div>
                      <div className="font-bold text-gray-800">{record.patientName}</div>
                      <div className="text-[10px] text-gray-400 font-medium uppercase">
                        {record.patientAge} Yrs • {record.patientGender}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-700">{record.diseaseName}</span>
                    <span className={`w-fit mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold tracking-tight uppercase ${CATEGORY_COLORS[record.category]}`}>
                      {record.category}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className="flex items-center text-gray-600 text-xs">
                      <MapPin size={12} className="mr-1 text-gray-400" /> {record.location}
                    </span>
                    <span className="flex items-center text-gray-400 text-[10px]">
                      <Calendar size={12} className="mr-1" /> {record.date}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  {record.investigation ? (
                    <div className="flex flex-col items-center gap-1">
                      <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">
                        <CheckCircle2 size={12} /> Done
                      </span>
                    </div>
                  ) : (
                    <span className="flex items-center gap-1 mx-auto w-fit text-orange-400 bg-orange-50 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">
                      <Clock size={12} /> Required
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    record.status === CaseStatus.OUTBREAK ? 'text-red-600 bg-red-50' : 
                    record.status === CaseStatus.ACTIVE ? 'text-orange-600 bg-orange-50' : 
                    'text-green-600 bg-green-50'
                  }`}>
                    {record.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => onInvestigate(record)}
                      title="Clinical Investigation (PE)"
                      className="p-1.5 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                    >
                      <ClipboardList size={18} />
                    </button>
                    <button 
                      onClick={() => onDelete(record.id)}
                      className="p-1.5 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
