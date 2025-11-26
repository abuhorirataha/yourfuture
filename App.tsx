
import React, { useState, useEffect } from 'react';
import { 
  Activity, BrainCircuit, BookOpen, Building,
  Sparkles, Palette, User, Landmark, BarChart3, Clock,
  AlertTriangle, CheckCircle, XCircle, MinusCircle, Target, ShieldAlert,
  Swords, Shield, TrendingUp, Zap, ListChecks, ArrowLeft, Cpu
} from 'lucide-react';
import MetricsChart, { SwotRadar } from './components/MetricsChart';
import { TimelinePoint, SimulationMode, BusinessProfile, GovernmentProfile, PersonalProfile, AnalysisResult } from './types';
import { getGeminiResponse } from './services/geminiService';

const App: React.FC = () => {
  const [mode, setMode] = useState<SimulationMode>('PERSONAL');
  const [data, setData] = useState<TimelinePoint[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  
  // Analysis States
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // --- FORM STATES ---
  // Personal
  const [personalProfile, setPersonalProfile] = useState<PersonalProfile>({
    fullName: '', age: '', jobTitle: '', monthlyIncome: '', savings: '',
    healthStatus: 'GOOD', socialStatus: 'SINGLE', lifestyle: 'ACTIVE',
    decision: ''
  });

  // Student
  const [studentLevel, setStudentLevel] = useState<'PRIMARY' | 'MIDDLE' | 'SECONDARY'>('SECONDARY');
  const [studentStream, setStudentStream] = useState<'SCIENTIFIC' | 'LITERARY'>('SCIENTIFIC');
  const [subjects, setSubjects] = useState<Record<string, string>>({});
  const [electiveSubject, setElectiveSubject] = useState<string>('');
  const [hobbies, setHobbies] = useState('');

  // Business
  const [bizProfile, setBizProfile] = useState<BusinessProfile>({
    companyName: '', industry: 'تكنولوجيا', capital: '', targetMarket: '', decision: ''
  });

  // Government
  const [govProfile, setGovProfile] = useState<GovernmentProfile>({
    entityName: '', sector: '', population: '', challenges: '', goals: '', planningPeriod: 'MEDIUM'
  });

  // Initialize data on mode change
  useEffect(() => {
    resetData();
  }, [mode]);

  // Reset Elective when stream changes
  useEffect(() => {
    setElectiveSubject('');
    // Clear subject grades that are not in the new list to avoid confusion
    setSubjects({});
  }, [studentStream, studentLevel]);

  const resetData = () => {
    setData([]);
    setAnalysisResult(null);
    addLog(`System ready in ${mode} mode.`);
  };

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    setLogs(prev => [`[${time}] ${msg}`, ...prev].slice(50));
  };

  // --- CORE PROJECTION LOGIC ---
  const generateProjectionData = (currentMode: SimulationMode, riskLevel: string | null = null): TimelinePoint[] => {
    const points: TimelinePoint[] = [];
    const years = 5;
    const startYear = new Date().getFullYear();

    // Risk Multiplier: If Danger, metrics degrade over time. If Positive, they improve.
    let growthFactor = 1.0;
    let decayFactor = 0;

    if (riskLevel === 'DANGER') {
        growthFactor = 0.8; // Negative growth
        decayFactor = 5;    // Fixed decay
    } else if (riskLevel === 'WARNING') {
        growthFactor = 0.95;
        decayFactor = 2;
    } else if (riskLevel === 'POSITIVE') {
        growthFactor = 1.1;
        decayFactor = -2;
    }

    // Helper to clamp values
    const clamp = (val: number) => Math.max(0, Math.min(100, val));

    for (let i = 0; i <= years; i++) {
      const yearLabel = `${startYear + i}`;
      let point: TimelinePoint = { period: yearLabel };

      if (currentMode === 'PERSONAL') {
        const incomeScore = Math.min(100, (parseInt(personalProfile.monthlyIncome) || 0) / 5000 * 50); 
        const savingsScore = Math.min(100, (parseInt(personalProfile.savings) || 0) / 10000 * 30);
        
        let healthBase = personalProfile.healthStatus === 'EXCELLENT' ? 95 : personalProfile.healthStatus === 'GOOD' ? 80 : 60;
        if (personalProfile.lifestyle === 'STRESSED') healthBase -= 10;

        let wealthBase = (incomeScore + savingsScore) / 2;
        
        // Apply Risk Factors over time
        const yearEffect = i * (riskLevel ? decayFactor : 0);
        const wealthEffect = i * (riskLevel === 'DANGER' ? -10 : riskLevel === 'POSITIVE' ? 10 : 5);

        point.health = clamp((healthBase - (i * 2)) - yearEffect);
        point.wealth = clamp((wealthBase + wealthEffect) * (riskLevel === 'DANGER' ? 0.9 : 1));
        point.relationships = clamp(70 - yearEffect);
        point.happiness = clamp(((point.health || 0) + (point.wealth || 0) + (point.relationships || 0)) / 3);
      } 
      else if (currentMode === 'BUSINESS') {
        const baseGrowth = 50; 
        const riskEffect = riskLevel === 'DANGER' ? -10 : riskLevel === 'POSITIVE' ? 10 : 0;
        point.revenue = clamp(baseGrowth + (i * 10) + (i * riskEffect));
        point.marketShare = clamp(10 + (i * 5));
        point.innovation = clamp(80 - (i * 2)); 
      }
      else if (currentMode === 'GOVERNMENT') {
        point.economicGrowth = clamp(30 + (i * 4));
        point.publicSatisfaction = clamp(50 + (Math.sin(i) * 10));
        point.socialStability = clamp(60 + (i * 2));
      }
      else if (currentMode === 'STUDENT') {
        point.academicFit = clamp(70 + (i * 2));
        point.marketDemand = clamp(60 + (i * 5));
        point.skillDevelopment = clamp(20 + (i * 15));
        point.financialProspects = clamp((point.marketDemand || 0) * 0.8 + (point.skillDevelopment || 0) * 0.2);
      }

      points.push(point);
    }
    return points;
  };

  // --- AI ANALYSIS HANDLERS ---
  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    addLog(`Generating analysis for ${mode}...`);

    // 1. Show baseline projection immediately
    setData(generateProjectionData(mode, null));

    let promptData = '';
    
    if (mode === 'PERSONAL') {
       promptData = JSON.stringify(personalProfile);
    } else if (mode === 'STUDENT') {
      promptData = JSON.stringify({ 
        level: studentLevel, 
        stream: studentStream, 
        subjects: { ...subjects, [electiveSubject]: subjects[electiveSubject] || '0' }, // Include elective
        hobbies 
      });
    } else if (mode === 'BUSINESS') {
      promptData = JSON.stringify(bizProfile);
    } else if (mode === 'GOVERNMENT') {
      promptData = JSON.stringify(govProfile);
    }

    if (promptData) {
      const result = await getGeminiResponse(promptData, mode);
      setAnalysisResult(result);
      
      // 2. Update projection based on Risk Level from AI
      if (result) {
          const adjustedData = generateProjectionData(mode, result.riskLevel);
          setData(adjustedData);
      }
    }
    
    setIsAnalyzing(false);
    addLog("Analysis complete.");
  };

  // --- RENDER HELPERS ---
  const renderPersonalInputs = () => (
    <div className="space-y-4 animate-in fade-in">
        <div className="bg-red-50 border border-red-100 p-4 rounded-xl mb-4 relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                <Target size={100} className="text-red-600" />
            </div>
            <label className="text-red-700 text-sm font-bold mb-2 block flex items-center gap-2 relative z-10">
                <Target size={18} />
                القرار المصيري / الخطة
            </label>
            <textarea 
                className="w-full p-4 border border-red-200 rounded-lg text-sm bg-white text-slate-800 focus:border-red-400 outline-none h-28 placeholder-gray-400 relative z-10 resize-none neon-input transition-all" 
                placeholder="أكتب هنا قرارك بوضوح..&#10;مثال: أنا موظف راتبي 5000، أفكر في الاستقالة وفتح متجر إلكتروني، لكن مدخراتي تكفي لشهرين فقط." 
                onChange={e => setPersonalProfile({...personalProfile, decision: e.target.value})} 
            />
        </div>

        <div className="grid grid-cols-2 gap-3">
           <div>
              <label className="text-slate-700 text-xs font-bold mb-1 block">الاسم</label>
              <input className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-white text-slate-800 focus:border-bio-primary outline-none neon-input" placeholder="الاسم" onChange={e => setPersonalProfile({...personalProfile, fullName: e.target.value})} />
           </div>
           <div>
              <label className="text-slate-700 text-xs font-bold mb-1 block">العمر</label>
              <input type="number" className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-white text-slate-800 focus:border-bio-primary outline-none neon-input" placeholder="مثال: 30" onChange={e => setPersonalProfile({...personalProfile, age: e.target.value})} />
           </div>
        </div>

        <div>
           <label className="text-slate-500 text-xs mb-1 block">الوظيفة الحالية</label>
           <input className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-white text-slate-800 focus:border-bio-primary outline-none neon-input" placeholder="مثال: موظف حكومي" onChange={e => setPersonalProfile({...personalProfile, jobTitle: e.target.value})} />
        </div>

        <div className="grid grid-cols-2 gap-3">
           <div>
              <label className="text-slate-500 text-xs mb-1 block">الدخل الشهري</label>
              <input className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-white text-slate-800 focus:border-bio-primary outline-none neon-input" placeholder="مثال: 5000" onChange={e => setPersonalProfile({...personalProfile, monthlyIncome: e.target.value})} />
           </div>
           <div>
              <label className="text-slate-500 text-xs mb-1 block">رأس المال / المدخرات</label>
              <input className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-white text-slate-800 focus:border-bio-primary outline-none neon-input" placeholder="مثال: 10000" onChange={e => setPersonalProfile({...personalProfile, savings: e.target.value})} />
           </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
            <div>
               <label className="text-slate-500 text-xs mb-1 block">الحالة الاجتماعية</label>
               <select className="w-full p-2 border border-gray-200 rounded-lg text-xs bg-white text-slate-800 focus:border-bio-primary outline-none neon-input" onChange={e => setPersonalProfile({...personalProfile, socialStatus: e.target.value as any})}>
                  <option value="SINGLE">أعزب</option>
                  <option value="MARRIED">متزوج</option>
                  <option value="FAMILY">أعول أسرة</option>
               </select>
            </div>
        </div>
    </div>
  );

  const renderStudentInputs = () => {
    // --- Define Subject Lists ---
    const primarySubjects = [
      'اللغة العربية', 'الرياضيات', 'اللغة الإنجليزية', 'التربية الإسلامية',
      'التربية التقنية', 'التربية الفنية', 'التربية الوطنية'
    ];

    const middleSubjects = [
      'اللغة العربية', 'الرياضيات', 'اللغة الإنجليزية', 'التربية الإسلامية',
      'التربية التقنية', 'التربية الفنية', 'التربية الوطنية',
      'الجغرافيا', 'التاريخ', 'العلوم', 'تكنولوجيا المعلومات والاتصالات'
    ];

    // Secondary 3rd Year
    const scientificCore = [
      'اللغة العربية', 'التربية الإسلامية', 'اللغة الإنجليزية',
      'الرياضيات المتخصصة', 'الفيزياء', 'الكيمياء'
    ];
    const scientificElectives = ['الأحياء', 'العلوم الهندسية', 'الحاسوب'];

    const literaryCore = [
      'اللغة العربية', 'التربية الإسلامية', 'اللغة الإنجليزية',
      'الرياضيات الأساسية', 'الجغرافيا', 'التاريخ'
    ];
    const literaryElectives = ['الدراسات الإسلامية', 'العلوم العسكرية', 'الأدب الإنجليزي', 'اللغة العربية المتقدمة'];


    const activeCoreSubjects = studentLevel === 'PRIMARY' ? primarySubjects :
                               studentLevel === 'MIDDLE' ? middleSubjects :
                               studentStream === 'SCIENTIFIC' ? scientificCore : literaryCore;

    const activeElectives = studentLevel === 'SECONDARY' 
                            ? (studentStream === 'SCIENTIFIC' ? scientificElectives : literaryElectives) 
                            : [];

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
            <label className="text-bio-primary text-xs font-bold mb-2 block">المرحلة الدراسية</label>
            <div className="flex gap-2 bg-slate-100 p-1 rounded-lg border border-gray-200 mb-4">
                <button onClick={() => setStudentLevel('PRIMARY')} className={`flex-1 py-2 rounded-md text-xs font-bold transition-all ${studentLevel === 'PRIMARY' ? 'bg-white text-bio-primary shadow-sm border border-gray-200' : 'text-slate-500 hover:text-slate-700'}`}>الابتدائي</button>
                <button onClick={() => setStudentLevel('MIDDLE')} className={`flex-1 py-2 rounded-md text-xs font-bold transition-all ${studentLevel === 'MIDDLE' ? 'bg-white text-bio-primary shadow-sm border border-gray-200' : 'text-slate-500 hover:text-slate-700'}`}>المتوسط</button>
                <button onClick={() => setStudentLevel('SECONDARY')} className={`flex-1 py-2 rounded-md text-xs font-bold transition-all ${studentLevel === 'SECONDARY' ? 'bg-white text-bio-primary shadow-sm border border-gray-200' : 'text-slate-500 hover:text-slate-700'}`}>الثانوي (ثالث)</button>
            </div>

            {studentLevel === 'SECONDARY' && (
              <>
              <label className="text-bio-primary text-xs font-bold mb-2 block">المسار الأكاديمي (الصف الثالث)</label>
              <div className="flex gap-2 bg-slate-100 p-1 rounded-lg border border-gray-200">
                  <button onClick={() => setStudentStream('SCIENTIFIC')} className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${studentStream === 'SCIENTIFIC' ? 'bg-white text-bio-primary shadow-sm border border-gray-200' : 'text-slate-500 hover:bg-gray-50'}`}>علمي</button>
                  <button onClick={() => setStudentStream('LITERARY')} className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${studentStream === 'LITERARY' ? 'bg-white text-bio-primary shadow-sm border border-gray-200' : 'text-slate-500 hover:bg-gray-50'}`}>أدبي</button>
              </div>
              </>
            )}

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mt-4">
                <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2"><BookOpen size={16} className="text-bio-primary" /> درجات المواد {studentLevel === 'SECONDARY' && '(الأساسية)'}</h4>
                <div className="grid grid-cols-2 gap-3">
                   {activeCoreSubjects.map(sub => (
                       <div key={sub} className="relative">
                           <input type="number" placeholder="0" className="w-full p-2 pl-8 border border-gray-200 rounded text-sm bg-gray-50 text-slate-800 focus:border-bio-primary focus:outline-none placeholder-gray-400 neon-input" onChange={(e) => setSubjects(prev => ({...prev, [sub]: e.target.value}))} />
                           <span className="absolute right-2 top-2 text-[10px] text-slate-400 pointer-events-none">{sub}</span>
                       </div>
                   ))}
                </div>

                {/* Elective Selection for Secondary */}
                {studentLevel === 'SECONDARY' && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                     <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500" /> المادة السابعة (الاختيارية)</h4>
                     <p className="text-[10px] text-slate-400 mb-2">اختر مادة واحدة لتكمل 7 مواد</p>
                     <div className="grid grid-cols-2 gap-3">
                        <select 
                          className="w-full p-2 border border-gray-200 rounded text-sm bg-white text-slate-800 focus:border-bio-primary outline-none"
                          value={electiveSubject}
                          onChange={(e) => setElectiveSubject(e.target.value)}
                        >
                          <option value="">-- اختر المادة --</option>
                          {activeElectives.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>

                        {electiveSubject && (
                          <div className="relative animate-in fade-in">
                             <input type="number" placeholder="0" className="w-full p-2 pl-8 border border-gray-200 rounded text-sm bg-gray-50 text-slate-800 focus:border-bio-primary focus:outline-none placeholder-gray-400 neon-input" onChange={(e) => setSubjects(prev => ({...prev, [electiveSubject]: e.target.value}))} />
                             <span className="absolute right-2 top-2 text-[10px] text-slate-400 pointer-events-none">الدرجة</span>
                          </div>
                        )}
                     </div>
                  </div>
                )}
            </div>

            {(studentLevel === 'PRIMARY' || studentLevel === 'MIDDLE') && (
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                 <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2"><Palette size={16} className="text-bio-primary" /> الهوايات والاهتمامات</h4>
                 <textarea className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-gray-50 text-slate-800 focus:border-bio-primary outline-none placeholder-gray-400 neon-input" rows={3} placeholder="أحب الرسم، ألعاب التركيب، كرة القدم..." onChange={e => setHobbies(e.target.value)} />
              </div>
            )}
        </div>
    );
  };

  const renderBusinessInputs = () => (
    <div className="space-y-4 animate-in fade-in">
       <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-4 relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                <Target size={100} className="text-blue-600" />
            </div>
            <label className="text-blue-700 text-sm font-bold mb-2 block flex items-center gap-2 relative z-10">
                <Target size={18} />
                القرار الاستراتيجي / الفكرة / التحدي
            </label>
            <textarea 
                className="w-full p-4 border border-blue-200 rounded-lg text-sm bg-white text-slate-800 focus:border-blue-400 outline-none h-28 placeholder-gray-400 relative z-10 resize-none neon-input transition-all" 
                placeholder="أكتب هنا الفكرة أو القرار بوضوح..&#10;مثال: نريد التوسع لفتح فرع جديد في الخرطوم، أو إطلاق منتج يعتمد على الذكاء الاصطناعي، أو الاندماج مع منافس..." 
                onChange={e => setBizProfile({...bizProfile, decision: e.target.value})} 
            />
        </div>

       <div>
         <label className="text-slate-700 text-xs font-bold mb-1 block">بيانات الجهة</label>
         <input className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-white text-slate-800 focus:border-bio-primary outline-none neon-input" placeholder="اسم المؤسسة / الشركة" onChange={e => setBizProfile({...bizProfile, companyName: e.target.value})} />
       </div>
       <div>
         <label className="text-slate-500 text-xs mb-1 block">القطاع</label>
         <input className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-white text-slate-800 focus:border-bio-primary outline-none neon-input" placeholder="تكنولوجيا، زراعة، تجارة..." onChange={e => setBizProfile({...bizProfile, industry: e.target.value})} />
       </div>
       <div className="grid grid-cols-2 gap-3">
         <div>
           <label className="text-slate-500 text-xs mb-1 block">رأس المال</label>
           <input className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-white text-slate-800 focus:border-bio-primary outline-none neon-input" placeholder="USD / Local" onChange={e => setBizProfile({...bizProfile, capital: e.target.value})} />
         </div>
         <div>
            <label className="text-slate-500 text-xs mb-1 block">نطاق السوق</label>
            <input className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-white text-slate-800 focus:border-bio-primary outline-none neon-input" placeholder="محلي، إقليمي، عالمي" onChange={e => setBizProfile({...bizProfile, targetMarket: e.target.value})} />
         </div>
       </div>
    </div>
  );

  const renderGovernmentInputs = () => (
    <div className="space-y-3 animate-in fade-in">
       <input className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-white text-slate-800 focus:border-bio-primary outline-none neon-input" placeholder="اسم الهيئة / الوزارة" onChange={e => setGovProfile({...govProfile, entityName: e.target.value})} />
       <div className="grid grid-cols-2 gap-3">
          <input className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-white text-slate-800 focus:border-bio-primary outline-none neon-input" placeholder="القطاع الحكومي" onChange={e => setGovProfile({...govProfile, sector: e.target.value})} />
          <input className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-white text-slate-800 focus:border-bio-primary outline-none neon-input" placeholder="تعداد السكان المستهدف" onChange={e => setGovProfile({...govProfile, population: e.target.value})} />
       </div>
       <textarea className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-white text-slate-800 focus:border-bio-primary outline-none neon-input" rows={2} placeholder="أبرز التحديات الحالية..." onChange={e => setGovProfile({...govProfile, challenges: e.target.value})} />
       <textarea className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-white text-slate-800 focus:border-bio-primary outline-none neon-input" rows={2} placeholder="الأهداف الاستراتيجية..." onChange={e => setGovProfile({...govProfile, goals: e.target.value})} />
    </div>
  );

  // --- ANALYSIS RESULT RENDER ---
  const renderRiskCircle = (level: string) => {
     let color = 'bg-gray-200';
     let textColor = 'text-gray-600';
     let iconColor = 'text-gray-500';
     let text = 'غير محدد';
     let Icon = MinusCircle;
     let ring = 'ring-gray-300';
     let shadow = 'shadow-gray-200';

     if (level === 'DANGER') {
        color = 'bg-red-50'; textColor = 'text-red-600'; iconColor = 'text-red-500'; text = 'خطر / احذر'; Icon = XCircle; ring = 'ring-red-100'; shadow = 'shadow-red-200';
     } else if (level === 'WARNING') {
        color = 'bg-orange-50'; textColor = 'text-orange-600'; iconColor = 'text-orange-500'; text = 'حذر / انتبه'; Icon = AlertTriangle; ring = 'ring-orange-100'; shadow = 'shadow-orange-200';
     } else if (level === 'POSITIVE') {
        color = 'bg-emerald-50'; textColor = 'text-emerald-600'; iconColor = 'text-emerald-500'; text = 'إيجابي / آمن'; Icon = CheckCircle; ring = 'ring-emerald-100'; shadow = 'shadow-emerald-200';
     } else if (level === 'NEUTRAL') {
        color = 'bg-blue-50'; textColor = 'text-blue-600'; iconColor = 'text-blue-500'; text = 'محايد / مستقر'; Icon = MinusCircle; ring = 'ring-blue-100'; shadow = 'shadow-blue-200';
     }

     return (
        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-gray-100 h-full relative overflow-hidden shadow-sm">
            {/* Background Glow */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 ${color} opacity-50 blur-[40px] rounded-full`}></div>
            
            <div className={`w-32 h-32 rounded-full bg-white shadow-lg ${shadow} flex items-center justify-center mb-6 ring-8 ${ring} relative z-10 transition-all duration-500 transform hover:scale-105`}>
               <Icon size={48} className={`${iconColor} drop-shadow-sm`} />
            </div>
            <h4 className={`text-2xl font-black ${textColor} mb-1 relative z-10 tracking-tight neon-text`}>{text}</h4>
            <span className="text-xs text-slate-400 font-mono tracking-widest uppercase relative z-10">Risk Analysis Core</span>
        </div>
     );
  };

  return (
    <div className="min-h-screen font-sans p-6 overflow-hidden flex flex-col items-center relative z-10">
      
      {/* HEADER */}
      <div className="text-center mb-10 z-10 pt-4 relative">
         <span className="px-4 py-1.5 rounded-full bg-white border border-bio-border text-bio-primary text-xs font-mono inline-flex items-center gap-2 mb-3 shadow-sm">
        <h1> أول نظام عربي مدعوم بالذكاء الإصطناعي تطوير النسخة الأولى بواسطة المهندس ابوهريره طه</h1>      <span className="w-2 h-2 rounded-full bg-bio-primary animate-pulse"></span>
         </span>
         <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-2 tracking-tight drop-shadow-sm" style={{fontFamily: 'IBM Plex Sans Arabic'}}>
           نظام تحليل مستقبلك
         </h1>
         <p className="text-slate-500 text-xs md:text-sm tracking-widest font-mono"> نظام يحاكي مستقبلك قبل أن تعيشه. أدخل قرارك، وشاهد أثره على حياتك بعد 5 سنوات.</p>
      </div>

      {/* TABS - REORDERED: Personal -> Student -> Business -> Government */}
      <div className="flex flex-wrap justify-center gap-2 bg-white/80 p-1.5 rounded-2xl border border-gray-200 mb-8 backdrop-blur-md shadow-lg w-full md:w-auto">
         {[
           {id: 'PERSONAL', icon: User, label: 'الأفراد'},
           {id: 'STUDENT', icon: BookOpen, label: 'الطلاب', badge: 'مجاني'},
           {id: 'BUSINESS', icon: Building, label: 'الشركات'},
           {id: 'GOVERNMENT', icon: Landmark, label: 'الحكومات والهيئات'},
         ].map((t) => (
            <button 
              key={t.id}
              onClick={() => setMode(t.id as SimulationMode)}
              className={`flex items-center gap-1.5 px-3 py-2 md:px-6 md:py-3 rounded-xl transition-all duration-300 whitespace-nowrap text-xs md:text-sm ${mode === t.id ? 'bg-bio-primary text-white font-bold shadow-md shadow-sky-200' : 'text-slate-500 hover:text-bio-primary hover:bg-slate-50'}`}
            >
                <t.icon size={14} className="md:w-5 md:h-5" />
                <span>{t.label}</span>
                {t.badge && (
                  <span className={`text-[8px] md:text-[9px] px-1.5 py-0.5 rounded-full font-bold ml-1 ${mode === t.id ? 'bg-emerald-400 text-white' : 'bg-emerald-100 text-emerald-600'}`}>
                    {t.badge}
                  </span>
                )}
            </button>
         ))}
      </div>

      {/* MAIN CONTENT */}
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* INPUT PANEL */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-white/80 backdrop-blur-xl border border-white rounded-3xl p-6 shadow-xl relative overflow-hidden neon-border">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-bio-primary to-transparent"></div>
             
             <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                   <Cpu className="text-bio-primary animate-pulse" size={20} />
                   {mode === 'BUSINESS' ? 'إعدادات الجهة' : mode === 'PERSONAL' ? 'بيانات وقرار الفرد' : mode === 'STUDENT' ? 'السجل الأكاديمي' : 'البيانات الحكومية'}
                </h3>
             </div>

             {mode === 'STUDENT' && renderStudentInputs()}
             {mode === 'BUSINESS' && renderBusinessInputs()}
             {mode === 'GOVERNMENT' && renderGovernmentInputs()}
             {mode === 'PERSONAL' && renderPersonalInputs()}

             <div className="mt-8 pt-4">
                <button 
                   onClick={runAnalysis}
                   disabled={isAnalyzing}
                   className="w-full bg-gradient-to-r from-bio-primary to-sky-600 text-white py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-sky-200 disabled:opacity-50 hover:scale-[1.02]"
                >
                   {isAnalyzing ? <span className="animate-spin">⏳</span> : <BrainCircuit size={20} />}
                   <span>تحليل القرار والمستقبل</span>
                </button>
             </div>
          </div>
        </div>

        {/* RESULTS PANEL */}
        <div className="md:col-span-8 space-y-6">
           
           {/* Chart Section */}
           <div className="bg-white/80 backdrop-blur-xl border border-white rounded-3xl p-6 shadow-xl h-[300px] relative flex flex-col neon-border">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="text-slate-600 font-mono text-xs uppercase tracking-widest flex gap-2 items-center">
                     <BarChart3 size={16} className="text-bio-primary" /> محاكاة المستقبل (5 سنوات)
                  </h3>
                  {analysisResult?.riskLevel && (
                      <span className={`text-[10px] px-2 py-1 rounded border shadow-sm ${analysisResult.riskLevel === 'DANGER' ? 'border-red-200 bg-red-50 text-red-600' : 'border-green-200 bg-green-50 text-green-600'}`}>
                         تأثير المخاطرة: {analysisResult.riskLevel === 'DANGER' ? 'سلبي (تدهور)' : 'إيجابي (نمو)'}
                      </span>
                  )}
               </div>
               {/* FIXED HEIGHT CONTAINER TO PREVENT RECHARTS WARNING */}
               <div className="w-full h-[220px] min-h-[220px] bg-slate-50/50 rounded-xl border border-gray-100 p-2 relative overflow-hidden">
                   {/* Grid line decoration */}
                   <div className="absolute inset-0 opacity-5 pointer-events-none" style={{backgroundImage: 'linear-gradient(#0ea5e9 1px, transparent 1px), linear-gradient(90deg, #0ea5e9 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                   
                   {data.length > 0 ? <MetricsChart data={data} mode={mode} /> : (
                      <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                          <Activity size={32} className="opacity-50 animate-pulse text-bio-primary" />
                          <span className="text-xs">في انتظار بدء المحاكاة...</span>
                      </div>
                   )}
               </div>
           </div>
           
           {/* AI Analysis Result */}
           {analysisResult && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6">
                  
                  {/* Top Row: Risk & Radar */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-auto md:h-[320px]">
                      {renderRiskCircle(analysisResult.riskLevel)}
                      
                      <div className="bg-white/90 backdrop-blur-md border border-gray-100 rounded-2xl p-4 flex flex-col shadow-sm h-[320px]">
                          <h4 className="text-slate-700 font-bold text-xs mb-2 flex items-center gap-2">
                             <Target size={14} className="text-bio-primary" /> التوازن الاستراتيجي (SWOT Radar)
                          </h4>
                          {/* FIXED HEIGHT CONTAINER TO PREVENT RECHARTS WARNING */}
                          <div className="w-full h-[260px] min-h-[260px]">
                              <SwotRadar swot={analysisResult.swot} />
                          </div>
                      </div>
                  </div>

                  {/* SWOT Quadrant Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Strength */}
                      <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-xl shadow-sm">
                          <h4 className="text-emerald-700 font-bold text-sm mb-3 flex items-center gap-2">
                             <Swords size={18} /> نقاط القوة (Strengths)
                          </h4>
                          <ul className="space-y-2">
                              {analysisResult.swot.strengths.map((s, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-emerald-800">
                                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1 shrink-0"></span>
                                   {s}
                                </li>
                              ))}
                          </ul>
                      </div>
                      
                      {/* Weakness */}
                      <div className="bg-red-50 border border-red-100 p-5 rounded-xl shadow-sm">
                          <h4 className="text-red-700 font-bold text-sm mb-3 flex items-center gap-2">
                             <ShieldAlert size={18} /> نقاط الضعف (Weaknesses)
                          </h4>
                          <ul className="space-y-2">
                              {analysisResult.swot.weaknesses.map((s, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-red-800">
                                   <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1 shrink-0"></span>
                                   {s}
                                </li>
                              ))}
                          </ul>
                      </div>

                      {/* Opportunities */}
                      <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl shadow-sm">
                          <h4 className="text-blue-700 font-bold text-sm mb-3 flex items-center gap-2">
                             <TrendingUp size={18} /> الفرص (Opportunities)
                          </h4>
                          <ul className="space-y-2">
                              {analysisResult.swot.opportunities.map((s, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-blue-800">
                                   <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 shrink-0"></span>
                                   {s}
                                </li>
                              ))}
                          </ul>
                      </div>

                      {/* Threats */}
                      <div className="bg-orange-50 border border-orange-100 p-5 rounded-xl shadow-sm">
                          <h4 className="text-orange-700 font-bold text-sm mb-3 flex items-center gap-2">
                             <Shield size={18} /> التهديدات (Threats)
                          </h4>
                          <ul className="space-y-2">
                              {analysisResult.swot.threats.map((s, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-orange-800">
                                   <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1 shrink-0"></span>
                                   {s}
                                </li>
                              ))}
                          </ul>
                      </div>
                  </div>

                  {/* Prediction & Strategy */}
                  <div className="bg-white/90 backdrop-blur-md border border-gray-100 rounded-2xl p-6 shadow-md space-y-6">
                      <div className="mb-6 border-b border-gray-100 pb-6">
                          <h4 className="text-sky-700 font-bold mb-3 flex items-center gap-2 text-lg">
                             <Sparkles size={20} className="text-yellow-500" /> التنبؤ المستقبلي
                          </h4>
                          <p className="text-sm text-slate-700 leading-relaxed border-r-4 border-bio-primary pr-4 bg-sky-50 p-4 rounded-l-lg whitespace-pre-wrap">
                              {analysisResult.prediction}
                          </p>
                      </div>

                      <div className="mb-6">
                          <h4 className="text-yellow-600 font-bold mb-3 flex items-center gap-2 text-lg">
                             <Zap size={20} /> التوجيه الاستراتيجي
                          </h4>
                          <p className="text-sm text-slate-700 leading-relaxed border-r-4 border-yellow-400 pr-4 bg-yellow-50 p-4 rounded-l-lg whitespace-pre-wrap">
                              {analysisResult.strategy}
                          </p>
                      </div>

                      {/* Execution Steps */}
                      {analysisResult.executionSteps && analysisResult.executionSteps.length > 0 && (
                        <div>
                           <h4 className="text-blue-600 font-bold mb-4 flex items-center gap-2 text-lg">
                             <ListChecks size={20} /> خطة العمل التنفيذية (Action Plan)
                          </h4>
                          <div className="grid gap-3">
                             {analysisResult.executionSteps.map((step, index) => (
                               <div key={index} className="flex items-start gap-3 bg-white border border-gray-200 p-4 rounded-xl hover:border-blue-300 transition-all hover:bg-blue-50 hover:translate-x-1 shadow-sm">
                                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-bold text-xs shrink-0 mt-0.5 border border-blue-200">
                                     {index + 1}
                                  </div>
                                  <p className="text-sm text-slate-700">{step}</p>
                               </div>
                             ))}
                          </div>
                        </div>
                      )}

                  </div>

              </div>
           )}

        </div>

      </div>
      
      <footer className="mt-auto py-8 text-center text-slate-400 text-xs font-mono">
         جميع الحقوق محفوظة للعام 2025 
      </footer>

    </div>
  );
};

export default App;