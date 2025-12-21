import { createFileRoute } from '@tanstack/react-router'
import logo from '/logo.svg'

export const Route = createFileRoute('/_guest/')({
  component: App,
})

function App() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-[#282c34] text-[calc(10px+2vmin)] text-white">
      <img
        src={logo}
        className="pointer-events-none h-[40vmin] animate-[spin_20s_linear_infinite]"
        alt="logo"
      />
      <p>Welcome to the Index Page!</p>
    </main>
  )
}
