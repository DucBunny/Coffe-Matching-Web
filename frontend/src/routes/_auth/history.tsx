import { createFileRoute } from '@tanstack/react-router'
import HistoryPage from '@/components/HistoryPage'

export const Route = createFileRoute('/_auth/history')({
  component: HistoryPage,
})
