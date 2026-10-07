import './globals.css';

export const metadata = {
  title: 'GenshinMarketGlobal',
  description: 'Jual beli akun Genshin Impact, Free Fire, Mobile Legends',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
