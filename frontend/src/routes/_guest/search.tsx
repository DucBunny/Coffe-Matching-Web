import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import SearchPage from '@/components/SearchPage'

const searchSchema = z.object({
  keyword: z.string().optional(),
})

export const Route = createFileRoute('/_guest/search')({
  validateSearch: (search) => searchSchema.parse(search),
  component: Search,
})

function Search() {
  const { keyword } = Route.useSearch()

  return <SearchPage initialKeyword={keyword || ''} />
}
