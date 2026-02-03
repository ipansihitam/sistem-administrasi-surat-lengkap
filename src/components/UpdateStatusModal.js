'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function UpdateStatusModal({ surat, onClose }) {
  const [newStatus, setNewStatus] = useState(surat?.status || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    setNewStatus(surat?.status || '');
    const handleEsc = (event) => {
      if (event.keyCode === 27) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [surat, onClose]);

  if (!surat) return null;

  const handleUpdate = async () => {
    if (newStatus === surat.status) {
        onClose();
        return;
    }
    setIsUpdating(true);
    setError('');
    try {
      const suratRef = doc(db, 'surat', surat.id);
      await updateDoc(suratRef, { status: newStatus });
      setIsUpdating(false);
      onClose();
      router.refresh(); // Refresh data di server component
    } catch (err) {
      console.error("Error updating document: ", err);
      setError('Gagal memperbarui status. Silakan coba lagi.');
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-5 border-b">
          <h3 className="text-xl font-bold">Ubah Status Surat</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
        </div>
        <div className="p-6">
            <p className='mb-1 text-sm text-gray-500'>Surat untuk: <span className='font-semibold text-gray-800'>{surat.nama || surat.namaLengkap}</span></p>
            <p className='mb-4 text-sm text-gray-500'>Jenis: <span className='font-semibold text-gray-800'>{surat.jenisSurat}</span></p>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">Status Baru</label>
          <select
            id="status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="Belum Selesai">Belum Selesai</option>
            <option value="Sedang Diproses">Sedang Diproses</option>
            <option value="Selesai">Selesai</option>
            <option value="Ditolak">Ditolak</option>
          </select>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
        <div className="flex justify-end items-center gap-3 p-4 bg-gray-50 border-t">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
            Batal
          </button>
          <button onClick={handleUpdate} disabled={isUpdating} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300">
            {isUpdating ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>
    </div>
  );
}
