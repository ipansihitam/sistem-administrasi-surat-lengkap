'use client';

import React from 'react';
import Link from 'next/link'; // Menggunakan Link dari Next.js untuk navigasi

const Header = () => {
    return (
        <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-xl font-bold text-slate-800">
                           S A D I K
                        </Link>
                    </div>
                    <div className="flex items-center">
                        {/* Tombol Lihat Surat dengan padding responsif */}
                        <Link href="/arsip-surat" className="bg-blue-600 text-white font-semibold px-3 py-2 sm:px-5 rounded-lg hover:bg-blue-700 transition-colors duration-300">
                           Lihat Surat
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
