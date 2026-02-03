import { db } from '../../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// Komponen untuk menampilkan satu field data dengan gaya tema terang
function DetailField({ label, value }) {
    if (value === null || value === undefined || value === '') return null;
    return (
        <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium text-slate-500">{label}</dt>
            <dd className="mt-1 text-sm text-slate-900 sm:mt-0 sm:col-span-2">{value}</dd>
        </div>
    );
}

// Fungsi untuk mengambil data surat (server-side)
async function getSuratDetail(id) {
    const docRef = doc(db, 'surat', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        return null;
    }

    const data = docSnap.data();
    
    // Fungsi helper untuk format tanggal dengan aman
    const formatDate = (timestamp) => {
        if (!timestamp) return null;
        if (timestamp.toDate) { // Firebase Timestamp
            return timestamp.toDate().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        }
        return new Date(timestamp).toLocaleDateString('id-ID'); // String tanggal biasa
    }

    return {
        id: docSnap.id,
        ...data,
        createdAt: formatDate(data.createdAt),
        tanggalLahir: formatDate(data.tanggalLahir),
        tanggalKematian: formatDate(data.tanggalKematian),
        tanggalPindah: formatDate(data.tanggalPindah),
    };
}

// Halaman Detail Surat (React Server Component)
export default async function SuratDetailPage({ params }) {
    const surat = await getSuratDetail(params.id);

    if (!surat) {
        return (
            <div className="text-center">
                <h1 className="text-2xl font-bold text-slate-800">Dokumen Tidak Ditemukan</h1>
                <Link href="/">
                    <span className="text-blue-600 hover:underline mt-4 inline-block">Kembali ke Beranda</span>
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
            <div className="border-b border-slate-200 pb-4 mb-6">
                <h1 className="text-3xl font-bold text-slate-900">Detail Pengajuan Surat</h1>
                <p className="mt-1 text-slate-500">Jenis Surat: <span className="font-semibold text-slate-700">{surat.jenisSurat || 'Data Lama'}</span></p>
            </div>

            <dl className="divide-y divide-slate-200">
                <DetailField label="Nama Lengkap" value={surat.nama} />
                <DetailField label="NIK" value={surat.nik} />
                <DetailField label="Nomor KK" value={surat.noKk} />
                <DetailField label="Tanggal Pengajuan" value={surat.createdAt} />
                
                {/* Menampilkan field berdasarkan jenis surat */}
                {surat.jenisSurat === 'Kelahiran' && (
                    <>
                        <DetailField label="Tempat Lahir" value={surat.tempatLahir} />
                        <DetailField label="Tanggal Lahir" value={surat.tanggalLahir} />
                        <DetailField label="Nama Ayah" value={surat.namaAyah} />
                        <DetailField label="Nama Ibu" value={surat.namaIbu} />
                    </>
                )}

                {surat.jenisSurat === 'Kematian' && (
                    <>
                        <DetailField label="Tanggal Lahir" value={surat.tanggalLahir} />
                        <DetailField label="Tanggal Kematian" value={surat.tanggalKematian} />
                        <DetailField label="Penyebab Kematian" value={surat.penyebabKematian} />
                        <DetailField label="Nama Pelapor" value={surat.namaPelapor} />
                        <DetailField label="NIK Pelapor" value={surat.nikPelapor} />
                    </>
                )}
                
                 {surat.jenisSurat === 'Pindah' && (
                    <>
                        <DetailField label="Alamat Tujuan" value={surat.alamatTujuan} />
                        <DetailField label="Tanggal Pindah" value={surat.tanggalPindah} />
                    </>
                )}

                <DetailField label="Keterangan Lain" value={surat.keterangan} />
            </dl>

            <div className="mt-8 text-left">
                 <Link href="/">
                    <button className="inline-flex items-center bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                       <ArrowLeft className="h-4 w-4 mr-2" />
                        Kembali ke Beranda
                    </button>
                </Link>
            </div>
        </div>
    );
}
