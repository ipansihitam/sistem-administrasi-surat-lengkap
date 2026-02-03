'use client';

import { useState, useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { createSuratWarga } from './actions';

const initialState = {
  message: null,
  success: false,
};

const InputField = ({ id, label, type = 'text', placeholder, required }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
        <input
            type={type}
            id={id}
            name={id}
            placeholder={placeholder}
            required={required}
            className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm p-3 transition-shadow duration-200"
        />
    </div>
);

const SelectField = ({ id, label, value, onChange, options, required }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
        <select
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full bg-white border border-slate-300 text-slate-900 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm p-3 transition-shadow duration-200"
        >
            <option value="">Pilih Jenis Surat...</option>
            {options.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
            ))}
        </select>
    </div>
);

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button 
            type="submit" 
            className="bg-sky-500 py-3 px-6 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            disabled={pending}
        >
            {pending ? 'Menyimpan...' : 'Simpan Surat'}
        </button>
    );
}

export default function SuratWargaInputClient() {
    const [state, formAction] = useActionState(createSuratWarga, initialState);
    const router = useRouter();
    const [jenisSurat, setJenisSurat] = useState(''); 

    useEffect(() => {
        if (state.success) {
            alert(state.message);
            router.push('/surat-warga');
        }
    }, [state, router]);

    const commonFields = (
        <div className="space-y-6">
            <InputField id="nama" label="Nama Lengkap" placeholder="Masukkan Nama Lengkap Anda" required />
            <InputField id="jenisKelamin" label="Jenis Kelamin" placeholder="Laki-laki / Perempuan" required />
            <InputField id="ttl" label="Tempat / Tanggal Lahir" placeholder="Masukkan Tempat / Tanggal Lahir Anda" required />
            <InputField id="kewarganegaraan" label="Warga Negara" placeholder="Masukkan Negara Asal Anda" required />
            <InputField id="agama" label="Agama" placeholder="Masukkan Agama Anda" required />
            <InputField id="pekerjaan" label="Pekerjaan" placeholder="Masukkan Pekerjaan Anda" required />
            <InputField id="alamat" label="Tempat Tinggal" placeholder="Masukkan Alamat Lengkap Anda" required />
            <InputField id="suratBuktiDiri" label="Surat Bukti Diri (NIK)" placeholder="Masukkan Nomor NIK Anda" required />
            <InputField id="keperluan" label="Keperluan" placeholder="Masukkan Keperluan Anda" required />
            <InputField id="berlaku" label="Berlaku Mulai" type="date" required />
            <InputField id="keteranganLain" label="Keterangan Lain" placeholder="Tuliskan Keterangan Tambahan Jika Ada" />
            <InputField id="tanggalSurat" label="Tanggal Surat" type="date" required />
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-extrabold text-slate-900">Input Surat Warga</h1>
                    <p className="text-slate-600 mt-2">Lengkapi formulir di bawah untuk mencatat surat warga.</p>
                </div>
                
                <form action={formAction} className="space-y-6">
                    <SelectField 
                        id="jenisSurat" 
                        label="Jenis Surat"
                        value={jenisSurat}
                        onChange={(e) => setJenisSurat(e.target.value)}
                        options={[
                            { value: 'keterangan', label: 'Surat Keterangan' },
                            { value: 'pengantar', label: 'Surat Pengantar' },
                            { value: 'usaha', label: 'Surat Keterangan Usaha' },
                            { value: 'tidak_mampu', label: 'Surat Keterangan Tidak Mampu' },
                        ]}
                        required
                    />
                    
                    {jenisSurat === 'usaha' && (
                        <div className="space-y-6 animate-fade-in border-t border-slate-200 pt-6">
                             <h3 className="text-xl font-bold text-slate-800">Data Pemohon & Usaha</h3>
                            <InputField id="nama" label="Nama Pemohon" placeholder="Masukkan Nama Lengkap Anda" required />
                            <InputField id="nik" label="NIK" placeholder="Masukkan NIK Anda" required />
                            <InputField id="ttl" label="Tempat / Tanggal Lahir" placeholder="Masukkan Tempat / Tanggal Lahir" required />
                            <InputField id="jenisKelamin" label="Jenis Kelamin" placeholder="Laki-laki / Perempuan" required />
                            <InputField id="agama" label="Agama" placeholder="Masukkan Agama Anda" required />
                            <InputField id="kewarganegaraan" label="Warganegara" placeholder="Masukkan Negara Asal Anda" required />
                            <InputField id="alamat" label="Alamat" placeholder="Masukkan Alamat Lengkap Anda" required />
                            <InputField id="namaUsaha" label="Nama Usaha" placeholder="Masukkan Nama Usaha Anda" required />
                            <InputField id="jenisUsaha" label="Jenis Usaha" placeholder="Masukkan Jenis Usaha Anda" required />
                            <InputField id="alamatUsaha" label="Alamat Usaha" placeholder="Masukkan Alamat Lengkap Usaha Anda" required />
                             <InputField id="tanggalSurat" label="Tanggal Surat" type="date" required />
                        </div>
                    )}

                    {(jenisSurat === 'keterangan' || jenisSurat === 'pengantar' || jenisSurat === 'tidak_mampu') && (
                        <div className="space-y-6 animate-fade-in border-t border-slate-200 pt-6">
                            <h3 className="text-xl font-bold text-slate-800">Data Pemohon</h3>
                            {commonFields}
                        </div>
                    )}

                    <div className="pt-6 border-t border-slate-200">
                        <div className="flex flex-col items-end gap-4">
                            <div className="flex justify-end gap-4 w-full">
                                <button type="button" onClick={() => router.back()} className="bg-slate-100 py-3 px-6 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 transition-all">
                                    Batal
                                </button>
                                <SubmitButton />
                            </div>
                            {state?.message && !state.success && (
                                <p className={`mt-2 text-sm text-red-600`}>
                                    {state.message}
                                </p>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
