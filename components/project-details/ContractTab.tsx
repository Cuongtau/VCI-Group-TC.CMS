
import React, { useState } from 'react';
import { Icons } from '../../constants';
import { Contract, Appendix } from '../../types';

interface ContractTabProps {
  // Pass necessary props here
}

const ContractTab: React.FC<ContractTabProps> = () => {
  const [contracts] = useState<Contract[]>([
    { id: 'c1', code: 'HĐ-2024/001', name: 'Hợp đồng thi công xây dựng chính', value: '15,000,000,000 VNĐ', date: '15/01/2024', status: 'active', files: 3 },
    { id: 'c2', code: 'HĐ-2024/005', name: 'Hợp đồng cung cấp vật tư bê tông', value: '2,400,000,000 VNĐ', date: '20/02/2024', status: 'active', files: 1 },
  ]);

  const [appendixes] = useState<Appendix[]>([
    { id: 'a1', code: 'PL-01/HĐ-2024/001', contractId: 'c1', name: 'Điều chỉnh đơn giá nhân công', adjustValue: '+ 500,000,000 VNĐ', date: '10/06/2024' }
  ]);

  return (
    <div className="space-y-4 animate-in fade-in">
       <div className="flex justify-between items-center"><h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Danh sách Hợp đồng</h3><button className="text-blue-600 text-xs font-bold uppercase hover:underline">+ Thêm mới</button></div>
       {contracts.map(c => (
           <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3">
               <div className="flex justify-between items-start">
                   <div>
                       <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-[10px] font-black">{c.code}</span>
                       <h4 className="text-sm font-bold text-slate-800 mt-2">{c.name}</h4>
                   </div>
                   <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase">{c.status}</span>
               </div>
               <div className="grid grid-cols-2 gap-4 mt-2">
                   <div><p className="text-[10px] text-slate-400 font-bold uppercase">Giá trị</p><p className="text-sm font-bold text-slate-700">{c.value}</p></div>
                   <div><p className="text-[10px] text-slate-400 font-bold uppercase">Ngày ký</p><p className="text-sm font-bold text-slate-700">{c.date}</p></div>
               </div>
               <div className="pt-3 border-t border-slate-100 flex gap-2">
                   <button className="text-xs text-slate-500 font-medium flex items-center gap-1"><Icons.Project /> {c.files} Đính kèm</button>
               </div>
           </div>
       ))}
        <div className="mt-8">
            <div className="flex justify-between items-center mb-4"><h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Phụ lục Hợp đồng</h3><button className="text-blue-600 text-xs font-bold uppercase hover:underline">+ Thêm mới</button></div>
            {appendixes.map(a => (
                <div key={a.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mb-4">
                    <div className="flex flex-col gap-1 mb-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Thuộc: {contracts.find(c => c.id === a.contractId)?.code}</span>
                        <h4 className="text-sm font-bold text-slate-800">{a.name}</h4>
                        <span className="text-xs text-slate-500 font-mono bg-slate-50 w-fit px-2 py-0.5 rounded">{a.code}</span>
                    </div>
                    <div className="flex justify-between items-center bg-blue-50/50 p-3 rounded-xl">
                        <span className="text-xs font-bold text-slate-600">Điều chỉnh:</span>
                        <span className="text-sm font-black text-blue-600">{a.adjustValue}</span>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default ContractTab;
