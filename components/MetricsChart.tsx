
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import { TimelinePoint, SimulationMode } from '../types';

interface MetricsChartProps {
  data: TimelinePoint[];
  mode: SimulationMode;
}

const MetricsChart: React.FC<MetricsChartProps> = ({ data, mode }) => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis 
            dataKey="period" 
            stroke="#94a3b8" 
            tick={{ fill: '#64748b', fontSize: 10 }} 
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#94a3b8" 
            tick={{ fill: '#64748b', fontSize: 10 }} 
            domain={[0, 100]} 
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)', 
              borderColor: '#e2e8f0', 
              color: '#1e293b', 
              borderRadius: '12px',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
            }}
            itemStyle={{ color: '#334155' }}
          />
          <Legend wrapperStyle={{ color: '#64748b', fontSize: '12px', paddingTop: '10px' }} />
          
          {/* PERSONAL MODE */}
          {mode === 'PERSONAL' && (
            <>
              <Line connectNulls type="monotone" dataKey="health" name="الصحة" stroke="#e11d48" strokeWidth={3} dot={{r: 4, fill: '#e11d48'}} activeDot={{ r: 7, stroke: '#fff', strokeWidth: 2 }} />
              <Line connectNulls type="monotone" dataKey="wealth" name="المال" stroke="#ca8a04" strokeWidth={3} dot={{r: 4, fill: '#ca8a04'}} activeDot={{ r: 7, stroke: '#fff', strokeWidth: 2 }} />
              <Line connectNulls type="monotone" dataKey="relationships" name="العلاقات" stroke="#0284c7" strokeWidth={3} dot={{r: 4, fill: '#0284c7'}} activeDot={{ r: 7, stroke: '#fff', strokeWidth: 2 }} />
              <Line connectNulls type="monotone" dataKey="happiness" name="السعادة" stroke="#9333ea" strokeWidth={3} dot={{r: 4, fill: '#9333ea'}} activeDot={{ r: 7, stroke: '#fff', strokeWidth: 2 }} />
            </>
          )}

          {/* BUSINESS MODE */}
          {mode === 'BUSINESS' && (
            <>
              <Line connectNulls type="monotone" dataKey="revenue" name="النمو المالي" stroke="#0891b2" strokeWidth={3} dot={{r: 4, fill: '#0891b2'}} activeDot={{ r: 7 }} />
              <Line connectNulls type="monotone" dataKey="marketShare" name="الحصة السوقية" stroke="#4f46e5" strokeWidth={3} dot={{r: 4, fill: '#4f46e5'}} activeDot={{ r: 7 }} />
              <Line connectNulls type="monotone" dataKey="innovation" name="الابتكار" stroke="#c026d3" strokeWidth={3} dot={{r: 4, fill: '#c026d3'}} activeDot={{ r: 7 }} />
            </>
          )}

          {/* STUDENT MODE */}
          {mode === 'STUDENT' && (
            <>
              <Line connectNulls type="monotone" dataKey="academicFit" name="التحصيل" stroke="#e11d48" strokeWidth={3} dot={false} />
              <Line connectNulls type="monotone" dataKey="marketDemand" name="المستقبل المهني" stroke="#059669" strokeWidth={3} dot={false} />
              <Line connectNulls type="monotone" dataKey="skillDevelopment" name="المهارات" stroke="#2563eb" strokeWidth={3} dot={false} />
            </>
          )}

          {/* GOVERNMENT MODE */}
          {mode === 'GOVERNMENT' && (
            <>
              <Line connectNulls type="monotone" dataKey="publicSatisfaction" name="رضا الجمهور" stroke="#059669" strokeWidth={3} dot={false} />
              <Line connectNulls type="monotone" dataKey="economicGrowth" name="النمو الاقتصادي" stroke="#2563eb" strokeWidth={3} dot={false} />
              <Line connectNulls type="monotone" dataKey="socialStability" name="الاستقرار الاجتماعي" stroke="#d97706" strokeWidth={3} dot={false} />
            </>
          )}

        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export interface SwotRadarProps {
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
}

export const SwotRadar: React.FC<SwotRadarProps> = ({ swot }) => {
  const data = [
    { subject: 'نقاط القوة', A: swot.strengths.length || 0, fullMark: 5 },
    { subject: 'الفرص', A: swot.opportunities.length || 0, fullMark: 5 },
    { subject: 'التهديدات', A: swot.threats.length || 0, fullMark: 5 },
    { subject: 'نقاط الضعف', A: swot.weaknesses.length || 0, fullMark: 5 },
  ];

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#cbd5e1" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 12, fontWeight: 'bold' }} />
          <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
          <Radar
            name="Strategic Balance"
            dataKey="A"
            stroke="#0284c7"
            strokeWidth={3}
            fill="#0ea5e9"
            fillOpacity={0.4}
          />
          <Tooltip 
             contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)', 
              borderColor: '#e2e8f0', 
              color: '#1e293b', 
              borderRadius: '8px',
              backdropFilter: 'blur(4px)',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MetricsChart;
