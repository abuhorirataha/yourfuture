import React from 'react';
import { 
  Home, 
  LayoutGrid, 
  FileText, 
  Sprout, 
  BarChart3, 
  LogOut, 
  UserCircle,
  QrCode
} from 'lucide-react';
import { UserProfile } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile | null;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, user, onLogout }) => {
  const menuItems = [
    { id: 'home', label: 'الرئيسية', icon: Home },
    { id: 'services', label: 'الخدمات الإلكترونية', icon: LayoutGrid },
    { id: 'requests', label: 'طلباتي', icon: FileText },
    { id: 'agriculture', label: 'الزراعة الذكية', icon: Sprout },
    { id: 'analytics', label: 'المؤشرات الوطنية', icon: BarChart3 },
  ];

  return (
    <div className="w-64 bg-sudan-primary/10 bg-white border-l border-gray-200 h-screen flex flex-col hidden md:flex fixed right-0 top-0 z-20">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex items-center justify-center flex-col">
        <div className="w-16 h-16 bg-gradient-to-br from-sudan-green to-sudan-black rounded-full mb-3 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
          SD
        </div>
        <h1 className="font-heading font-bold text-lg text-gray-800">السودان الرقمي</h1>
        <span className="text-xs text-sudan-primary font-medium tracking-widest">VISION 2030</span>
      </div>

      {/* User Info (Mini) */}
      {user && (
        <div className="p-4 mx-4 mt-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-blue-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-cyan-700 shadow-sm border border-cyan-100">
             {user.photoUrl ? <img src={user.photoUrl} alt="User" className="w-full h-full rounded-full object-cover" /> : <UserCircle size={24} />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">{user.fullName}</p>
            <p className="text-xs text-gray-500 truncate">{user.nationalId}</p>
          </div>
          <button onClick={() => setActiveTab('identity')} className="text-cyan-600 hover:text-cyan-800" title="الهوية الرقمية">
            <QrCode size={18} />
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-sudan-primary text-white shadow-md shadow-cyan-200' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-sudan-primary'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-sudan-primary'} />
              <span className={`font-medium ${isActive ? 'font-bold' : ''}`}>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium"
        >
          <LogOut size={16} />
          تسجيل الخروج
        </button>
        <p className="text-center text-[10px] text-gray-400 mt-4">
          الإصدارة التجريبية v1.0.4
          <br/>
          جميع الحقوق محفوظة © 2025
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
