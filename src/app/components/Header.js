'use client';

import React from 'react';
import Link from 'next/link';

export default function Header() {
    return (
        React.createElement('header', { className: "bg-white shadow-md w-full sticky top-0 z-50" },
            React.createElement('div', { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" },
                React.createElement('div', { className: "relative flex justify-between items-center h-16" },
                    // Elemen kiri (bisa untuk logo atau link lain)
                    React.createElement('div', { className: "flex-shrink-0" },
                       // Placeholder jika butuh elemen di kiri
                    ),

                    // Judul di tengah
                    React.createElement('div', { className: "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" },
                        React.createElement(Link, { href: "/", passHref: true }, 
                            React.createElement('h1', { className: "text-2xl font-bold text-slate-800 cursor-pointer whitespace-nowrap" }, 'Balai Desa Krakitan')
                        )
                    ),

                    // Navigasi di kanan
                    React.createElement('nav', { className: 'flex items-center space-x-4' },
                        // Tautan navigasi bisa ditambahkan di sini
                    )
                )
            )
        )
    );
}
