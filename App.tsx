
import React, { useState } from 'react';
import { DiseaseRecord, DiseaseCategory, CaseStatus, EpidemiologicalInvestigation, Gender } from './types';
import { INITIAL_DATA } from './constants';
import { StatsCards } from './components/StatsCards';
import { DiseaseTable } from './components/DiseaseTable';
import { DataCharts } from './components/DataCharts';
import { AIInsights } from './components/AIInsights';
import { InvestigationModal } from './components/InvestigationModal';
import { exportToCSV } from './utils/exportUtils';
import { Plus, Database, PieChart, Activity, ShieldAlert, X, Download, FileSpreadsheet, Search } from 'lucide-react';

const App: React.FC = () => {
  const [records, setRecords] = useState<DiseaseRecord[]>(INITIAL_DATA);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [investigatingRecord, setInvestigatingRecord] = useState<DiseaseRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    patientName: '',
    patientAge: 0,
    patientGender: Gender.MALE,
    diseaseName: '',
    category: DiseaseCategory.INFECTIOUS,
    date: new Date().toISOString().split('T')[0],
    location: '',
    status: CaseStatus.ACTIVE,
  });

  const handleDelete = (id: string) => {
    setRecords(records.filter(r => r.id !== id));
  };

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: DiseaseRecord = {
      ...formData,
      id: `P-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
    };
    setRecords([newRecord, ...records]);
    setIsModalOpen(false);
    setFormData({
      patientName: '',
      patientAge: 0,
      patientGender: Gender.MALE,
      diseaseName: '',
      category: DiseaseCategory.INFECTIOUS,
      date: new Date().toISOString().split('T')[0],
      location: '',
      status: CaseStatus.ACTIVE,
    });
  };

  const handleSaveInvestigation = (investigation: EpidemiologicalInvestigation) => {
    if (investigatingRecord) {
      setRecords(prev => prev.map(r => 
        r.id === investigatingRecord.id ? { ...r, investigation } : r
      ));
      setInvestigatingRecord(null);
    }
  };

  const handleDownload = () => {
    exportToCSV(records);
  };

  const filteredRecords = records.filter(record => 
    record.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-12">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <ShieldAlert size={24} />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-gray-900">Epi<span className="text-indigo-600">Track</span></span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleDownload}
              className="hidden sm:flex items-center gap-2 px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-lg font-bold transition-all text-sm"
            >
              <FileSpreadsheet size={18} className="text-green-600" /> Download Excel/CSV
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all shadow-md active:scale-95 text-sm"
            >
              <Plus size={18} /> New Patient Case
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex items-center gap-6 mb-8 overflow-x-auto pb-2 scrollbar-hide border-b border-gray-100">
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-t-lg font-bold whitespace-nowrap border-b-2 border-indigo-600">
            <Activity size={18} /> Patient Registry
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg font-medium whitespace-nowrap transition-colors">
            <PieChart size={18} /> Analytics
          </button>
        </div>

        <AIInsights records={records} />
        <StatsCards records={records} />
        <DataCharts records={records} />

        {/* Search Bar and Table Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4">
            <h2 className="text-lg font-bold text-gray-800">Daftar Pasien Terlapor</h2>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Cari nama pasien..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
          </div>
          <DiseaseTable 
            records={filteredRecords} 
            onDelete={handleDelete} 
            onInvestigate={setInvestigatingRecord}
          />
        </div>
      </main>

      {investigatingRecord && (
        <InvestigationModal 
          record={investigatingRecord}
          onClose={() => setInvestigatingRecord(null)}
          onSave={handleSaveInvestigation}
        />
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800">New Patient Case Entry</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddRecord} className="p-6 space-y-4">
              <div className="space-y-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b pb-1">Patient Identity</p>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                    <input required type="text" value={formData.patientName} onChange={e => setFormData({...formData, patientName: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Patient's legal name" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Age</label>
                      <input required type="number" value={formData.patientAge} onChange={e => setFormData({...formData, patientAge: parseInt(e.target.value) || 0})} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Gender</label>
                      <select value={formData.patientGender} onChange={e => setFormData({...formData, patientGender: e.target.value as Gender})} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500">
                        {Object.values(Gender).map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b pb-1 pt-2">Diagnosis Info</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Disease Name</label>
                    <input required type="text" value={formData.diseaseName} onChange={e => setFormData({...formData, diseaseName: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Dengue, Malaria" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as DiseaseCategory})} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500">
                      {Object.values(DiseaseCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Report Date</label>
                    <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Location</label>
                    <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" placeholder="District or City" />
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-indigo-200 transition-all">
                  Register Patient Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="mt-12 text-center text-gray-400 text-xs">
        &copy; 2023 EpiTrack Patient-Level Surveillance. Authorized Health Personnel Only.
      </footer>
    </div>
  );
};

export default App;
