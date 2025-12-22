import { createFileRoute } from '@tanstack/react-router'
import DetailPage from '@/components/DetailPage'

export const Route = createFileRoute('/_guest/detail/$id')({
  component: DetailPageWrapper,
})

function DetailPageWrapper() {
  const { id } = Route.useParams()
  return <DetailPage shopId={id} />
}
