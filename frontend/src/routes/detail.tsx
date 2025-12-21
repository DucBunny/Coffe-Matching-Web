import { createFileRoute } from '@tanstack/react-router'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import DetailPage from '@/components/DetailPage'

export const Route = createFileRoute('/detail')({
  component: Detail,
})

function Detail() {
  const search: any = Route.useSearch()
  return (
    <div className="text-center">
      <Header />
      <DetailPage shopId={search.id} />
      <Footer />
    </div>
  )
}
