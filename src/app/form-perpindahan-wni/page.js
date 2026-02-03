'use client';

import { useState, useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { savePindah } from './actions';

const actionInitialState = {
    message: null,
    errors: null,
    success: false,
    redirect: null,
};

const ErrorMessage = ({ message }) => {
    if (!message) return null;
    return <p className="text-red-500 text-xs mt-1">{message}</p>;
};

// Komponen FormInput dan lainnya tetap sama...
const FormInput = ({ label, name, value, onChange, error, type = 'text', placeholder = '' }) => (
    <div className="flex items-center">
        {label && <label htmlFor={name} className="w-48 text-sm text-gray-700">{label}</label>}
        <span className="mx-2">:</span>
        <input
            type={type}
            id={name}
            name={name}
            value={value || ''} // Fallback ini sudah aman
            onChange={onChange}
            placeholder={placeholder}
            className={`flex-1 px-3 py-1.5 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-sm`}
        />
        <ErrorMessage message={error} />
    </div>
);

const HeaderInput = ({ label, name, value, onChange, error }) => (
    <div className="flex items-center mb-2">
        <label htmlFor={name} className="w-48 text-sm font-medium text-gray-700">{label}</label>
        <span className="mx-2">:</span>
        <input
            type="text"
            id={name}
            name={name}
            value={value || ''} // Fallback ini sudah aman
            onChange={onChange}
            className={`flex-1 px-3 py-1.5 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-sm`}
        />
         <ErrorMessage message={error} />
    </div>
);

const AlasanPindahRadio = ({ value, onChange, error }) => (
    <div className="flex items-center">
        <label className="w-48 text-sm text-gray-700">1. Alasan Pindah</label>
        <span className="mx-2">:</span>
        <div className="flex flex-wrap gap-x-4 gap-y-2 flex-1">
            {[ 'Pekerjaan', 'Pendidikan', 'Keamanan', 'Kesehatan', 'Perumahan', 'Keluarga', 'Lainnya'].map(alasan => (
                <label key={alasan} className="flex items-center text-sm">
                    <input type="radio" name="alasan_pindah" value={alasan} checked={value === alasan} onChange={onChange} className="mr-1.5 h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-500"/>
                    {alasan}
                </label>
            ))}
        </div>
        <ErrorMessage message={error} />
    </div>
);

const JenisKepindahanRadio = ({ value, onChange, error }) => (
    <div className="flex items-center">
        <label className="w-48 text-sm text-gray-700">3. Jenis Kepindahan</label>
        <span className="mx-2">:</span>
        <div className="flex flex-wrap gap-x-4 gap-y-2 flex-1">
            {['Kep. Keluarga', 'Kep. Keluarga dan Seluruh Angg. Keluarga', 'Kep. Keluarga dan Sebagian Angg. Keluarga', 'Angg. Keluarga'].map(jenis => (
                <label key={jenis} className="flex items-center text-sm">
                    <input type="radio" name="jenis_kepindahan" value={jenis} checked={value === jenis} onChange={onChange} className="mr-1.5 h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-500"/>
                    {jenis}
                </label>
            ))}
        </div>
        <ErrorMessage message={error} />
    </div>
);

const StatusKKRadio = ({ label, name, value, onChange, options, error }) => (
    <div className="flex items-center">
        <label className="w-48 text-sm text-gray-700">{label}</label>
        <span className="mx-2">:</span>
        <div className="flex flex-wrap gap-x-4 gap-y-2 flex-1">
            {options.map(opt => (
                <label key={opt} className="flex items-center text-sm">
                    <input type="radio" name={name} value={opt} checked={value === opt} onChange={onChange} className="mr-1.5 h-4 w-4 border-gray-300 text-sky-600 focus:ring-sky-500" />
                    {opt}
                </label>
            ))}
        </div>
         <ErrorMessage message={error} />
    </div>
);

const SubmitButton = () => {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-blue-400">
            {pending ? 'Mengajukan...' : 'AJUKAN PERMOHONAN'}
        </button>
    );
};

function PerpindahanForm() {
    const router = useRouter();
    const [formState, formAction] = useActionState(savePindah, actionInitialState);
    const [page, setPage] = useState(1);

    // --- PERBAIKAN: Inisialisasi semua field formulir dengan string kosong --- 
    const [formData, setFormData] = useState({
        header_prov: '', header_kab: '', header_kec: '', header_desa: '', header_dusun: '',
        nomorSurat_kode: '', nomorSurat_bulan: '', nomorSurat_tahun: '',
        kk_no_asal: '', kk_nama_asal: '',
        alamat_asal_dusun: '', alamat_asal_rt: '', alamat_asal_rw: '',
        alamat_asal_desa: '', alamat_asal_kec: '', alamat_asal_kab: '', alamat_asal_prov: '',
        pemohon_nik: '', pemohon_nama: '',
        alasan_pindah: '', 
        alamat_tujuan_dusun: '', alamat_tujuan_rt: '', alamat_tujuan_rw: '',
        alamat_tujuan_desa: '', alamat_tujuan_kec: '', alamat_tujuan_kab: '', alamat_tujuan_prov: '',
        jenis_kepindahan: '', status_kk_tidak_pindah: '', status_kk_pindah: ''
    });
    const [familyToMove, setFamilyToMove] = useState([]);

    useEffect(() => {
        if (formState.success && formState.redirect) {
            router.push(formState.redirect);
        }
    }, [formState, router]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleFamilyChange = (index, event) => {
        const newFamily = [...familyToMove];
        newFamily[index][event.target.name] = event.target.value;
        setFamilyToMove(newFamily);
    };

    const addFamilyMember = () => {
        setFamilyToMove([...familyToMove, { id: Date.now(), nik: '', nama: '', ktp_berlaku: '', shdk: '' }]);
    };

    const removeFamilyMember = (index) => {
        setFamilyToMove(familyToMove.filter((_, i) => i !== index));
    };

    return (
         <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
            {/* Header, Title, etc. tetap sama */}
            <div className="mb-8">
                <HeaderInput label="Pemerintah Provinsi" name="header_prov" value={formData.header_prov} onChange={handleChange} />
                <HeaderInput label="Pemerintah Kabupaten/Kota" name="header_kab" value={formData.header_kab} onChange={handleChange} />
                <HeaderInput label="Kecamatan" name="header_kec" value={formData.header_kec} onChange={handleChange} />
                <HeaderInput label="Kelurahan/Desa" name="header_desa" value={formData.header_desa} onChange={handleChange} />
                <HeaderInput label="Dusun/Dukuh/Kampung" name="header_dusun" value={formData.header_dusun} onChange={handleChange} />
            </div>

            <div className="text-center mb-8">
                <h1 className="text-xl font-bold tracking-wider">FORMULIR PERMOHONAN PINDAH WNI</h1>
                <p className="text-sm">Antar Kabupaten/Kota atau Antar Provinsi</p>
                 <div className="flex justify-center items-center text-sm font-semibold mt-2">
                    <span>475 /</span>
                    <input type="text" name="nomorSurat_kode" value={formData.nomorSurat_kode || ''} onChange={handleChange} className="w-24 text-center border-b mx-1" placeholder="Kode" />
                    <span>/</span>
                    <input type="text" name="nomorSurat_bulan" value={formData.nomorSurat_bulan || ''} onChange={handleChange} className="w-10 text-center border-b mx-1" placeholder="Bln" />
                    <span>/</span>
                    <input type="text" name="nomorSurat_tahun" value={formData.nomorSurat_tahun || ''} onChange={handleChange} className="w-16 text-center border-b mx-1" placeholder="Tahun" />
                </div>
            </div>

            <form action={formAction}>
                <input type="hidden" name="formData" value={JSON.stringify(formData)} />
                <input type="hidden" name="familyToMove" value={JSON.stringify(familyToMove)} />

                {page === 1 && (
                    <section>
                        <h2 className="font-bold text-gray-800 mb-4">DATA DAERAH ASAL</h2>
                        <div className="space-y-3">
                            <FormInput label="1. Nomor Kartu Keluarga" name="kk_no_asal" value={formData.kk_no_asal} onChange={handleChange} />
                            <FormInput label="2. Nama Kepala Keluarga" name="kk_nama_asal" value={formData.kk_nama_asal} onChange={handleChange} />
                            <div>
                                <div className="flex items-start">
                                    <label className="w-48 text-sm text-gray-700">3. Alamat</label>
                                    <span className="mx-2">:</span>
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center">
                                            {/* --- PERBAIKAN: Menambahkan fallback || '' untuk keamanan --- */}
                                            <input type="text" name="alamat_asal_dusun" placeholder="Dusun/Dukuh/Kampung" value={formData.alamat_asal_dusun || ''} onChange={handleChange} className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm"/>
                                            <span className="mx-2">RT:</span>
                                            <input type="text" name="alamat_asal_rt" value={formData.alamat_asal_rt || ''} onChange={handleChange} className="w-16 px-3 py-1.5 border border-gray-300 rounded-md text-sm"/>
                                            <span className="mx-2">RW:</span>
                                            <input type="text" name="alamat_asal_rw" value={formData.alamat_asal_rw || ''} onChange={handleChange} className="w-16 px-3 py-1.5 border border-gray-300 rounded-md text-sm"/>
                                        </div>
                                        <div className="grid grid-cols-2 gap-x-4">
                                            <FormInput label="a. Desa/Kelurahan" name="alamat_asal_desa" value={formData.alamat_asal_desa} onChange={handleChange} />
                                            <FormInput label="c. Kabupaten/Kota" name="alamat_asal_kab" value={formData.alamat_asal_kab} onChange={handleChange} />
                                            <FormInput label="b. Kecamatan" name="alamat_asal_kec" value={formData.alamat_asal_kec} onChange={handleChange} />
                                            <FormInput label="d. Propinsi" name="alamat_asal_prov" value={formData.alamat_asal_prov} onChange={handleChange} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <FormInput label="4. NIK Pemohon" name="pemohon_nik" value={formData.pemohon_nik} onChange={handleChange} />
                            <FormInput label="5. Nama Lengkap" name="pemohon_nama" value={formData.pemohon_nama} onChange={handleChange} />
                        </div>
                        <div className="flex justify-end mt-8">
                            <button type="button" onClick={() => setPage(2)} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">
                                Selanjutnya
                            </button>
                        </div>
                    </section>
                )}

                {page === 2 && (
                    <section>
                        <h2 className="font-bold text-gray-800 mb-4">DATA DAERAH TUJUAN</h2>
                        <div className="space-y-3">
                           <AlasanPindahRadio value={formData.alasan_pindah} onChange={handleChange} />
                            <div>
                                <div className="flex items-start">
                                    <label className="w-48 text-sm text-gray-700">2. Alamat Tujuan Pindah</label>
                                    <span className="mx-2">:</span>
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center">
                                            {/* --- PERBAIKAN: Menambahkan fallback || '' untuk keamanan --- */}
                                            <input type="text" name="alamat_tujuan_dusun" placeholder="Dusun/Dukuh/Kampung" value={formData.alamat_tujuan_dusun || ''} onChange={handleChange} className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm"/>
                                            <span className="mx-2">RT:</span>
                                            <input type="text" name="alamat_tujuan_rt" value={formData.alamat_tujuan_rt || ''} onChange={handleChange} className="w-16 px-3 py-1.5 border border-gray-300 rounded-md text-sm"/>
                                            <span className="mx-2">RW:</span>
                                            <input type="text" name="alamat_tujuan_rw" value={formData.alamat_tujuan_rw || ''} onChange={handleChange} className="w-16 px-3 py-1.5 border border-gray-300 rounded-md text-sm"/>
                                        </div>
                                        <div className="grid grid-cols-2 gap-x-4">
                                             <FormInput label="a. Desa/Kelurahan" name="alamat_tujuan_desa" value={formData.alamat_tujuan_desa} onChange={handleChange} />
                                            <FormInput label="c. Kabupaten/Kota" name="alamat_tujuan_kab" value={formData.alamat_tujuan_kab} onChange={handleChange} />
                                            <FormInput label="b. Kecamatan" name="alamat_tujuan_kec" value={formData.alamat_tujuan_kec} onChange={handleChange} />
                                            <FormInput label="d. Propinsi" name="alamat_tujuan_prov" value={formData.alamat_tujuan_prov} onChange={handleChange} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                           <JenisKepindahanRadio value={formData.jenis_kepindahan} onChange={handleChange} />
                            <StatusKKRadio label="4. Status No KK Bagi Yang Tidak Pindah" name="status_kk_tidak_pindah" value={formData.status_kk_tidak_pindah} onChange={handleChange} options={['Numpang KK', 'Membuat KK Baru', 'Nomor KK Tetap']} />
                            <StatusKKRadio label="5. Status No KK Bagi Yang Pindah" name="status_kk_pindah" value={formData.status_kk_pindah} onChange={handleChange} options={['Numpang KK', 'Membuat KK Baru']} />
                        </div>

                        {/* Sisanya tetap sama... */}
                        <h2 className="font-bold text-gray-800 mt-8 mb-4">6. Keluarga Yang Pindah</h2>
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">No</th>
                                    <th scope="col" className="px-6 py-3">NIK</th>
                                    <th scope="col" className="px-6 py-3">Nama</th>
                                    <th scope="col" className="px-6 py-3">Masa Berlaku KTP s/d</th>
                                    <th scope="col" className="px-6 py-3">SHDK</th>
                                    <th scope="col" className="px-6 py-3">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {familyToMove.map((member, index) => (
                                    <tr key={member.id} className="bg-white border-b">
                                        <td className="px-6 py-4">{index + 1}</td>
                                        <td className="px-6 py-4"><input type="text" name="nik" value={member.nik} onChange={e => handleFamilyChange(index, e)} className="w-full bg-gray-50 border border-gray-300 rounded px-2 py-1"/></td>
                                        <td className="px-6 py-4"><input type="text" name="nama" value={member.nama} onChange={e => handleFamilyChange(index, e)} className="w-full bg-gray-50 border border-gray-300 rounded px-2 py-1"/></td>
                                        <td className="px-6 py-4"><input type="text" name="ktp_berlaku" value={member.ktp_berlaku} onChange={e => handleFamilyChange(index, e)} className="w-full bg-gray-50 border border-gray-300 rounded px-2 py-1"/></td>
                                        <td className="px-6 py-4"><input type="text" name="shdk" value={member.shdk} onChange={e => handleFamilyChange(index, e)} className="w-full bg-gray-50 border border-gray-300 rounded px-2 py-1"/></td>
                                        <td className="px-6 py-4"><button type="button" onClick={() => removeFamilyMember(index)} className="text-red-600 hover:text-red-800">Hapus</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button type="button" onClick={addFamilyMember} className="mt-4 mb-8 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 text-sm">+ Tambah Anggota</button>

                        <div className="flex justify-between mt-8">
                            <button type="button" onClick={() => setPage(1)} className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700">
                                Kembali
                            </button>
                            <SubmitButton />
                        </div>
                    </section>
                )}
                 {formState?.message && (
                    <div className={`mt-6 p-4 rounded-md text-sm ${formState.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {formState.message}
                    </div>
                )}
            </form>
        </div>
    );
}

export default function BuatSuratPindahWniPage() {
    return (
         <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <PerpindahanForm />
        </div>
    );
}
