import React, { useState } from 'react';
import { UserProfile } from '../types';
import { ShieldCheck, UserPlus, LogIn, Loader2, CreditCard } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserProfile) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [nationalId, setNationalId] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API Call
    setTimeout(() => {
      const mockUser: UserProfile = {
        nationalId: nationalId || '1000200300',
        fullName: fullName || 'أحمد محمد عثمان',
        birthDate: '1995-04-12',
        bloodType: 'O+',
        jobTitle: 'مهندس برمجيات',
        address: 'الخرطوم، السودان',
        phoneNumber: phone || '0912345678',
        isVerified: true,
        photoUrl: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&auto=format&fit=crop&q=60'
      };
      
      onLogin(mockUser);
      setLoading(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden">
        
        {/* Header */}
        <div className="bg-sudan-primary p-6 text-white text-center relative overflow-hidden">
           <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
           <div className="relative z-10">
             <ShieldCheck size={48} className="mx-auto mb-3 text-cyan-200" />
             <h2 className="text-2xl font-bold font-heading">
                {mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
             </h2>
             <p className="text-cyan-100 text-sm mt-1">بوابة السودان الرقمية الموحدة</p>
           </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الرقم الوطني</label>
            <div className="relative">
              <CreditCard className="absolute right-3 top-3 text-gray-400" size={18} />
              <input 
                type="text" 
                required
                maxLength={12}
                placeholder="000-0000-0000"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pr-10 pl-3 focus:ring-2 focus:ring-sudan-primary focus:border-transparent outline-none transition-all"
                value={nationalId}
                onChange={e => setNationalId(e.target.value)}
              />
            </div>
          </div>

          {mode === 'register' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الرباعي</label>
                <input 
                  type="text" 
                  required
                  placeholder="كما يظهر في الأوراق الثبوتية"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-sudan-primary focus:border-transparent outline-none transition-all"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                <input 
                  type="tel" 
                  required
                  placeholder="09xxxxxxxx"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-sudan-primary focus:border-transparent outline-none transition-all"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </div>
            </>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-sudan-primary hover:bg-sudan-secondary text-white font-bold py-3 rounded-lg shadow-lg shadow-cyan-200 transition-all flex items-center justify-center gap-2 mt-4"
          >
            {loading ? <Loader2 className="animate-spin" /> : (mode === 'login' ? <LogIn size={18} /> : <UserPlus size={18} />)}
            {mode === 'login' ? 'دخول آمن' : 'إنشاء الهوية الرقمية'}
          </button>

          <div className="text-center mt-4 pt-4 border-t border-gray-100">
            <button 
              type="button"
              className="text-sm text-sudan-primary hover:underline font-medium"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            >
              {mode === 'login' ? 'ليس لديك حساب؟ سجل الآن' : 'لديك حساب بالفعل؟ تسجيل الدخول'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AuthModal;
