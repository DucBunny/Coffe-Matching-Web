import { createFileRoute } from '@tanstack/react-router'
import logo from '/logo.svg'

export const Route = createFileRoute('/_auth/home')({
  component: Home,
})

function Home() {
  return (
    <div className="flex w-full flex-col items-center justify-center text-[calc(10px+2vmin)]">
      <img
        src={logo}
        className="pointer-events-none h-[40vmin] animate-[spin_20s_linear_infinite]"
        alt="logo"
      />
      <p>Welcome to the Home Page!</p>
    </div>
  )
}
