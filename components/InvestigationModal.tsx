
import React, { useState } from 'react';
import { DiseaseRecord, EpidemiologicalInvestigation, LabStatus } from '../types';
import { X, ClipboardCheck, User, MapPin, Beaker, Thermometer } from 'lucide-react';

interface InvestigationModalProps {
  record: DiseaseRecord;
  onClose: () => void;
  onSave: (investigation: EpidemiologicalInvestigation) => void;
}

export const InvestigationModal: React.FC<InvestigationModalProps> = ({ record, onClose, onSave }) => {
  const [formData, setFormData] = useState<EpidemiologicalInvestigation>(
    record.investigation || {
      symptoms: [],
      onsetDate: record.date,
      travelHistory: '',
      contactCount: 0,
      labStatus: LabStatus.NOT_TESTED,
      exposureSource: '',
      investigatorName: '',
      updatedAt: new Date().toISOString(),
    }
  );

  const symptomOptions = ['Fever', 'Cough', 'Shortness of Breath', 'Fatigue', 'Rash', 'Diarrhea', 'Joint Pain'];

  const toggleSymptom = (symptom: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, updatedAt: new Date().toISOString() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-indigo-50/50">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white p-2 rounded-lg shadow-md">
              <ClipboardCheck size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Penyelidikan Epidemiologi (PE)</h2>
              <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wide">
                Patient: {record.patientName} ({record.id})
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors bg-white p-1 rounded-full border">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <Thermometer size={14} /> Profil Klinis
              </h3>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2">Symptoms</label>
                <div className="flex flex-wrap gap-2">
                  {symptomOptions.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSymptom(s)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all border ${
                        formData.symptoms.includes(s)
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                          : 'bg-white border-gray-200 text-gray-500 hover:border-indigo-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Date of Onset</label>
                <input
                  type="date"
                  value={formData.onsetDate}
                  onChange={e => setFormData({ ...formData, onsetDate: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <MapPin size={14} /> Riwayat Paparan
              </h3>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Travel History (14 Days)</label>
                <textarea
                  value={formData.travelHistory}
                  onChange={e => setFormData({ ...formData, travelHistory: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none h-20 resize-none"
                  placeholder="Locations visited..."
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Source of Exposure</label>
                <input
                  type="text"
                  value={formData.exposureSource}
                  onChange={e => setFormData({ ...formData, exposureSource: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <Beaker size={14} /> Laboratorium
              </h3>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Specimen Status</label>
                <select
                  value={formData.labStatus}
                  onChange={e => setFormData({ ...formData, labStatus: e.target.value as LabStatus })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {Object.values(LabStatus).map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Close Contacts Identified</label>
                <input
                  type="number"
                  min="0"
                  value={formData.contactCount}
                  onChange={e => setFormData({ ...formData, contactCount: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <User size={14} /> Investigasi
              </h3>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Investigator Name</label>
                <input
                  type="text"
                  required
                  value={formData.investigatorName}
                  onChange={e => setFormData({ ...formData, investigatorName: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Enter officer name"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-3 pt-6 border-t border-gray-100">
            <button type="submit" className="flex-grow bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
              <ClipboardCheck size={20} /> Save PE Report
            </button>
            <button type="button" onClick={onClose} className="px-6 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-all">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
