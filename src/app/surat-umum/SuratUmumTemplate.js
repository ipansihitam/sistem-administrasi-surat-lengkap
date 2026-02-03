'use client';

import React from 'react';

const SuratUmumTemplate = ({ surat }) => {
    if (!surat) {
        return <div className="p-10 text-center">Data surat tidak tersedia.</div>;
    }

    const {
        nomorSurat,
        tanggalSurat,
        perihal,
        pengirim,
        tujuan,
        isi,
        penandatangan = { nama: 'NURDIN, SE', jabatan: 'Kepala Desa Krakitan' },
        jenisSurat,
    } = surat;

    return (
        <div className="bg-white text-gray-900 font-serif text-sm p-12 A4-size-simulation">
            {/* Kop Surat */}
            <div className="text-center border-b-4 border-black pb-2 mb-8">
                <h1 className="text-xl font-bold uppercase">PEMERINTAH KABUPATEN KLATEN</h1>
                <h2 className="text-lg font-bold uppercase">KECAMATAN KARANGANOM</h2>
                <h2 className="text-2xl font-bold uppercase">KANTOR KEPALA DESA KRAKITAN</h2>
                <p className="text-xs">Alamat: Jl. Raya Karanganom, Klaten 57475 | Telp: (0272) 335221</p>
            </div>

            {/* Detail Surat */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <table className="w-full">
                        <tbody>
                            <tr>
                                <td className="pr-4">Nomor</td>
                                <td>: {nomorSurat || '...........'}</td>
                            </tr>
                            <tr>
                                <td className="pr-4">Lampiran</td>
                                <td>: -</td>
                            </tr>
                            <tr>
                                <td className="pr-4">Perihal</td>
                                <td className="font-bold">: {perihal || '...........'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div>
                    <p>Krakitan, {tanggalSurat || '[Tanggal Surat]'}</p>
                </div>
            </div>

            {/* Alamat Tujuan/Pengirim */}
            <div className="mb-8">
                <p>Kepada Yth.</p>
                <p className="font-bold">{jenisSurat === 'Surat Masuk' ? 'Kepala Desa Krakitan' : (tujuan || '..........')}</p>
                <p>di</p>
                <p>Tempat</p>
                {jenisSurat === 'Surat Masuk' && <p className="mt-4">Dari: <span className="font-bold">{pengirim || '........'}</span></p>}
            </div>


            {/* Isi Surat */}
            <div className="text-justify leading-relaxed">
                <p className="mb-4">Dengan hormat,</p>
                <p className="mb-4 indent-8 whitespace-pre-line">{isi || 'Isi surat ada di sini...'}</p>
                <p className="mt-8 indent-8">Demikian surat ini dibuat untuk dapat dipergunakan sebagaimana mestinya. Atas perhatian dan kerja samanya, kami ucapkan terima kasih.</p>
            </div>


            {/* Tanda Tangan */}
            <div className="flex justify-end mt-16">
                <div className="text-center w-1/2">
                    <p>Hormat kami,</p>
                    <p className="font-bold">{penandatangan.jabatan}</p>
                    <div className="h-24"></div> {/* Spasi untuk TTD */}
                    <p className="font-bold underline uppercase">{penandatangan.nama}</p>
                </div>
            </div>
        </div>
    );
};

export default SuratUmumTemplate;
