// src/app/layout.js

import React from 'react'; // PERBAIKAN: Menambahkan kembali impor React yang hilang.
import { Inter } from "next/font/google";
import "./globals.css";
import Header from '../components/Header';
import Footer from '../components/Footer';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children, searchParams }) {

  const serverKey = process.env.DEV_KEY;
  const urlKey = searchParams?.dev_key;
  const showFooter = urlKey !== serverKey;
  const mainClassName = 'container mx-auto p-4 sm:p-6 lg:p-8';

  return (
    React.createElement('html', { lang: 'en' },
      React.createElement('body', { className: `${inter.className} bg-slate-50` },
        React.createElement(Header, null),
        React.createElement('main', { className: mainClassName }, children),
        showFooter && React.createElement(Footer, null)
      )
    )
  );
}
