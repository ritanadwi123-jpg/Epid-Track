
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, LineChart, Line 
} from 'recharts';
import { DiseaseRecord } from '../types';
import { getEpiWeek } from '../utils/dateUtils';

interface DataChartsProps {
  records: DiseaseRecord[];
}

const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

export const DataCharts: React.FC<DataChartsProps> = ({ records }) => {
  // Aggregate patient count by category
  const categoryData = records.reduce((acc: any[], curr) => {
    const existing = acc.find(i => i.name === curr.category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: curr.category, value: 1 });
    }
    return acc;
  }, []);

  // Aggregate patient count by disease
  const diseaseSummary = Object.entries(
    records.reduce((acc: any, curr) => {
      acc[curr.diseaseName] = (acc[curr.diseaseName] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value: value as number }))
   .sort((a, b) => b.value - a.value).slice(0, 5);

  // --- Weekly Epidemiological Trend (Minggu Epidemiologi) ---
  const uniqueDiseases = Array.from(new Set(records.map(r => r.diseaseName)));
  
  // Group by Epi Week Label
  const epiWeekMap: Record<string, any> = {};
  
  records.forEach(r => {
    const { label, year, week } = getEpiWeek(r.date);
    if (!epiWeekMap[label]) {
      epiWeekMap[label] = { 
        label, 
        sortKey: year * 100 + week // For chronological sorting
      };
      uniqueDiseases.forEach(d => epiWeekMap[label][d] = 0);
    }
    epiWeekMap[label][r.diseaseName] += 1;
  });

  const trendData = Object.values(epiWeekMap).sort((a, b) => a.sortKey - b.sortKey);

  return (
    <div className="space-y-6 mb-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-gray-700">Tren Mingguan Epidemiologi (Minggu Epi)</h3>
            <p className="text-xs text-gray-400">Distribusi kasus berdasarkan kalender epidemiologi Kemenkes RI</p>
          </div>
          <div className="bg-indigo-50 px-3 py-1 rounded-full text-[10px] font-bold text-indigo-600 border border-indigo-100 uppercase tracking-wider">
            Standard: Sun - Sat
          </div>
        </div>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="label" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 10, fill: '#94a3b8'}} 
                dy={10} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 11, fill: '#94a3b8'}} 
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }} 
              />
              <Legend 
                verticalAlign="top" 
                height={36} 
                iconType="circle" 
                wrapperStyle={{ fontSize: '12px', paddingBottom: '20px' }} 
              />
              {uniqueDiseases.map((disease, index) => (
                <Line
                  key={disease}
                  type="monotone"
                  dataKey={disease}
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, stroke: '#fff', fill: COLORS[index % COLORS.length] }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-700 mb-4">Proporsi Kasus per Kategori</h3>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%" cy="50%"
                  outerRadius={80} innerRadius={50}
                  dataKey="value"
                  paddingAngle={5}
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-700 mb-4">Top 5 Beban Penyakit</h3>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={diseaseSummary} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#475569'}} width={120} />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
