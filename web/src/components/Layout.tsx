import HeaderBasic from './HeaderBasic'
import Footer from './Footer'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderBasic />
      <main className="flex-grow container mx-auto p-4 rounded-lg border border-gray-200/60 bg-white/60 text-gray-900 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-black/30 dark:text-gray-100">
        {children}
      </main>
      <Footer />
    </div>
  )
}
