import { createFileRoute } from '@tanstack/react-router'
// import HomePage from '@/components/HomePage'
import HomePage from '@/components/HomePage2'

export const Route = createFileRoute('/_guest/')({
  component: HomePage,
})
