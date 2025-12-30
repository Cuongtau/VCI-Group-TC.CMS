
import React, { useState, useRef } from 'react';
import { Icons } from '../../constants';
import { ProjectInfo } from '../../types';
import ConfirmModal from '../common/ConfirmModal';

interface GeneralTabProps {
  onShowToast: () => void;
}

const GeneralTab: React.FC<GeneralTabProps> = ({ onShowToast }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [projectImages, setProjectImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1000'
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    code: 'DA.2025.001',
    name: 'Dự án cầu Máy Chai',
    type: 'Hỗn hợp',
    phase: 'Khởi công',
    startDate: '2025-08-28',
    endDate: '2026-08-28',
    manager: 'Trần Hồng Hà',
    location: 'Hải Phòng',
    description: 'Dự án trọng điểm kết nối giao thông khu vực cảng biển, quy mô 4 làn xe cơ giới...'
  });
  const [backupProjectInfo, setBackupProjectInfo] = useState<ProjectInfo | null>(null);

  // Delete Modal
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; index: number | null }>({
    isOpen: false,
    index: null
  });

  const handleEditInfo = () => {
    setBackupProjectInfo({ ...projectInfo });
    setIsEditing(true);
  };

  const handleCancelEditInfo = () => {
    if (backupProjectInfo) {
      setProjectInfo(backupProjectInfo);
    }
    setIsEditing(false);
  };

  const handleSaveInfo = () => {
    setIsEditing(false);
    onShowToast();
  };

  const handleInfoChange = (field: keyof ProjectInfo, value: string) => {
    setProjectInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProjectImages([...projectImages, imageUrl]);
      onShowToast();
    }
  };

  const initiateRemoveImage = (index: number) => {
    setDeleteModal({ isOpen: true, index });
  };

  const confirmRemoveImage = () => {
    if (deleteModal.index !== null) {
        setProjectImages(prev => prev.filter((_, i) => i !== deleteModal.index));
        onShowToast();
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-10 shadow-sm animate-in fade-in">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Left Column: Image Gallery */}
        <div className="flex flex-col gap-4 items-center lg:items-start mx-auto lg:mx-0 w-full lg:w-[280px] shrink-0">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-widest">Ảnh dự án</label>
          
          <div className="w-full space-y-3">
             {/* Main Featured Image */}
             <div className="w-full aspect-video lg:aspect-[4/3] bg-slate-100 rounded-3xl overflow-hidden relative group border border-slate-100 shadow-sm">
               {projectImages.length > 0 ? (
                 <>
                   <img src={projectImages[0]} alt="Main Project" className="w-full h-full object-cover" />
                   <button 
                      onClick={() => initiateRemoveImage(0)}
                      className="absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-rose-500 hover:text-white text-slate-600 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                   >
                     <Icons.Delete />
                   </button>
                 </>
               ) : (
                 <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                    <Icons.Project />
                    <span className="text-xs mt-2 font-medium">Chưa có ảnh</span>
                 </div>
               )}
             </div>

             {/* Thumbnails Grid */}
             <div className="grid grid-cols-4 gap-2">
                {projectImages.slice(1).map((img, idx) => (
                   <div key={idx} className="aspect-square rounded-xl overflow-hidden relative group border border-slate-100 cursor-pointer hover:ring-2 ring-blue-500 transition-all">
                      <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <button 
                            onClick={() => initiateRemoveImage(idx + 1)}
                            className="text-white hover:text-rose-400"
                         >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                         </button>
                      </div>
                   </div>
                ))}
                
                {/* Add Image Button */}
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all"
                  title="Thêm ảnh"
                >
                   <Icons.Plus />
                </button>
             </div>
             <input 
               type="file" 
               ref={fileInputRef} 
               onChange={handleImageUpload} 
               hidden 
               accept="image/*"
             />
             <p className="text-[10px] text-slate-400 text-center lg:text-left leading-relaxed">
               Hỗ trợ định dạng JPG, PNG. Tối đa 5MB/ảnh.
             </p>
          </div>
        </div>
        
        {/* Right Column: Form Fields */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest hidden md:block">Thông tin chi tiết</h3>
             <div className="flex gap-2 ml-auto">
               {!isEditing ? (
                 <button 
                   onClick={handleEditInfo}
                   className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-blue-50 hover:text-blue-600 transition-all"
                 >
                   <Icons.Edit /> Sửa thông tin
                 </button>
               ) : (
                 <>
                   <button 
                     onClick={handleCancelEditInfo}
                     className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all"
                   >
                     Hủy
                   </button>
                   <button 
                     onClick={handleSaveInfo}
                     className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                   >
                     Lưu thay đổi
                   </button>
                 </>
               )}
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-10 md:gap-y-6">
            <div className="space-y-1.5">
              <label className="text-[10px] md:text-xs font-bold text-slate-800 uppercase tracking-widest">Mã dự án</label>
              <input 
                type="text" 
                value={projectInfo.code}
                onChange={(e) => handleInfoChange('code', e.target.value)}
                readOnly={!isEditing}
                className={`w-full px-4 py-2.5 rounded-xl text-sm font-medium outline-none transition-all ${isEditing ? 'bg-white border border-slate-200 focus:ring-2 focus:ring-blue-500 text-slate-800' : 'bg-slate-100 border-transparent text-slate-600'}`} 
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[10px] md:text-xs font-bold text-slate-800 uppercase tracking-widest">Tên dự án</label>
              <input 
                type="text" 
                value={projectInfo.name}
                onChange={(e) => handleInfoChange('name', e.target.value)}
                readOnly={!isEditing}
                className={`w-full px-4 py-2.5 rounded-xl text-sm font-medium outline-none transition-all ${isEditing ? 'bg-white border border-slate-200 focus:ring-2 focus:ring-blue-500 text-slate-800' : 'bg-slate-100 border-transparent text-slate-600'}`} 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] md:text-xs font-bold text-slate-800 uppercase tracking-widest">Hình thức</label>
              <input 
                type="text" 
                value={projectInfo.type}
                onChange={(e) => handleInfoChange('type', e.target.value)}
                readOnly={!isEditing}
                className={`w-full px-4 py-2.5 rounded-xl text-sm font-medium outline-none transition-all ${isEditing ? 'bg-white border border-slate-200 focus:ring-2 focus:ring-blue-500 text-slate-800' : 'bg-slate-100 border-transparent text-slate-600'}`} 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] md:text-xs font-bold text-slate-800 uppercase tracking-widest">Giai đoạn</label>
              <input 
                type="text" 
                value={projectInfo.phase}
                onChange={(e) => handleInfoChange('phase', e.target.value)}
                readOnly={!isEditing}
                className={`w-full px-4 py-2.5 rounded-xl text-sm font-medium outline-none transition-all ${isEditing ? 'bg-white border border-slate-200 focus:ring-2 focus:ring-blue-500 text-slate-800' : 'bg-slate-100 border-transparent text-slate-600'}`} 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] md:text-xs font-bold text-slate-800 uppercase tracking-widest">Ngày bắt đầu</label>
              <input 
                type="date" 
                value={projectInfo.startDate}
                onChange={(e) => handleInfoChange('startDate', e.target.value)}
                readOnly={!isEditing}
                className={`w-full px-4 py-2.5 rounded-xl text-sm font-medium outline-none transition-all ${isEditing ? 'bg-white border border-slate-200 focus:ring-2 focus:ring-blue-500 text-slate-800' : 'bg-slate-100 border-transparent text-slate-600'}`} 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] md:text-xs font-bold text-slate-800 uppercase tracking-widest">Ngày kết thúc</label>
              <input 
                type="date" 
                value={projectInfo.endDate}
                onChange={(e) => handleInfoChange('endDate', e.target.value)}
                readOnly={!isEditing}
                className={`w-full px-4 py-2.5 rounded-xl text-sm font-medium outline-none transition-all ${isEditing ? 'bg-white border border-slate-200 focus:ring-2 focus:ring-blue-500 text-slate-800' : 'bg-slate-100 border-transparent text-slate-600'}`} 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] md:text-xs font-bold text-slate-800 uppercase tracking-widest">Người quản lý</label>
              <input 
                type="text" 
                value={projectInfo.manager}
                onChange={(e) => handleInfoChange('manager', e.target.value)}
                readOnly={!isEditing}
                className={`w-full px-4 py-2.5 rounded-xl text-sm font-medium outline-none transition-all ${isEditing ? 'bg-white border border-slate-200 focus:ring-2 focus:ring-blue-500 text-slate-800' : 'bg-slate-100 border-transparent text-slate-600'}`} 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] md:text-xs font-bold text-slate-800 uppercase tracking-widest">Địa điểm thi công</label>
              <input 
                type="text" 
                value={projectInfo.location}
                onChange={(e) => handleInfoChange('location', e.target.value)}
                readOnly={!isEditing}
                className={`w-full px-4 py-2.5 rounded-xl text-sm font-medium outline-none transition-all ${isEditing ? 'bg-white border border-slate-200 focus:ring-2 focus:ring-blue-500 text-slate-800' : 'bg-slate-100 border-transparent text-slate-600'}`} 
              />
            </div>

            <div className="col-span-1 md:col-span-2 space-y-1.5">
              <label className="text-[10px] md:text-xs font-bold text-slate-800 uppercase tracking-widest">Mô tả</label>
              <textarea 
                value={projectInfo.description}
                onChange={(e) => handleInfoChange('description', e.target.value)}
                readOnly={!isEditing}
                className={`w-full px-4 py-2.5 rounded-xl text-sm font-medium outline-none resize-none h-24 transition-all ${isEditing ? 'bg-white border border-slate-200 focus:ring-2 focus:ring-blue-500 text-slate-800' : 'bg-slate-100 border-transparent text-slate-600'}`} 
              />
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={confirmRemoveImage}
        message="Bạn có chắc chắn muốn xóa hình ảnh này không?"
      />
    </div>
  );
};

export default GeneralTab;
