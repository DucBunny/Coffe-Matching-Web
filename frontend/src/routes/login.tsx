import { createFileRoute } from '@tanstack/react-router'
import { LoginForm } from '@/components/LoginForm'

export const Route = createFileRoute('/login')({
  component: Login,
})

function Login() {
  return (
    <div className="min-h-screen bg-[#FF6347] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl">
        <LoginForm />
      </div>
    </div>
  )
}
