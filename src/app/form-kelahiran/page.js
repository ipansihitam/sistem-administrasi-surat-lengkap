
'use client';

import React, { useState, useEffect, Suspense, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter, useSearchParams } from 'next/navigation';
import { saveKelahiran } from './actions';

const actionInitialState = {
    message: null,
    errors: {},
    success: false,
};

const ErrorMessage = ({ message }) => {
    if (!message) return null;
    return <p className="text-red-600 italic text-xs mt-1">{message}</p>;
};

const Field = ({ label, children, number, className = '', error }) => (
    <div className={`flex items-start text-sm py-2 ${className}`}>
        <span className={'w-8 text-right pr-2 text-gray-500'}>{number ? `${number}.` : ''}</span>
        <span className={'w-1/3 text-gray-700 font-medium'}>{label}</span>
        <span className={'w-4 text-center text-gray-600'}>:</span>
        <div className={'flex-1'}>
            {children}
            <ErrorMessage message={error} />
        </div>
    </div>
);

const TextInput = ({ name, value, onChange, className = '', placeholder = '' }) => (
    <input 
        type='text' 
        name={name}
        value={value || ''} 
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full border-b-2 border-gray-300 focus:border-sky-500 bg-transparent focus:outline-none transition-colors ${className}`} 
    />
);

const RadioSelection = ({ name, options, value, onChange }) => (
    <div className='flex flex-wrap gap-x-6 gap-y-2'>
        {(options || []).map(opt => (
            <div key={opt.value} className='flex items-center'>
                <input type='radio' name={name} id={`${name}_${opt.value}`} value={opt.value} checked={String(value) === String(opt.value)} onChange={onChange} className='h-4 w-4 text-sky-600 focus:ring-sky-500' />
                <label htmlFor={`${name}_${opt.value}`} className='ml-2 text-sm text-gray-700'>{`${opt.value}. ${opt.label}`}</label>
            </div>
        ))}
    </div>
);

const DateInput = ({ namePrefix, values, onChange, error }) => (
    <div className='flex items-center gap-2'>
        <label className='text-gray-600'>Tgl:</label>
        <div className="w-12 text-center">
            <TextInput name={`${namePrefix}_tgl`} value={values[`${namePrefix}_tgl`]} onChange={onChange} className='text-center' />
            <ErrorMessage message={error && error[`${namePrefix}_tgl`]} />
        </div>
        <label className='text-gray-600'>Bln:</label>
        <div className="w-12 text-center">
            <TextInput name={`${namePrefix}_bln`} value={values[`${namePrefix}_bln`]} onChange={onChange} className='text-center' />
            <ErrorMessage message={error && error[`${namePrefix}_bln`]} />
        </div>
        <label className='text-gray-600'>Thn:</label>
        <div className="w-16 text-center">
            <TextInput name={`${namePrefix}_thn`} value={values[`${namePrefix}_thn`]} onChange={onChange} className='text-center' />
            <ErrorMessage message={error && error[`${namePrefix}_thn`]} />
        </div>
    </div>
);

const SectionTitle = ({ title }) => <h2 className='text-lg font-bold border-b-2 border-black pb-2 mb-4 mt-6'>{title}</h2>;

const AddressFields = ({ prefix, values, onChange, error }) => (
    <div className='space-y-1'>
        <TextInput name={`${prefix}_alamat`} value={values[`${prefix}_alamat`]} onChange={onChange} placeholder='Nama Jalan / RT/RW' />
        <ErrorMessage message={error && error[`${prefix}_alamat`]} />
        <div className='grid grid-cols-2 gap-x-8 gap-y-1 pt-2'>
            <div>
                <TextInput name={`${prefix}_desa`} value={values[`${prefix}_desa`]} onChange={onChange} placeholder='a. Desa/Kelurahan'/>
                <ErrorMessage message={error && error[`${prefix}_desa`]} />
            </div>
            <div>
                <TextInput name={`${prefix}_kabupaten`} value={values[`${prefix}_kabupaten`]} onChange={onChange} placeholder='c. Kab/Kota'/>
                <ErrorMessage message={error && error[`${prefix}_kabupaten`]} />
            </div>
            <div>
                <TextInput name={`${prefix}_kecamatan`} value={values[`${prefix}_kecamatan`]} onChange={onChange} placeholder='b. Kecamatan'/>
                <ErrorMessage message={error && error[`${prefix}_kecamatan`]} />
            </div>
            <div>
                <TextInput name={`${prefix}_provinsi`} value={values[`${prefix}_provinsi`]} onChange={onChange} placeholder='d. Provinsi'/>
                <ErrorMessage message={error && error[`${prefix}_provinsi`]} />
            </div>
        </div>
    </div>
);

const SubmitButton = ({ isEditMode }) => {
    const { pending } = useFormStatus();
    return (
        <button type='submit' disabled={pending} className='bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-700 focus:ring-4 focus:ring-sky-300 transition-all duration-300 disabled:bg-sky-400'>
            {isEditMode ? (pending ? 'MEMPERBARUI...' : 'PERBARUI DATA KELAHIRAN') : (pending ? 'MENYIMPAN...' : 'SUBMIT DATA KELAHIRAN')}
        </button>
    );
};

const NomorSuratInput = ({ values, onChange, error }) => {
    const getRomanMonth = () => {
        const month = new Date().getMonth() + 1;
        const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
        return roman[month - 1];
    }

    useEffect(() => {
        if (!values.nomorSurat_bulan) {
            onChange({ target: { name: 'nomorSurat_bulan', value: getRomanMonth() }});
        }
        if (!values.nomorSurat_tahun) {
             onChange({ target: { name: 'nomorSurat_tahun', value: new Date().getFullYear() }});
        }
    }, []);

    return (
        <div className="flex items-center font-mono tracking-wider">
            <span className="text-gray-500">474.1 /</span>
            <div className="w-20 text-center">
                <TextInput name="nomorSurat_kode" value={values.nomorSurat_kode} onChange={onChange} className="text-center" placeholder="..."/>
                <ErrorMessage message={error?.nomorSurat_kode} />
            </div>
            <span className="text-gray-500">/</span>
            <div className="w-16 text-center">
                 <TextInput name="nomorSurat_bulan" value={values.nomorSurat_bulan} onChange={onChange} className="text-center" />
                 <ErrorMessage message={error?.nomorSurat_bulan} />
            </div>
            <span className="text-gray-500">/</span>
            <div className="w-24 text-center">
                <TextInput name="nomorSurat_tahun" value={values.nomorSurat_tahun} onChange={onChange} className="text-center" />
                <ErrorMessage message={error?.nomorSurat_tahun} />
            </div>
        </div>
    );
}

function KelahiranForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const suratId = searchParams.get('id');
    const isEditMode = !!suratId;
    const [page, setPage] = useState(1);
    const [formState, formAction] = useActionState(saveKelahiran, actionInitialState);
    
    const [formData, setFormData] = useState({});
    const [clientErrors, setClientErrors] = useState({});

    const pageFields = {
        1: ['kk_nama', 'kk_no'],
        2: ['anak_nama', 'ibu_nama', 'ayah_nama'],
        3: ['pelapor_nama', 'pelapor_nik', 'saksi1_nama', 'saksi1_nik']
    };

    useEffect(() => {
        if (isEditMode) {
            const fetchSuratData = async () => {
                try {
                    const docRef = doc(db, "surat", suratId);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        const fd = data.formData || {};
                        if(data.nomorSurat) {
                           const parts = data.nomorSurat.split('/');
                           fd.nomorSurat_kode = parts[1];
                           fd.nomorSurat_bulan = parts[2];
                           fd.nomorSurat_tahun = parts[3];
                        }
                        setFormData(fd); 
                    } else {
                        console.log('Error: Surat tidak ditemukan.');
                    }
                } catch (error) {
                    console.error("Error fetching document: ", error);
                }
            };
            fetchSuratData();
        }
    }, [isEditMode, suratId]);

    useEffect(() => {
        if (formState.success) {
            setTimeout(() => {
                router.push('/arsip-surat');
            }, 2000);
        }
        if (formState.errors && Object.keys(formState.errors).length > 0) {
            const firstErrorField = Object.keys(formState.errors)[0];
            const errorPage = Object.keys(pageFields).find(p => pageFields[p].includes(firstErrorField));
            if (errorPage) {
                setPage(parseInt(errorPage, 10));
            }
        }
    }, [formState, router]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (clientErrors[name]) {
            setClientErrors(prev => ({ ...prev, [name]: null }));
        }
    };
    
    const validatePage = (pageToValidate) => {
        const newErrors = {};
        const fields = pageFields[pageToValidate] || [];
        fields.forEach(field => {
            if (!formData[field]) {
                newErrors[field] = 'Kolom ini wajib diisi.';
            }
        });
        setClientErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextPage = () => {
        if (validatePage(page)) {
            setPage(p => p + 1);
             window.scrollTo(0, 0);
        }
    };

    const prevPage = () => {
        setPage(p => p - 1);
         window.scrollTo(0, 0);
    };
    
    const getError = (fieldName) => formState.errors?.[fieldName]?.[0] || clientErrors[fieldName];

    const createPersonSection = (title, prefix, required = []) => (
        <>
            <SectionTitle title={title} />
            <Field number={1} label='NIK' error={getError(`${prefix}_nik`)}><TextInput name={`${prefix}_nik`} value={formData[`${prefix}_nik`]} onChange={handleChange} /></Field>
            <Field number={2} label='Nama Lengkap' error={getError(`${prefix}_nama`)}><TextInput name={`${prefix}_nama`} value={formData[`${prefix}_nama`]} onChange={handleChange} /></Field>
            <Field number={3} label='Tanggal Lahir / Umur'>
                <div className='flex items-center gap-4'>
                    <DateInput namePrefix={`${prefix}_tgllahir`} values={formData} onChange={handleChange} error={formState.errors} />
                    <label className='ml-4'>Umur:</label>
                     <div className="w-16">
                       <TextInput name={`${prefix}_umur`} value={formData[`${prefix}_umur`]} onChange={handleChange} className='text-center' />
                       <ErrorMessage message={getError(`${prefix}_umur`)} />
                    </div>
                </div>
            </Field>
            <Field number={4} label='Pekerjaan' error={getError(`${prefix}_pekerjaan`)}><TextInput name={`${prefix}_pekerjaan`} value={formData[`${prefix}_pekerjaan`]} onChange={handleChange} /></Field>
            <Field number={5} label='Alamat'><AddressFields prefix={`${prefix}_alamat`} values={formData} onChange={handleChange} error={formState.errors} /></Field>
            {(title === 'IBU' || title === 'AYAH') && <>
                <Field number={6} label='Kewarganegaraan' error={getError(`${prefix}_kewarganegaraan`)}><RadioSelection name={`${prefix}_kewarganegaraan`} value={formData[`${prefix}_kewarganegaraan`]} onChange={handleChange} options={[{value: '1', label: 'WNI'}, {value: '2', label: 'WNA'}]} /></Field>
            </>}
             {title === 'IBU' && <Field number={7} label='Tgl Pencatatan Perkawinan'><DateInput namePrefix='tgl_perkawinan' values={formData} onChange={handleChange} error={formState.errors} /></Field>}
        </>
    );

    return (
        <form action={formAction} className='max-w-4xl mx-auto my-10 p-10 bg-white shadow-2xl rounded-lg font-sans'>
            {isEditMode && <input type="hidden" name="suratId" value={suratId} />}

            <div className='text-center mb-6'>
                <h1 className='text-2xl font-bold tracking-wide text-slate-900'>
                    {isEditMode ? 'EDIT SURAT KETERANGAN KELAHIRAN' : 'FORMULIR SURAT KETERANGAN KELAHIRAN'}
                </h1>
            </div>

            <div className="flex justify-center items-center mb-8">
                <label className="font-medium text-gray-700 mr-4">Nomor Surat:</label>
                <NomorSuratInput values={formData} onChange={handleChange} error={formState.errors} />
            </div>

            <div style={{display: page === 1 ? 'block' : 'none'}}>
                <SectionTitle title={"Data Kepala Keluarga"} />
                <Field label='Nama Kepala Keluarga' error={getError('kk_nama')}><TextInput name='kk_nama' value={formData.kk_nama} onChange={handleChange} /></Field>
                <Field label='No. Kartu Keluarga' error={getError('kk_no')}><TextInput name='kk_no' value={formData.kk_no} onChange={handleChange} /></Field>
                <div className="mt-10 flex justify-end">
                    <button type="button" onClick={nextPage} className="bg-sky-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-700 focus:ring-4 focus:ring-sky-300 transition-all duration-300">
                        Selanjutnya
                    </button>
                </div>
            </div>

            <div style={{display: page === 2 ? 'block' : 'none'}}>
                <SectionTitle title='BAYI / ANAK' />
                <Field number={1} label='Nama Lengkap' error={getError('anak_nama')}><TextInput name='anak_nama' value={formData.anak_nama} onChange={handleChange} /></Field>
                <Field number={2} label='Jenis Kelamin' error={getError('anak_jk')}><RadioSelection name='anak_jk' value={formData.anak_jk} onChange={handleChange} options={[{value: '1', label: 'Laki-Laki'}, {value: '2', label: 'Perempuan'}]} /></Field>
                <Field number={3} label='Tempat Dilahirkan' error={getError('anak_tempat_dilahirkan')}><RadioSelection name='anak_tempat_dilahirkan' value={formData.anak_tempat_dilahirkan} onChange={handleChange} options={[{value: '1', label: 'RS/RB'}, {value: '2', label: 'Puskesmas'}, {value: '3', label: 'Polindes'}, {value: '4', label: 'Rumah'}, {value: '5', label: 'Lainnya'}]} /></Field>
                <Field number={4} label='Tempat Kelahiran' error={getError('anak_tempat_kelahiran')}><TextInput name='anak_tempat_kelahiran' value={formData.anak_tempat_kelahiran} onChange={handleChange} /></Field>
                <Field number={5} label='Hari dan Tanggal Lahir'><DateInput namePrefix='anak_tgllahir' values={formData} onChange={handleChange} error={formState.errors} /></Field>
                <Field number={6} label='Pukul' error={getError('anak_pukul')}><TextInput name='anak_pukul' value={formData.anak_pukul} onChange={handleChange} className='w-24' /></Field>
                <Field number={7} label='Jenis Kelahiran' error={getError('anak_jenis_kelahiran')}><RadioSelection name='anak_jenis_kelahiran' value={formData.anak_jenis_kelahiran} onChange={handleChange} options={[{value: '1', label: 'Tunggal'}, {value: '2', label: 'Kembar 2'}, {value: '3', label: 'Kembar 3'}, {value: '4', label: 'Kembar 4'}, {value: '5', label: 'Lainnya'}]} /></Field>
                <Field number={8} label='Kelahiran Ke' error={getError('anak_kelahiran_ke')}><TextInput name='anak_kelahiran_ke' value={formData.anak_kelahiran_ke} onChange={handleChange} className='w-16' /></Field>
                <Field number={9} label='Penolong Kelahiran' error={getError('anak_penolong')}><RadioSelection name='anak_penolong' value={formData.anak_penolong} onChange={handleChange} options={[{value: '1', label: 'Dokter'}, {value: '2', label: 'Bidan/Perawat'}, {value: '3', label: 'Dukun'}, {value: '4', label: 'Lainnya'}]} /></Field>
                <Field number={10} label='Berat Bayi (Kg)' error={getError('anak_berat')}><TextInput name='anak_berat' value={formData.anak_berat} onChange={handleChange} className='w-20' /></Field>
                <Field number={11} label='Panjang Bayi (Cm)' error={getError('anak_panjang')}><TextInput name='anak_panjang' value={formData.anak_panjang} onChange={handleChange} className='w-20' /></Field>
                
                {createPersonSection('IBU', 'ibu', ['ibu_nama'])}
                {createPersonSection('AYAH', 'ayah', ['ayah_nama'])}

                <div className="mt-10 flex justify-between">
                    <button type="button" onClick={prevPage} className="bg-gray-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 transition-all duration-300">
                        Kembali
                    </button>
                    <button type="button" onClick={nextPage} className="bg-sky-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-700 focus:ring-4 focus:ring-sky-300 transition-all duration-300">
                        Selanjutnya
                    </button>
                </div>
            </div>

            <div style={{display: page === 3 ? 'block' : 'none'}}>
                {createPersonSection('PELAPOR', 'pelapor')}
                {createPersonSection('SAKSI I', 'saksi1')}
                {createPersonSection('SAKSI II', 'saksi2')}

                {formState.message && <p className={'text-center mt-4 font-semibold ' + (formState.success ? 'text-green-600' : 'text-red-600')}>{formState.message}</p>}
                
                <div className="mt-10 flex justify-between">
                    <button type="button" onClick={prevPage} className="bg-gray-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 transition-all duration-300">
                        Kembali
                    </button>
                   <SubmitButton isEditMode={isEditMode} />
                </div>
            </div>

        </form>
    );
}

export default function KelahiranPage() {
    return (
        <Suspense fallback={<div>Memuat formulir...</div>}>
            <KelahiranForm />
        </Suspense>
    );
}
