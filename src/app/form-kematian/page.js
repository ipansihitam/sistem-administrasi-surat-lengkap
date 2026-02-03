'use client';

import React, { useState, useEffect, Suspense, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter, useSearchParams } from 'next/navigation';
import { saveKematian } from './actions';

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
        {number && <span className={'w-8 text-right pr-2 text-gray-500'}>{`${number}.`}</span>}
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
        className={`w-full border-b-2 border-gray-300 focus:border-blue-500 bg-transparent focus:outline-none transition-colors ${className}`} 
    />
);

const RadioSelection = ({ name, options, value, onChange }) => (
    <div className={'flex flex-wrap gap-x-4 gap-y-2'}>
        {(options || []).map(opt => 
            <div key={opt.value} className={'flex items-center'}>
                <input type='radio' name={name} id={`${name}_${opt.value}`} value={opt.value} checked={String(value) === String(opt.value)} onChange={onChange} className={'h-4 w-4 text-blue-600 focus:ring-blue-500'} />
                <label htmlFor={`${name}_${opt.value}`} className={'ml-2 text-sm text-gray-700'}>{opt.label}</label>
            </div>
        )}
    </div>
);

const DateInput = ({ namePrefix, values, onChange, errors }) => (
    <div className='flex items-center gap-2'>
        <label className='text-gray-600'>Tgl:</label>
        <div className="w-12">
            <TextInput name={`${namePrefix}_tgl`} value={values[`${namePrefix}_tgl`]} onChange={onChange} className={'text-center'} />
            <ErrorMessage message={errors && errors[`${namePrefix}_tgl`]} />
        </div>
        <label className='text-gray-600'>Bln:</label>
        <div className="w-12">
            <TextInput name={`${namePrefix}_bln`} value={values[`${namePrefix}_bln`]} onChange={onChange} className={'text-center'} />
            <ErrorMessage message={errors && errors[`${namePrefix}_bln`]} />
        </div>
        <label className='text-gray-600'>Thn:</label>
        <div className="w-16">
            <TextInput name={`${namePrefix}_thn`} value={values[`${namePrefix}_thn`]} onChange={onChange} className={'text-center'} />
            <ErrorMessage message={errors && errors[`${namePrefix}_thn`]} />
        </div>
    </div>
);

const SectionTitle = ({ title }) => <h2 className={'text-lg font-bold text-slate-800 border-b-2 border-slate-400 pb-2 mb-4 mt-6'}>{title}</h2>;

const AddressFields = ({ prefix, values, onChange, errors }) => (
    <div className={'space-y-1'}>
        <TextInput name={`${prefix}_alamat`} value={values[`${prefix}_alamat`]} onChange={onChange} placeholder={'Nama Jalan / RT/RW'} />
        <ErrorMessage message={errors && errors[`${prefix}_alamat`]} />
        <div className={'grid grid-cols-2 gap-x-8 gap-y-1 pt-2'}>
            <div>
                <TextInput name={`${prefix}_desa`} value={values[`${prefix}_desa`]} onChange={onChange} placeholder={'a. Desa/Kelurahan'}/>
                <ErrorMessage message={errors && errors[`${prefix}_desa`]} />
            </div>
            <div>
                <TextInput name={`${prefix}_kabkota`} value={values[`${prefix}_kabkota`]} onChange={onChange} placeholder={'c. Kab/Kota'}/>
                <ErrorMessage message={errors && errors[`${prefix}_kabkota`]} />
            </div>
            <div>
                <TextInput name={`${prefix}_kecamatan`} value={values[`${prefix}_kecamatan`]} onChange={onChange} placeholder={'b. Kecamatan'}/>
                <ErrorMessage message={errors && errors[`${prefix}_kecamatan`]} />
            </div>
            <div>
                <TextInput name={`${prefix}_provinsi`} value={values[`${prefix}_provinsi`]} onChange={onChange} placeholder={'d. Provinsi'}/>
                <ErrorMessage message={errors && errors[`${prefix}_provinsi`]} />
            </div>
        </div>
    </div>
);

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
            <span className="text-gray-500">474.3 /</span>
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

const SubmitButton = ({ isEditMode }) => {
    const { pending } = useFormStatus();
    return (
        <button type='submit' disabled={pending} className='bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all duration-300 disabled:bg-blue-400'>
            {isEditMode ? (pending ? 'MEMPERBARUI...' : 'PERBARUI DATA KEMATIAN') : (pending ? 'MENYIMPAN...' : 'SUBMIT DATA KEMATIAN')}
        </button>
    );
};

function KematianForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const suratId = searchParams.get('id');
    const isEditMode = !!suratId;
    const [page, setPage] = useState(1);
    const [formState, formAction] = useActionState(saveKematian, actionInitialState);
    
    const [formData, setFormData] = useState({});
    const [clientErrors, setClientErrors] = useState({});

    const pageFields = {
        1: ['kk_nama', 'kk_no'],
        2: ['jenazah_nama', 'ibu_nama', 'ayah_nama'],
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

    const createPersonSection = (title, prefix, hasUmurOnly = false) => (
        <>
            <SectionTitle title={title} />
            <Field number={1} label={'NIK'} error={getError(`${prefix}_nik`)}><TextInput name={`${prefix}_nik`} value={formData[`${prefix}_nik`]} onChange={handleChange} /></Field>
            <Field number={2} label={'Nama Lengkap'} error={getError(`${prefix}_nama`)}><TextInput name={`${prefix}_nama`} value={formData[`${prefix}_nama`]} onChange={handleChange} /></Field>
            {!hasUmurOnly ? (
                <Field number={3} label={'Tanggal Lahir / Umur'}>
                    <div className={'flex items-center gap-4'}>
                        <DateInput namePrefix={`${prefix}_tgllahir`} values={formData} onChange={handleChange} errors={formState.errors} />
                        <label className={'ml-4'}>Umur:</label>
                        <div className="w-16">
                           <TextInput name={`${prefix}_umur`} value={formData[`${prefix}_umur`]} onChange={handleChange} className={'text-center'} />
                           <ErrorMessage message={getError(`${prefix}_umur`)} />
                        </div>
                    </div>
                </Field>
            ) : (
                 <Field number={3} label={'Umur'} error={getError(`${prefix}_umur`)}><TextInput name={`${prefix}_umur`} value={formData[`${prefix}_umur`]} onChange={handleChange} className={'w-24'} /></Field>
            )}
            <Field number={4} label={'Pekerjaan'} error={getError(`${prefix}_pekerjaan`)}><TextInput name={`${prefix}_pekerjaan`} value={formData[`${prefix}_pekerjaan`]} onChange={handleChange} /></Field>
            <Field number={5} label={'Alamat'}><AddressFields prefix={`${prefix}_alamat`} values={formData} onChange={handleChange} errors={formState.errors} /></Field>
        </>
    );

    return (
        <form action={formAction} className={'max-w-4xl mx-auto my-10 p-10 bg-white shadow-2xl rounded-lg font-sans'}>
            {isEditMode && <input type="hidden" name="suratId" value={suratId} />}

            <div className={'text-center mb-6'}>
                <h1 className={'text-2xl font-bold tracking-wide text-slate-900'}>
                    {isEditMode ? 'EDIT SURAT KETERANGAN KEMATIAN' : 'SURAT KETERANGAN KEMATIAN'}
                </h1>
            </div>

            <div className="flex justify-center items-center mb-8">
                <label className="font-medium text-gray-700 mr-4">Nomor Surat:</label>
                <NomorSuratInput values={formData} onChange={handleChange} error={formState.errors} />
            </div>

            <div style={{display: page === 1 ? 'block' : 'none'}}>
                <SectionTitle title={"Data Kartu Keluarga"} />
                <Field label={'Nama Kepala Keluarga'} error={getError('kk_nama')}><TextInput name='kk_nama' value={formData.kk_nama} onChange={handleChange} /></Field>
                <Field label={'No. Kartu Keluarga'} error={getError('kk_no')}><TextInput name='kk_no' value={formData.kk_no} onChange={handleChange} /></Field>
                <div className="mt-10 flex justify-end">
                    <button type="button" onClick={nextPage} className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all duration-300">
                        Selanjutnya
                    </button>
                </div>
            </div>

            <div style={{display: page === 2 ? 'block' : 'none'}}>
                <SectionTitle title={'JENAZAH'} />
                <Field number={1} label={'NIK'} error={getError('jenazah_nik')}><TextInput name='jenazah_nik' value={formData.jenazah_nik} onChange={handleChange} /></Field>
                <Field number={2} label={'Nama'} error={getError('jenazah_nama')}><TextInput name='jenazah_nama' value={formData.jenazah_nama} onChange={handleChange} /></Field>
                <Field number={3} label={'Jenis Kelamin'} error={getError('jenazah_jk')}><RadioSelection name='jenazah_jk' value={formData.jenazah_jk} onChange={handleChange} options={[{value: '1', label: 'Laki-Laki'}, {value: '2', label: 'Perempuan'}]} /></Field>
                <Field number={4} label={'Tanggal Lahir / Umur'}>
                     <div className={'flex items-center gap-4'}>
                        <DateInput namePrefix='jenazah_tgllahir' values={formData} onChange={handleChange} errors={formState.errors} />
                        <label className={'ml-4'}>Umur:</label>
                        <div className="w-16">
                            <TextInput name='jenazah_umur' value={formData.jenazah_umur} onChange={handleChange} className={'text-center'} />
                            <ErrorMessage message={getError('jenazah_umur')} />
                        </div>
                    </div>
                </Field>
                <Field number={5} label={'Tempat Lahir'} error={getError('jenazah_tempat_lahir')}><TextInput name='jenazah_tempat_lahir' value={formData.jenazah_tempat_lahir} onChange={handleChange} /></Field>
                <Field number={6} label={'Agama'} error={getError('jenazah_agama')}><RadioSelection name='jenazah_agama' value={formData.jenazah_agama} onChange={handleChange} options={[{value: '1', label: 'Islam'}, {value: '2', label: 'Kristen'}, {value: '3', label: 'Katolik'}, {value: '4', label: 'Hindu'}, {value: '5', label: 'Budha'}, {value: '6', label: 'Konghucu'}]} /></Field>
                <Field number={7} label={'Pekerjaan'} error={getError('jenazah_pekerjaan')}><TextInput name='jenazah_pekerjaan' value={formData.jenazah_pekerjaan} onChange={handleChange} /></Field>
                <Field number={8} label={'Alamat'}><AddressFields prefix='jenazah_alamat' values={formData} onChange={handleChange} errors={formState.errors} /></Field>
                <Field number={9} label={'Anak Ke'} error={getError('jenazah_anak_ke')}><TextInput name='jenazah_anak_ke' value={formData.jenazah_anak_ke} onChange={handleChange} className='w-16' /></Field>
                <Field number={10} label={'Tanggal Kematian'}><DateInput namePrefix='jenazah_tglkematian' values={formData} onChange={handleChange} errors={formState.errors} /></Field>
                <Field number={11} label={'Waktu Kematian'} error={getError('jenazah_pukul')}><TextInput name='jenazah_pukul' value={formData.jenazah_pukul} onChange={handleChange} className={'w-24'} placeholder={'--:-- WIB'} /></Field>
                <Field number={12} label={'Sebab Kematian'} error={getError('jenazah_sebab_kematian')}><RadioSelection name='jenazah_sebab_kematian' value={formData.jenazah_sebab_kematian} onChange={handleChange} options={[{value: '1', label: 'Sakit biasa/tua'}, {value: '2', label: 'Wabah Penyakit'}, {value: '3', label: 'Kecelakaan'}]} /></Field>
                <Field number={13} label={'Tempat Kematian'} error={getError('jenazah_tempat_kematian')}><TextInput name='jenazah_tempat_kematian' value={formData.jenazah_tempat_kematian} onChange={handleChange} /></Field>
                <Field number={14} label={'Yang Menerangkan'} error={getError('jenazah_yang_menerangkan')}><RadioSelection name='jenazah_yang_menerangkan' value={formData.jenazah_yang_menerangkan} onChange={handleChange} options={[{value: '1', label: 'Dokter'}, {value: '2', label: 'Tenaga Kes.'}, {value: '3', label: 'Kepolisian'}]} /></Field>
                
                {createPersonSection('AYAH', 'ayah', true)}
                {createPersonSection('IBU', 'ibu', true)}

                <div className="mt-10 flex justify-between">
                     <button type="button" onClick={prevPage} className="bg-gray-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 transition-all duration-300">
                        Kembali
                    </button>
                    <button type="button" onClick={nextPage} className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all duration-300">
                        Selanjutnya
                    </button>
                </div>
            </div>

            <div style={{display: page === 3 ? 'block' : 'none'}}>
                 <>
                    {createPersonSection('PELAPOR', 'pelapor')}
                    {createPersonSection('SAKSI 1', 'saksi1', true)}
                    {createPersonSection('SAKSI 2', 'saksi2', true)}
                    
                    {formState.message && <p className={'text-center mt-6 font-semibold ' + (formState.success ? 'text-green-600' : 'text-red-600')}>{formState.message}</p>}

                    <div className="mt-10 flex justify-between">
                        <button type="button" onClick={prevPage} className="bg-gray-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 transition-all duration-300">
                            Kembali
                        </button>
                        <SubmitButton isEditMode={isEditMode} />
                    </div>
                </>
            </div>
        </form>
    );
}

export default function KematianPage() {
    return (
        <Suspense fallback={<div>Memuat formulir...</div>}>
            <KematianForm />
        </Suspense>
    )
}
