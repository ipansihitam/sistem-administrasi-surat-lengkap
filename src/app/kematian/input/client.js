'use client';

import { useFormState } from 'react-dom';
import { useTransition } from 'react';
import { saveSuratKematian } from './actions';
import Link from 'next/link';

const initialState = {
    message: null,
    status: null,
};

export default function InputSuratKematianClient() {
    const [state, formAction] = useFormState(saveSuratKematian, initialState);
    const [isPending, startTransition] = useTransition();

    const handleFormSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        startTransition(() => {
            formAction(formData);
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full space-y-8 bg-white p-10 rounded-2xl shadow-lg">
                <div>
                    <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-900">Formulir Surat Kematian</h2>
                    <p className="mt-2 text-center text-sm text-slate-600">Lengkapi semua informasi yang diperlukan di bawah ini.</p>
                </div>

                {state?.message && (
                    <div className={`p-4 rounded-md ${state.status === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        <p>{state.message}</p>
                    </div>
                )}

                <form className="mt-8 space-y-7" onSubmit={handleFormSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Data Jenazah */}
                        <div className="col-span-1 md:col-span-2">
                            <h3 className="text-lg font-medium leading-6 text-slate-900">Data Jenazah</h3>
                            <hr className="mt-2"/>
                        </div>
                        <InputField id="namaJenazah" name="namaJenazah" label="Nama Lengkap Jenazah" type="text" required />
                        <InputField id="nikJenazah" name="nikJenazah" label="NIK Jenazah" type="text" required />
                        <SelectField id="jenisKelamin" name="jenisKelamin" label="Jenis Kelamin" required>
                            <option value="">Pilih Jenis Kelamin</option>
                            <option value="Laki-laki">Laki-laki</option>
                            <option value="Perempuan">Perempuan</option>
                        </SelectField>
                        <InputField id="tanggalLahir" name="tanggalLahir" label="Tanggal Lahir" type="date" required />
                        <TextAreaField id="alamat" name="alamat" label="Alamat Lengkap" required />

                        <div className="col-span-1 md:col-span-2">
                            <h3 className="text-lg font-medium leading-6 text-slate-900">Detail Kematian</h3>
                            <hr className="mt-2"/>
                        </div>
                        <InputField id="tanggalMeninggal" name="tanggalMeninggal" label="Tanggal Meninggal Dunia" type="date" required />
                        <InputField id="penyebabMeninggal" name="penyebabMeninggal" label="Penyebab Kematian" type="text" required />
                        <InputField id="tempatMeninggal" name="tempatMeninggal" label="Tempat Meninggal Dunia" type="text" required />
                        
                        {/* Data Pelapor */}
                        <div className="col-span-1 md:col-span-2">
                            <h3 className="text-lg font-medium leading-6 text-slate-900">Data Pelapor</h3>
                             <hr className="mt-2"/>
                        </div>
                        <InputField id="namaPelapor" name="namaPelapor" label="Nama Lengkap Pelapor" type="text" required />
                        <InputField id="nikPelapor" name="nikPelapor" label="NIK Pelapor" type="text" required />
                        <InputField id="hubunganPelapor" name="hubunganPelapor" label="Hubungan dengan Jenazah" type="text" required />
                    </div>

                    <div className="flex items-center justify-end gap-4 pt-4">
                        <Link href="/surat-masuk-keluar" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-slate-700 bg-slate-100 hover:bg-slate-200">
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 disabled:bg-sky-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                        >
                            {isPending ? 'Menyimpan...' : 'Simpan & Cetak Nanti'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Helper komponen untuk konsistensi
const InputField = ({ id, name, label, type, required = false }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700">{label}</label>
        <input id={id} name={name} type={type} required={required} className="mt-1 appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" />
    </div>
);

const SelectField = ({ id, name, label, required = false, children }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700">{label}</label>
        <select id={id} name={name} required={required} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm">
            {children}
        </select>
    </div>
);

const TextAreaField = ({ id, name, label, required = false }) => (
    <div className="md:col-span-2">
        <label htmlFor={id} className="block text-sm font-medium text-slate-700">{label}</label>
        <textarea id={id} name={name} required={required} rows="3" className="mt-1 appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"></textarea>
    </div>
);
