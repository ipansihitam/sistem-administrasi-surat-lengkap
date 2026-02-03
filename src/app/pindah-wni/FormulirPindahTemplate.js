'use client';

import React from 'react';

// Helper to safely get nested properties from formData
const getFd = (formData, key, defaultValue = '-') => {
    return formData?.[key] || defaultValue;
}

// Helper untuk memformat alamat secara konsisten
const formatAddress = (data, prefix) => {
    const parts = [
        getFd(data, `alamat_${prefix}_dusun`),
        `RT ${getFd(data, `alamat_${prefix}_rt`)} / RW ${getFd(data, `alamat_${prefix}_rw`)}`,
        getFd(data, `alamat_${prefix}_desa`),
        getFd(data, `alamat_${prefix}_kecamatan`),
        getFd(data, `alamat_${prefix}_kab`),
        getFd(data, `alamat_${prefix}_prov`)
    ];
    // Filter out parts that are empty, '-', or contain 'undefined'
    return parts.filter(part => part && part !== '-' && !part.includes('undefined')).join(', ');
};

const DetailRow = ({ label, value }) => (
    <tr>
        <td className="align-top" style={{ width: '35%', paddingLeft: '20px' }}>{label}</td>
        <td className="align-top">: {value || '-'}</td>
    </tr>
);

const FormulirPindahTemplate = ({ surat }) => {
    if (!surat || !surat.formData) {
        return <div className="p-10 text-center">Data surat tidak lengkap atau tidak ditemukan.</div>;
    }

    const { formData, familyToMove, penandatangan, tanggalSurat, nomorSurat } = surat;

    const alamatAsal = formatAddress(formData, 'asal');
    const alamatTujuan = formatAddress(formData, 'tujuan');
    const keluargaPindah = Array.isArray(familyToMove) ? familyToMove : [];

    return (
        <div className="bg-white text-gray-900 font-serif text-sm p-12 A4" style={{ width: '210mm', minHeight: '297mm' }}>
            {/* Kop Surat */}
            <div className="text-center mb-8">
                <h1 className="text-lg font-bold uppercase">PEMERINTAH KABUPATEN KLATEN</h1>
                <h2 className="text-lg font-bold uppercase">KECAMATAN KARANGANOM</h2>
                <h2 className="text-2xl font-bold uppercase">DESA KRAKITAN</h2>
                <p className="text-xs">Jln. Raya Karanganom, Klaten 57475</p>
            </div>

            <div className="border-t-2 border-black mb-1"></div>
            <div className="border-t-4 border-black mb-8"></div>

            {/* Judul Surat */}
            <div className="text-center my-8">
                <h3 className="text-lg font-bold underline uppercase">SURAT KETERANGAN PINDAH WNI</h3>
                <p>Nomor: {nomorSurat || '475 / ... / ...'}</p>
            </div>

            {/* Isi Surat */}
            <div className="text-justify leading-relaxed mt-10">
                <p className="mb-6">Yang bertanda tangan di bawah ini, Kepala Desa Krakitan, Kecamatan Karanganom, Kabupaten Klaten, menerangkan permohonan pindah penduduk WNI dengan data sebagai berikut:</p>

                <h4 className="font-bold mt-6 mb-3">I. DATA DAERAH ASAL</h4>
                <table className="w-full" style={{ borderSpacing: '0 4px', borderCollapse: 'separate' }}>
                    <tbody>
                        <DetailRow label="1. Nomor Kartu Keluarga" value={getFd(formData, 'kk_no_asal')} />
                        <DetailRow label="2. Nama Kepala Keluarga" value={getFd(formData, 'kk_nama_asal')} />
                        <DetailRow label="3. Alamat" value={alamatAsal} />
                        <DetailRow label="4. NIK Pemohon" value={getFd(formData, 'pemohon_nik')} />
                        <DetailRow label="5. Nama Lengkap" value={getFd(formData, 'pemohon_nama')} />
                    </tbody>
                </table>

                <h4 className="font-bold mt-6 mb-3">II. DATA KEPINDAHAN</h4>
                 <table className="w-full" style={{ borderSpacing: '0 4px', borderCollapse: 'separate' }}>
                    <tbody>
                        <DetailRow label="1. Alasan Pindah" value={getFd(formData, 'alasan_pindah')} />
                        <DetailRow label="2. Alamat Tujuan" value={alamatTujuan} />
                        <DetailRow label="3. Jenis Kepindahan" value={getFd(formData, 'jenis_kepindahan')} />
                        <DetailRow label="4. Status KK Bagi yang Tidak Pindah" value={getFd(formData, 'status_kk_tidak_pindah')} />
                        <DetailRow label="5. Status KK Bagi yang Pindah" value={getFd(formData, 'status_kk_pindah')} />
                    </tbody>
                </table>

                <h4 className="font-bold mt-6 mb-3">III. KELUARGA YANG PINDAH</h4>
                <table className="w-full text-left text-xs border-collapse border border-gray-400 my-4">
                    <thead className="bg-gray-100 text-center font-semibold">
                        <tr>
                            <th className="border border-gray-300 p-2">NO</th>
                            <th className="border border-gray-300 p-2">NIK</th>
                            <th className="border border-gray-300 p-2">NAMA</th>
                            <th className="border border-gray-300 p-2">MASA BERLAKU KTP S/D</th>
                            <th className="border border-gray-300 p-2">SHDK</th>
                        </tr>
                    </thead>
                    <tbody>
                        {keluargaPindah.length > 0 ? (
                            keluargaPindah.map((p, index) => (
                                <tr key={index}>
                                    <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
                                    <td className="border border-gray-300 p-2">{p.nik || '-'}</td>
                                    <td className="border border-gray-300 p-2">{p.nama || '-'}</td>
                                    <td className="border border-gray-300 p-2 text-center">{p.ktp_berlaku || '-'}</td>
                                    <td className="border border-gray-300 p-2 text-center">{p.shdk || '-'}</td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" className="p-4 text-center border border-gray-300">Tidak ada anggota keluarga yang pindah.</td></tr>
                        )}
                    </tbody>
                </table>
                
                <p className="mt-10">Demikian Surat Keterangan Pindah ini dibuat untuk dapat dipergunakan sebagaimana mestinya.</p>
            </div>

            {/* Tanda Tangan */}
            <div className="flex justify-end mt-16">
                 <div className="text-center" style={{width: '300px'}}>
                    <p>Krakitan, {tanggalSurat || '[Tanggal Surat]'}</p>
                    <p className="font-bold">{(penandatangan && penandatangan.jabatan) || 'Kepala Desa Krakitan'}</p>
                    <div style={{height: '80px'}}></div>
                    <p className="font-bold underline uppercase">{(penandatangan && penandatangan.nama) || '( NAMA KEPALA DESA )'}</p>
                </div>
            </div>
        </div>
    );
};

export default FormulirPindahTemplate;
