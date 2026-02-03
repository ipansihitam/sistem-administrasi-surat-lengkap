// src/components/ResetSuratButton.js

'use client';

import { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { resetSemuaSurat } from '../app/surat-masuk-keluar/actions';

export default function ResetSuratButton() {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleReset = async () => {
        // Tampilkan dialog konfirmasi
        const isConfirmed = window.confirm(
            'APAKAH ANDA YAKIN? Tindakan ini akan menghapus semua data surat yang ada secara permanen. Aksi ini tidak dapat dibatalkan.'
        );

        if (isConfirmed) {
            setIsLoading(true);
            setMessage('');
            const result = await resetSemuaSurat();
            setIsLoading(false);
            
            // Tampilkan notifikasi sederhana setelah selesai
            alert(result.message);
            
            // Refresh halaman untuk melihat perubahan jika berhasil
            if (result.success) {
                window.location.reload();
            }
        }
    };

    return (
        <button
            onClick={handleReset}
            disabled={isLoading}
            className="flex items-center justify-center px-3 py-1.5 border border-red-300 bg-red-50 text-red-700 rounded-md text-xs font-medium hover:bg-red-100 disabled:bg-red-50 disabled:cursor-not-allowed transition-colors"
        >
            {isLoading ? (
                <><Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> Mereset...</>
            ) : (
                <><Trash2 className="h-4 w-4 mr-1.5" /> Reset Surat</>
            )}
        </button>
    );
}
