import React from 'react';
import Link from 'next/link';
import { FileText, Baby, HeartHandshake, ArrowUpRight, Briefcase, Users } from 'lucide-react';
import FaqSection from '../components/FaqSection';

const services = [
    { name: 'Surat Kelahiran', href: '/form-kelahiran', icon: Baby, description: 'Ajukan surat keterangan kelahiran untuk penduduk terdaftar.', color: 'text-blue-500', bgColor: 'bg-blue-50' },
    { name: 'Surat Kematian', href: '/form-kematian', icon: HeartHandshake, description: 'Laporkan peristiwa kematian dan ajukan surat keterangan.', color: 'text-pink-500', bgColor: 'bg-pink-50' },
    { name: 'Surat Pindah', href: '/form-perpindahan-wni', icon: ArrowUpRight, description: 'Urus surat keterangan pindah domisili antar daerah.', color: 'text-green-500', bgColor: 'bg-green-50' },
    { name: 'Surat Umum', href: '/surat-umum', icon: FileText, description: 'Ajukan surat keterangan umum atau keperluan lainnya.', color: 'text-purple-500', bgColor: 'bg-purple-50' },
    { name: 'Surat Sekretaris', href: '/surat-sekretaris', icon: Briefcase, description: 'Layanan administrasi untuk keperluan sekretariat desa.', color: 'text-yellow-500', bgColor: 'bg-yellow-50' },
    { name: 'Surat Warga', href: '/surat-warga', icon: Users, description: 'Pengajuan surat keterangan untuk berbagai keperluan warga.', color: 'text-indigo-500', bgColor: 'bg-indigo-50' },
];

export default function HomePage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50/50">
      
      <header className="mb-20 text-center animate-fade-in-down">
        <h1 className="pb-4 text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-blue-600">
          Sistem Administrasi Digital Krakitan
        </h1>
        <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
          Selamat datang di portal administrasi modern Desa Krakitan. Akses semua layanan yang Anda butuhkan dengan cepat dan transparan.
        </p>
      </header>

      <section className="mb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Link href={service.href} key={service.name}>
              <div 
                className="group relative bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden h-full flex flex-col p-8 animate-fade-in-up" 
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-5">
                    <div className={`p-4 rounded-full inline-block transition-all duration-300 group-hover:scale-110 ${service.bgColor}`}>
                      <service.icon className={`h-8 w-8 ${service.color}`} />
                    </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                <p className="text-gray-500 text-sm flex-grow">{service.description}</p>
                <div className="absolute top-6 right-6 text-gray-300 group-hover:text-blue-500 transition-all duration-300 transform group-hover:rotate-45">
                   <ArrowUpRight className="h-6 w-6"/>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bagian Status Pengajuan Terkini telah dihapus sesuai permintaan */}

      <FaqSection />

    </div>
  );
}
