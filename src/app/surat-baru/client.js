
'use client';

import { useState } from 'react';
import { addSurat } from './actions';

export default function SuratBaruClient() {
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (formData) => {
    const newErrors = {};
    if (!formData.get('jenisSurat')) {
      newErrors.jenisSurat = 'Harap pilih jenis surat.';
    }
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    const response = await addSurat(formData);
    setMessage(response.message);
    if (response.success) {
      event.target.reset();
    }
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Input Surat Warga</h1>
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-6">
          <label htmlFor="jenisSurat" className="block text-gray-700 font-bold mb-2">Jenis Surat</label>
          <select
            id="jenisSurat"
            name="jenisSurat"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            defaultValue=""
          >
            <option value="" disabled>Pilih Jenis Surat...</option>
            <option value="Surat Keterangan Usaha">Surat Keterangan Usaha</option>
            <option value="Surat Keterangan">Surat Keterangan</option>
            <option value="Surat Keterangan Tidak Mampu">Surat Keterangan Tidak Mampu</option>
            <option value="Surat Pengantar">Surat Pengantar</option>
          </select>
          {errors.jenisSurat && <p className="text-red-600 text-sm mt-1">{errors.jenisSurat}</p>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 disabled:bg-gray-400"
        >
          {isSubmitting ? 'Menyimpan...' : 'Simpan'}
        </button>
      </form>
      {message && (
        <p className={`mt-4 text-center font-semibold ${message.includes('Gagal') ? 'text-red-500' : 'text-green-500'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
