import { createFileRoute } from '@tanstack/react-router'
import FavoritePage from '@/components/FavouritePage'

export const Route = createFileRoute('/_auth/favourite')({
  component: FavoritePage,
})
