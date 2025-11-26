import React from 'react';
import { UserProfile } from '../types';
import { QrCode, Fingerprint, ShieldCheck } from 'lucide-react';

interface DigitalIDCardProps {
  user: UserProfile;
}

const DigitalIDCard: React.FC<DigitalIDCardProps> = ({ user }) => {
  return (
    <div className="relative w-full max-w-md mx-auto perspective-1000 group cursor-pointer h-[240px]">
      <div className="relative w-full h-full transition-transform duration-700 transform-style-3d group-hover:rotate-y-180">
        
        {/* Front Side */}
        <div className="absolute w-full h-full backface-hidden rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200">
          {/* Header */}
          <div className="bg-sudan-primary h-2 flex items-center justify-between"></div>
          <div className="px-6 py-4 flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 font-bold tracking-widest uppercase">Republic of Sudan</span>
              <h3 className="text-lg font-heading font-bold text-gray-900">جمهورية السودان</h3>
              <span className="text-[10px] text-sudan-primary font-bold mt-1">بطاقة الهوية الرقمية الموحدة</span>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-sudan-primary flex items-center justify-center">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Emblem_of_Sudan.svg/1200px-Emblem_of_Sudan.svg.png" alt="Emblem" className="w-8 h-8 opacity-80" />
            </div>
          </div>

          <div className="px-6 flex gap-4 mt-2">
            {/* Photo */}
            <div className="w-24 h-28 bg-gray-200 rounded-lg border-2 border-gray-300 overflow-hidden relative shadow-inner">
               {user.photoUrl ? (
                 <img src={user.photoUrl} alt="ID" className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                    <span className="text-xs">No Photo</span>
                 </div>
               )}
               <div className="absolute bottom-0 w-full bg-sudan-primary/80 h-4"></div>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-2">
              <div>
                <span className="text-[10px] text-gray-400 block">الاسم الكامل</span>
                <span className="text-sm font-bold text-gray-800 block truncate">{user.fullName}</span>
              </div>
              <div className="flex gap-4">
                <div>
                   <span className="text-[10px] text-gray-400 block">الرقم الوطني</span>
                   <span className="text-sm font-mono font-bold text-gray-800">{user.nationalId}</span>
                </div>
                <div>
                   <span className="text-[10px] text-gray-400 block">فصيلة الدم</span>
                   <span className="text-sm font-bold text-red-600">{user.bloodType}</span>
                </div>
              </div>
              <div>
                 <span className="text-[10px] text-gray-400 block">المهنة</span>
                 <span className="text-xs font-bold text-gray-800">{user.jobTitle}</span>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-4 right-6">
            <Fingerprint className="text-gray-200 w-16 h-16 opacity-50" />
          </div>
        </div>

        {/* Back Side */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-2xl overflow-hidden shadow-2xl bg-slate-800 text-white p-6 flex flex-col items-center justify-center border border-slate-700">
            <div className="bg-white p-2 rounded-lg mb-4">
                <QrCode className="w-32 h-32 text-slate-900" />
            </div>
            <p className="text-xs text-slate-400 mb-2">استخدم هذا الرمز للتحقق من الخدمات الحكومية</p>
            <div className="flex items-center gap-2 text-green-400 text-sm font-bold border border-green-400/30 px-3 py-1 rounded-full bg-green-400/10">
                <ShieldCheck size={16} />
                <span>هوية موثقة وآمنة</span>
            </div>
        </div>

      </div>
    </div>
  );
};

export default DigitalIDCard;
