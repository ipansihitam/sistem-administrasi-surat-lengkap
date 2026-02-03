'use client';
import { forwardRef } from 'react';

const FormulirKematianTemplate = forwardRef(({ surat }, ref) => {

    const get = (path, defaultValue = '') => {
        const keys = path.split('.');
        let result = surat;
        for (const key of keys) {
            if (result === null || result === undefined) {
                return defaultValue;
            }
            result = result[key];
        }
        return result === null || result === undefined ? defaultValue : result;
    };

    const s = (value) => value || '';

    const boxStyle = {
        border: '1px solid black',
        padding: '2px 6px 6px 6px',
        width: '100%',
        boxSizing: 'border-box',
    };
    
    const checkboxBoxStyle = {
        border: '1px solid black',
        width: '22px',
        height: '22px',
        textAlign: 'center',
        lineHeight: '14px', 
        marginRight: '5px',
        display: 'inline-block',
        verticalAlign: 'middle',
    };

    const FieldRow = ({ no, label, value }) => (
        <tr>
            <td style={{ width: '3%', verticalAlign: 'middle' }}>{no}</td>
            <td style={{ width: '32%', verticalAlign: 'middle' }}>{label}</td>
            <td style={{ width: '65%', verticalAlign: 'middle' }}>
                <div style={boxStyle}>{s(value) || '\u00A0'}</div>
            </td>
        </tr>
    );

    const CheckboxRow = ({ no, label, options, value }) => (
        <tr>
            <td style={{ verticalAlign: 'middle' }}>{no}</td>
            <td style={{ verticalAlign: 'middle' }}>{label}</td>
            <td style={{ verticalAlign: 'middle' }}>
                {options.map((opt, index) => (
                    <div key={index} style={{ display: 'inline-block', marginRight: '15px', verticalAlign: 'middle' }}>
                        <div style={checkboxBoxStyle}>
                           {s(value) === opt.val ? 'X' : '\u00A0'}
                        </div>
                        <span style={{ verticalAlign: 'middle' }}>{opt.label}</span>
                    </div>
                ))}
            </td>
        </tr>
    );

    const DateRow = ({ no, label, prefix, showUmur = false, umurVal = '' }) => (
        <tr>
            <td style={{ verticalAlign: 'middle' }}>{no}</td>
            <td style={{ verticalAlign: 'middle' }}>{label}</td>
            <td style={{ verticalAlign: 'middle' }}>
                 <table style={{ width: '100%', borderCollapse: 'collapse' }}><tbody><tr>
                    <td style={{width: '10%', verticalAlign: 'middle'}}>Tgl:</td>
                    <td style={{width: '15%'}}><div style={boxStyle}>{s(get(`formData.${prefix}_tgl`)) || '\u00A0'}</div></td>
                    <td style={{width: '10%', verticalAlign: 'middle', paddingLeft: '5px'}}>Bln:</td>
                    <td style={{width: '15%'}}><div style={boxStyle}>{s(get(`formData.${prefix}_bln`)) || '\u00A0'}</div></td>
                    <td style={{width: '10%', verticalAlign: 'middle', paddingLeft: '5px'}}>Thn:</td>
                    <td style={{width: '20%'}}><div style={boxStyle}>{s(get(`formData.${prefix}_thn`)) || '\u00A0'}</div></td>
                    {showUmur && <>
                        <td style={{width: '10%', verticalAlign: 'middle', paddingLeft: '5px'}}>Umur:</td>
                        <td style={{width: '10%'}}><div style={boxStyle}>{s(umurVal) || '\u00A0'}</div></td>
                    </>}
                </tr></tbody></table>
            </td>
        </tr>
    );

    const AddressRow = ({ no, label, prefix }) => (
         <tr>
            <td style={{ verticalAlign: 'top', paddingTop:'2px' }}>{no}</td>
            <td style={{ verticalAlign: 'top', paddingTop:'2px' }}>{label}</td>
            <td>
                <div style={{...boxStyle, marginBottom: '2px' }}>{s(get(`formData.${prefix}_alamat`)) || '\u00A0'}</div>
                <table style={{width: '100%', borderCollapse:'collapse'}}><tbody>
                    <tr>
                        <td style={{verticalAlign: 'middle'}}>a. Desa/Kelurahan</td>
                        <td style={{width: '160px'}}><div style={boxStyle}>{s(get(`formData.${prefix}_desa`)) || '\u00A0'}</div></td>
                        <td style={{paddingLeft: '10px', verticalAlign: 'middle'}}>c. Kab/Kota</td>
                        <td style={{width: '160px'}}><div style={boxStyle}>{s(get(`formData.${prefix}_kabupaten`) || get(`formData.${prefix}_kabkota`)) || '\u00A0'}</div></td>
                    </tr>
                    <tr>
                        <td style={{verticalAlign: 'middle'}}>b. Kecamatan</td>
                        <td style={{width: '160px'}}><div style={boxStyle}>{s(get(`formData.${prefix}_kecamatan`)) || '\u00A0'}</div></td>
                         <td style={{paddingLeft: '10px', verticalAlign: 'middle'}}>d. Provinsi</td>
                        <td style={{width: '160px'}}><div style={boxStyle}>{s(get(`formData.${prefix}_provinsi`)) || '\u00A0'}</div></td>
                    </tr>
                </tbody></table>
            </td>
        </tr>
    );
    
    const Section = ({ title, children }) => (
        <div style={{ marginTop: '8px'}}>
            <div style={{ backgroundColor: '#E0E0E0', padding: '3px 8px', fontWeight: 'bold' }}>{title}</div>
            <table style={{ width: '100%', fontSize: '10pt', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                <tbody>{children}</tbody>
            </table>
        </div>
    );

    const jkOptions = [{val: '1', label: '1. Laki-Laki'}, {val: '2', label: '2. Perempuan'}];
    const sebabKematianOptions = [{val: '1', label: '1. Sakit biasa / tua'}, {val: '2', label: '2. Wabah Penyakit'}, {val: '3', label: '3. Kecelakaan'}];
    const yangMenerangkanOptions = [{val: '1', label: '1. Dokter'}, {val: '2', label: '2. Tenaga Kesehatan'}, {val: '3', label: '3. Kepolisian'}, {val: '4', label:'4. Lainnya'}];
    const kewarganegaraanOptions = [{val: '1', label: '1. WNI'}, {val: '2', label: '2. WNA'}];

    return (
        <div ref={ref} style={{ fontFamily: 'Arial, sans-serif', fontSize: '10pt', color: '#000', padding: '20px', backgroundColor:'white', width: '210mm' }}>
            <table style={{width: '100%'}}><tbody>
                <tr>
                    <td style={{width: '40%'}}>Pemerintah Desa/Kelurahan : KRAKITAN</td>
                    <td style={{textAlign:'right'}}>Kecamatan : BAYAT</td>
                </tr>
                 <tr>
                    <td>Kabupaten/Kota : KLATEN</td>
                    <td style={{textAlign:'right'}}>Kode Wilayah : 3310042010</td>
                </tr>
            </tbody></table>

            <h3 style={{ textAlign: 'center', fontWeight: 'bold', textDecoration: 'underline', margin: '15px 0'}}>FORMULIR SURAT KETERANGAN KEMATIAN</h3>
            <p style={{textAlign:'center', margin: '0 0 10px 0'}}>Nomor: {s(get('nomorSurat'))}</p>

            <Section title="DATA KEPALA KELUARGA">
                <FieldRow no="1." label="Nama Kepala Keluarga" value={s(get('formData.kk_nama'))} />
                <FieldRow no="2." label="Nomor Kartu Keluarga" value={s(get('formData.kk_no'))} />
            </Section>

            <Section title="JENAZAH">
                <FieldRow no="1." label="NIK" value={s(get('formData.jenazah_nik'))} />
                <FieldRow no="2." label="Nama Lengkap" value={s(get('formData.jenazah_nama'))} />
                <CheckboxRow no="3." label="Jenis Kelamin" options={jkOptions} value={s(get('formData.jenazah_jk'))} />
                <DateRow no="4." label="Tanggal Lahir" prefix="jenazah_tgllahir" showUmur={true} umurVal={s(get('formData.jenazah_umur'))} />
                <FieldRow no="5." label="Tempat Lahir" value={s(get('formData.jenazah_tempat_lahir'))} />
                <FieldRow no="6." label="Agama" value={s(get('formData.jenazah_agama'))} />
                <FieldRow no="7." label="Pekerjaan" value={s(get('formData.jenazah_pekerjaan'))} />
                <AddressRow no="8." label="Alamat" prefix="jenazah_alamat" />
                <FieldRow no="9." label="Anak Ke" value={s(get('formData.jenazah_anak_ke'))} />
                <DateRow no="10." label="Tanggal Kematian" prefix="jenazah_tglkematian" />
                <FieldRow no="11." label="Pukul" value={s(get('formData.jenazah_pukul'))} />
                <CheckboxRow no="12." label="Sebab Kematian" options={sebabKematianOptions} value={s(get('formData.jenazah_sebab_kematian'))} />
                <FieldRow no="13." label="Tempat Kematian" value={s(get('formData.jenazah_tempat_kematian'))} />
                <CheckboxRow no="14." label="Yang Menerangkan" options={yangMenerangkanOptions} value={s(get('formData.jenazah_yang_menerangkan'))} />
            </Section>

            <Section title="AYAH">
                <FieldRow no="1." label="NIK" value={s(get('formData.ayah_nik'))} />
                <FieldRow no="2." label="Nama" value={s(get('formData.ayah_nama'))} />
            </Section>

            <Section title="IBU">
                <FieldRow no="1." label="NIK" value={s(get('formData.ibu_nik'))} />
                <FieldRow no="2." label="Nama" value={s(get('formData.ibu_nama'))} />
            </Section>

            <Section title="PELAPOR">
                <FieldRow no="1." label="NIK" value={s(get('formData.pelapor_nik'))} />
                <FieldRow no="2." label="Nama" value={s(get('formData.pelapor_nama'))} />
            </Section>
            
            <Section title="SAKSI I">
                <FieldRow no="1." label="NIK" value={s(get('formData.saksi1_nik'))} />
                <FieldRow no="2." label="Nama" value={s(get('formData.saksi1_nama'))} />
            </Section>
            
            <Section title="SAKSI II">
                <FieldRow no="1." label="NIK" value={s(get('formData.saksi2_nik'))} />
                <FieldRow no="2." label="Nama" value={s(get('formData.saksi2_nama'))} />
            </Section>
            
            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between', fontSize:'11pt' }}>
                <div style={{ textAlign: 'center', width: '45%' }}>
                    <p style={{ margin: 0 }}>Mengetahui,</p>
                    <p style={{ margin: 0, fontWeight:'bold' }}>{s(get('penandatangan.jabatan'))}</p>
                    <div style={{ height: '70px' }}></div>
                    <p style={{ margin: 0, fontWeight: 'bold', textDecoration: 'underline' }}>( {s(get('penandatangan.nama', '')).toUpperCase()} )</p>
                </div>
                <div style={{ textAlign: 'center', width: '45%' }}>
                    <p style={{ margin: 0 }}>Krakitan, {s(get('tanggalSurat'))}</p>
                    <p style={{ margin: 0, fontWeight:'bold' }}>Pelapor</p>
                    <div style={{ height: '70px' }}></div>
                    <p style={{ margin: 0, fontWeight: 'bold', textDecoration: 'underline' }}>( {s(get('formData.pelapor_nama', '')).toUpperCase()} )</p>
                </div>
            </div>
        </div>
    );
});

FormulirKematianTemplate.displayName = 'FormulirKematianTemplate';
export default FormulirKematianTemplate;
