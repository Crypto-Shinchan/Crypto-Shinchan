import HeaderBasic from './HeaderBasic'
import Footer from './Footer'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderBasic />
      <main className="flex-grow container mx-auto p-4 bg-black/30 backdrop-blur-sm rounded-lg">{children}</main>
      <Footer />
    </div>
  )
}