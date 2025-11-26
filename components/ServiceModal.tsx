import React, { useState } from 'react';
import { ServiceDefinition, UserProfile } from '../types';
import { X, FileCheck, Loader2, UploadCloud, AlertCircle } from 'lucide-react';

interface ServiceModalProps {
  service: ServiceDefinition;
  user: UserProfile;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ service, user, onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      onSubmit({ ...formData, serviceId: service.id });
      setLoading(false);
      onClose();
    }, 2000); // Simulate processing
  };

  const renderContent = () => {
    switch(step) {
      case 1: // Info & Confirmation
        return (
          <div className="space-y-4">
             <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex gap-3">
               <AlertCircle className="text-blue-600 shrink-0" />
               <p className="text-sm text-blue-800">
                 سيتم استخدام بياناتك من <strong>الهوية الرقمية</strong> لتعبئة النموذج تلقائياً. يرجى التأكد من صحة البيانات أدناه.
               </p>
             </div>
             
             <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded border">
                  <span className="text-gray-400 block text-xs">مقدم الطلب</span>
                  <span className="font-bold text-gray-800">{user.fullName}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded border">
                  <span className="text-gray-400 block text-xs">الرقم الوطني</span>
                  <span className="font-bold font-mono text-gray-800">{user.nationalId}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded border">
                  <span className="text-gray-400 block text-xs">العنوان المسجل</span>
                  <span className="font-bold text-gray-800">{user.address}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded border">
                   <span className="text-gray-400 block text-xs">رسوم الخدمة</span>
                   <span className="font-bold text-green-600">{service.fees} SDG</span>
                </div>
             </div>

             <h4 className="font-bold text-gray-800 mt-4 border-b pb-2">المستندات المطلوبة</h4>
             <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
               {service.requiredDocs.map((doc, idx) => (
                 <li key={idx}>{doc}</li>
               ))}
             </ul>
          </div>
        );
      case 2: // Uploads (Simulated)
        return (
           <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">يرجى رفع النسخ الإلكترونية للمستندات المطلوبة بصيغة PDF أو JPG.</p>
              {service.requiredDocs.map((doc, idx) => (
                <div key={idx} className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-white hover:border-sudan-primary transition-colors cursor-pointer">
                   <UploadCloud className="text-gray-400 mb-2" />
                   <span className="text-sm font-medium text-gray-700">{doc}</span>
                   <span className="text-xs text-gray-400 mt-1">اضغط للرفع أو اسحب الملف هنا</span>
                </div>
              ))}
              
              <div className="mt-4">
                 <label className="block text-sm font-medium text-gray-700 mb-2">ملاحظات إضافية</label>
                 <textarea 
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-sudan-primary outline-none"
                    rows={3}
                    placeholder="اكتب أي تفاصيل إضافية هنا..."
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                 ></textarea>
              </div>
           </div>
        );
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg relative z-10 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
           <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-lg border shadow-sm text-2xl">
                 {service.icon}
              </div>
              <div>
                 <h3 className="font-bold text-lg text-gray-800">{service.title}</h3>
                 <p className="text-xs text-gray-500">{service.category}</p>
              </div>
           </div>
           <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
              <X size={24} />
           </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
           {renderContent()}
        </div>

        {/* Footer */}
        <div className="p-5 border-t bg-gray-50 rounded-b-xl flex justify-between items-center">
           <div className="flex gap-1">
              <div className={`w-2 h-2 rounded-full ${step >= 1 ? 'bg-sudan-primary' : 'bg-gray-300'}`}></div>
              <div className={`w-2 h-2 rounded-full ${step >= 2 ? 'bg-sudan-primary' : 'bg-gray-300'}`}></div>
           </div>
           
           <div className="flex gap-3">
              {step > 1 && (
                <button 
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg"
                >
                   سابق
                </button>
              )}
              {step < 2 ? (
                <button 
                  onClick={() => setStep(step + 1)}
                  className="px-6 py-2 bg-sudan-primary text-white font-bold rounded-lg hover:bg-sudan-secondary shadow-lg shadow-cyan-100 transition-all"
                >
                   التالي
                </button>
              ) : (
                <button 
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 shadow-lg shadow-green-100 transition-all flex items-center gap-2"
                >
                   {loading ? <Loader2 className="animate-spin" size={18} /> : <FileCheck size={18} />}
                   إرسال الطلب
                </button>
              )}
           </div>
        </div>

      </div>
    </div>
  );
};

export default ServiceModal;
