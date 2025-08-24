import './globals.css';
import AuroraBackground from '@/components/AuroraBackground';
import Analytics from './_components/Analytics'; // インポートを追加

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="relative min-h-dvh text-white">
        <AuroraBackground />             {/* 背景 z-[1] */}
        <main className="relative z-[2]">{children}</main>  {/* コンテンツ前面 */}
        <Analytics /> {/* コンポーネントを追加 */}
      </body>
    </html>
  );
}