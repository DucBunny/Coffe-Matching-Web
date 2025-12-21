import { Outlet, createFileRoute } from '@tanstack/react-router'
import Footer from '@/components/Footer'
import Header from '@/components/Header'

export const Route = createFileRoute('/_guest')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
