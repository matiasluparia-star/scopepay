import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata={title:'ScopePay — Clear scope. Confident invoices.',description:'A private, local-AI workspace to turn freelance briefs into reviewed PayPal sandbox invoice drafts.'};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}</body></html>;}
