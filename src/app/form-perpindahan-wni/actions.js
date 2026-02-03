'use server';

import { z } from 'zod';
import { db } from '../../lib/firebase'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FamilyMemberSchema = z.object({
    id: z.any(),
    nik: z.string().optional(),
    nama: z.string().optional(),
    ktp_berlaku: z.string().optional(),
    shdk: z.string().optional(),
});

const PindahWniFormSchema = z.object({
    header_prov: z.string().optional(),
    header_kab: z.string().optional(),
    header_kec: z.string().optional(),
    header_desa: z.string().optional(),
    header_dusun: z.string().optional(),
    nomorSurat_kode: z.string().optional(),
    nomorSurat_bulan: z.string().optional(),
    nomorSurat_tahun: z.string().optional(),
    kk_no_asal: z.string().min(1, 'Nomor KK asal wajib diisi'),
    kk_nama_asal: z.string().min(1, 'Nama Kepala Keluarga asal wajib diisi'),
    alamat_asal_dusun: z.string().optional(),
    alamat_asal_rt: z.string().optional(),
    alamat_asal_rw: z.string().optional(),
    alamat_asal_desa: z.string().optional(),
    alamat_asal_kec: z.string().optional(),
    alamat_asal_kab: z.string().optional(),
    alamat_asal_prov: z.string().optional(),
    pemohon_nik: z.string().min(1, 'NIK Pemohon wajib diisi'),
    pemohon_nama: z.string().min(1, 'Nama Pemohon wajib diisi'),
    alasan_pindah: z.string().optional(),
    alamat_tujuan_dusun: z.string().optional(),
    alamat_tujuan_rt: z.string().optional(),
    alamat_tujuan_rw: z.string().optional(),
    alamat_tujuan_desa: z.string().optional(),
    alamat_tujuan_kec: z.string().optional(),
    alamat_tujuan_kab: z.string().optional(),
    alamat_tujuan_prov: z.string().optional(),
    jenis_kepindahan: z.string().optional(),
    status_kk_tidak_pindah: z.string().optional(),
    status_kk_pindah: z.string().optional(),
});

export async function savePindah(prevState, formData) {
    const rawFormData = formData.get('formData');
    const rawFamilyData = formData.get('familyToMove');

    let parsedFormData, parsedFamilyData;

    try {
        parsedFormData = JSON.parse(rawFormData);
        parsedFamilyData = JSON.parse(rawFamilyData);
    } catch (error) {
        return { success: false, message: "Gagal memproses data formulir. Data tidak valid." };
    }

    const validatedForm = PindahWniFormSchema.safeParse(parsedFormData);
    const validatedFamily = z.array(FamilyMemberSchema).safeParse(parsedFamilyData);

    if (!validatedForm.success || !validatedFamily.success) {
        const formErrors = validatedForm.success ? {} : validatedForm.error.flatten().fieldErrors;
        const familyErrors = validatedFamily.success ? [] : validatedFamily.error.issues.map(issue => `Baris ${issue.path[0] + 1}: ${issue.message}`);
        
        return {
            errors: formErrors,
            familyErrors: familyErrors,
            message: 'Gagal: Mohon periksa kembali isian Anda.',
        };
    }

    const { nomorSurat_kode, nomorSurat_bulan, nomorSurat_tahun } = validatedForm.data;
    const nomorSurat = `475 / ${nomorSurat_kode || ''} / ${nomorSurat_bulan || ''} / ${nomorSurat_tahun || ''}`;

    let newDocRef;
    try {
        const docData = {
            nomorSurat,
            jenisSurat: 'Pindah WNI',
            nama: validatedForm.data.pemohon_nama,
            status: 'Selesai', 
            createdAt: serverTimestamp(),
            formData: validatedForm.data,
            familyToMove: validatedFamily.data,
        };

        newDocRef = await addDoc(collection(db, 'surat'), docData);
        
    } catch (error) {
        console.error("Gagal menyimpan ke Firestore: ", error);
        return { success: false, message: `Terjadi kesalahan pada server: ${error.message}` };
    }
    
    revalidatePath('/arsip-surat');
    redirect(`/surat/pindah-wni/${newDocRef.id}`);
}
