'use server';

import { revalidatePath } from 'next/cache';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { z } from 'zod';

// --- PERBAIKAN FINAL: Skema validasi yang lebih kuat dan spesifik ---
const suratUmumSchema = z.object({
    jenisSurat: z.enum(['Surat Masuk', 'Surat Keluar']),
    nomorSurat: z.string().min(1, { message: 'Nomor surat wajib diisi.' }),
    tanggalSurat: z.coerce.date({
        required_error: "Tanggal surat wajib diisi.",
        invalid_type_error: "Format tanggal tidak valid.",
    }),
    pengirim: z.string().optional(),
    tujuan: z.string().optional(),
    perihal: z.string().min(1, { message: 'Perihal wajib diisi.' })
}).refine(data => {
    if (data.jenisSurat === 'Surat Masuk') return !!data.pengirim && data.pengirim.length > 0;
    return true;
}, {
    message: "Pengirim wajib diisi untuk surat masuk.",
    path: ["pengirim"],
}).refine(data => {
    if (data.jenisSurat === 'Surat Keluar') return !!data.tujuan && data.tujuan.length > 0;
    return true;
}, {
    message: "Tujuan wajib diisi untuk surat keluar.",
    path: ["tujuan"],
});

export async function createSuratUmum(prevState, formData) {
    const dataToValidate = {
        jenisSurat: formData.get('jenisSurat'),
        nomorSurat: formData.get('nomorSurat'),
        tanggalSurat: formData.get('tanggalSurat'),
        pengirim: formData.get('pengirim'),
        tujuan: formData.get('tujuan'),
        perihal: formData.get('perihal'),
    };
    
    const validatedFields = suratUmumSchema.safeParse(dataToValidate);

    if (!validatedFields.success) {
        // Memberikan pesan error yang jauh lebih jelas dan multi-baris
        const errorMessages = validatedFields.error.errors.map(e => e.message).join('\n');
        return {
            success: false,
            message: `Validasi gagal:\n${errorMessages}`,
        };
    }

    try {
        const docData = { ...validatedFields.data, createdAt: serverTimestamp() };
        if (docData.jenisSurat === 'Surat Masuk') delete docData.tujuan;
        else delete docData.pengirim;

        await addDoc(collection(db, 'surat'), docData);
        revalidatePath('/surat-umum/arsip');
        return { success: true, message: `Berhasil mencatat ${docData.jenisSurat}!` };
    } catch (error) {
        console.error("Error adding document: ", error);
        return { success: false, message: 'Gagal menyimpan surat ke database.' };
    }
}
