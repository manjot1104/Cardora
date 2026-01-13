import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Cardora - One Tap. Endless Connections.',
  description:
    'The modern way to share your professional identity using NFC and QR. Digital Business Cards, Wedding Invitations, and NFC Smart Cards with instant payment integration.',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' },
  ],
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} overflow-x-hidden bg-white text-gray-900`}
      >
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
