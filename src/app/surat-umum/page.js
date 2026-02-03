
import Link from 'next/link';
import { ArrowRight, Inbox, Send, Archive } from 'lucide-react';

const menuOptions = [
  {
    name: 'Buat Surat Masuk',
    href: '/surat-umum/input?type=masuk',
    icon: Inbox,
    description: 'Catat surat yang diterima oleh kantor desa dari pihak eksternal.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  {
    name: 'Buat Surat Keluar',
    href: '/surat-umum/input?type=keluar',
    icon: Send,
    description: 'Buat dan arsipkan surat resmi yang dikeluarkan oleh kantor desa.',
    color: 'text-green-500',
    bgColor: 'bg-green-50',
  },
  {
    name: 'Lihat Arsip',
    href: '/surat-umum/arsip',
    icon: Archive,
    description: 'Lihat, cari, dan kelola semua arsip surat masuk dan keluar.',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
  },
];

export default function SuratUmumMenuPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">
          Administrasi Surat Umum
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Pilih salah satu menu di bawah untuk mengelola surat masuk, surat keluar, atau melihat arsip.
        </p>
      </header>

      <section>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          {menuOptions.map((item, index) => (
            <Link href={item.href} key={item.name}>
              <div 
                className="group relative bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-xl hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1 h-full flex items-center p-6"
              >
                <div className={`p-4 rounded-lg inline-block mr-6 ${item.bgColor}`}>
                  <item.icon className={`h-8 w-8 ${item.color}`} />
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600">{item.name}</h3>
                  <p className="text-gray-500 text-sm mt-1">{item.description}</p>
                </div>
                <div className="absolute top-1/2 right-6 -translate-y-1/2 text-gray-300 group-hover:text-blue-500 transition-transform duration-300 transform group-hover:translate-x-1">
                   <ArrowRight className="h-6 w-6"/>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
