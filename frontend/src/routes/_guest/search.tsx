import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import SearchPage from '@/components/SearchPage'

// Định nghĩa Schema cho Search Params
const searchSchema = z.object({
  keyword: z.string().optional(), // keyword là tùy chọn
})

export const Route = createFileRoute('/_guest/search')({
  // Validate params từ URL
  validateSearch: (search) => searchSchema.parse(search),
  component: Search,
})

function Search() {
  // Lấy keyword từ URL để truyền xuống SearchPage
  const { keyword } = Route.useSearch()

  return <SearchPage initialKeyword={keyword || ''} />
}
