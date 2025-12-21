import { Navigate, Outlet, createFileRoute } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/useAuthStore'
import Footer from '@/components/Footer'
import Header from '@/components/Header'

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
})

function AuthLayout() {
  const { accessToken, isAuthenticated } = useAuthStore()

  if (!accessToken || !isAuthenticated) {
    return <Navigate to="/" />
  }

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
