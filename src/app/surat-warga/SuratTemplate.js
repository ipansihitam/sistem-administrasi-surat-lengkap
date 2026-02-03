import React, { forwardRef } from 'react';

const SuratTemplate = forwardRef(({ surat }, ref) => {
    const formatDate = (dateString) => {
        if (!dateString) return '........................................';
        const options = { day: '2-digit', month: 'long', year: 'numeric' };
        const date = new Date(dateString);
        if (isNaN(date)) return '........................................';
        return date.toLocaleDateString('id-ID', options);
    };

    const renderNomorSurat = () => {
        return surat.nomorSurat || 'Nomor: ........................................';
    };

    const getTitle = () => {
        switch (surat.jenisSurat) {
            case 'usaha': return 'SURAT KETERANGAN USAHA';
            case 'pengantar': return 'SURAT PENGANTAR';
            case 'tidak_mampu': return 'SURAT KETERANGAN TIDAK MAMPU';
            case 'keterangan':
            default: return 'SURAT KETERANGAN';
        }
    };

    const renderCommonFields = () => (
        <>
            <tr>
                <td className="w-1/3">1. Nama</td>
                <td>: {surat.nama || '........................................'}</td>
            </tr>
            <tr>
                <td className="w-1/3">2. Jenis Kelamin</td>
                <td>: {surat.jenisKelamin || '........................................'}</td>
            </tr>
            <tr>
                <td className="w-1/3">3. Tempat/Tanggal Lahir</td>
                <td>: {surat.ttl || '........................................'}</td>
            </tr>
            <tr>
                <td className="w-1/3">4. Warganegara</td>
                <td>: {surat.kewarganegaraan || '........................................'}</td>
            </tr>
            <tr>
                <td className="w-1/3">5. Agama</td>
                <td>: {surat.agama || '........................................'}</td>
            </tr>
            <tr>
                <td className="w-1/3">6. Pekerjaan</td>
                <td>: {surat.pekerjaan || '........................................'}</td>
            </tr>
            <tr>
                <td className="w-1/3">7. Tempat Tinggal</td>
                <td>: {surat.alamat || '........................................'}</td>
            </tr>
            <tr>
                <td className="w-1/3">8. Surat bukti diri</td>
                <td>: {surat.suratBuktiDiri || '........................................'}</td>
            </tr>
            <tr>
                <td className="w-1/3">9. Keperluan</td>
                <td>: {surat.keperluan || '........................................'}</td>
            </tr>
            <tr>
                <td className="w-1/3">10. Berlaku</td>
                <td>: {formatDate(surat.berlaku)}</td>
            </tr>
            <tr>
                <td className="w-1/3">11. Keterangan lain</td>
                <td>: {surat.keteranganLain || '........................................'}</td>
            </tr>
        </>
    );

    const renderUsahaFields = () => (
        <>
             <tr>
                <td className="w-1/3">1. Nama</td>
                <td>: {surat.nama || '........................................'}</td>
            </tr>
            <tr>
                <td className="w-1/3">2. NIK</td>
                <td>: {surat.nik || '........................................'}</td>
            </tr>
            <tr>
                <td className="w-1/3">3. Tempat/Tanggal Lahir</td>
                <td>: {surat.ttl || '........................................'}</td>
            </tr>
             <tr>
                <td className="w-1/3">4. Jenis Kelamin</td>
                <td>: {surat.jenisKelamin || '........................................'}</td>
            </tr>
            <tr>
                <td className="w-1/3">5. Agama</td>
                <td>: {surat.agama || '........................................'}</td>
            </tr>
            <tr>
                <td className="w-1/3">6. Warganegara</td>
                <td>: {surat.kewarganegaraan || '........................................'}</td>
            </tr>
            <tr>
                <td className="w-1/3">7. Alamat</td>
                <td>: {surat.alamat || '........................................'}</td>
            </tr>
        </>
    );

    return (
        <div ref={ref} className="bg-white p-8 font-serif text-black max-w-4xl mx-auto border-2 border-black">
            <div className="text-center mb-8">
                <div className="flex items-center justify-center">
                    <img src="/logo.png" alt="Logo" className="h-20 mr-4" />
                    <div>
                        <h1 className="text-xl font-bold">PEMERINTAH KABUPATEN KLATEN</h1>
                        <h2 className="text-lg font-bold">KECAMATAN BAYAT</h2>
                        <h3 className="text-2xl font-bold">DESA KRAKITAN</h3>
                        <p className="text-sm">Waduk Jombor, Krakitan, Kec. Bayat, Kabupaten Klaten, Jawa Tengah 57462</p>
                    </div>
                </div>
                <div className="border-t-2 border-black mt-4 pt-2">
                    <p className="text-xs">Kode Desa/Kelurahan : 10042017</p>
                </div>
            </div>

            <div className="text-center mb-8">
                <h4 className="text-lg font-bold underline">{getTitle()}</h4>
                <p>{renderNomorSurat()}</p>
            </div>

            <p className="mb-4">Yang bertanda tangan di bawah ini Kepala Desa Krakitan Kecamatan Bayat Kabupaten Klaten Provinsi Jawa Tengah, menerangkan bahwa :</p>

            <table className="w-full">
                <tbody>
                    {surat.jenisSurat === 'usaha' ? renderUsahaFields() : renderCommonFields()}
                </tbody>
            </table>

            {surat.jenisSurat === 'usaha' && (
                 <p className="mt-4">
                    Berdasarkan surat keterangan dari rukun tetangga nomor tanggal, bahwa yang bersangkutan betul warga desa Krakitan dan menurut pengakuannya yang bersangkutan mempunyai usaha <strong>{surat.namaUsaha || '....................'}</strong> jenis <strong>{surat.jenisUsaha || '....................'}</strong> yang beralamat di <strong>{surat.alamatUsaha || '....................'}</strong>.
                </p>
            )}

            <p className="mt-8">Demikian Surat Keterangan ini dibuat untuk dipergunakan seperlunya.</p>

            <div className="flex justify-between mt-12">
                <div className="text-center">
                    <p>Pemohon</p>
                    <p className="mt-20 font-bold">{surat.nama?.toUpperCase() || '....................'}</p>
                </div>
                <div className="text-center">
                    <p>Krakitan, {formatDate(surat.tanggalSurat)}</p>
                    <p>{surat.jabatanPenandatangan || 'Kepala Desa Krakitan'}</p>
                    <p className="mt-20 font-bold">{surat.namaPenandatangan || 'NURDIN, SE'}</p>
                </div>
            </div>
        </div>
    );
});

SuratTemplate.displayName = 'SuratTemplate';

export default SuratTemplate;
