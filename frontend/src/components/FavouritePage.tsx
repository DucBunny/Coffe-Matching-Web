import { useState } from 'react'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import CafeCard from './cafe/CafeCard'
import PaginationButton from './pagination/PaginationButtonProps'
import type { Cafe } from '@/types/cafe'
import cafeDataRaw from '@/data/cafes.json'

export default function FavoritePage() {
  const CAFES_DATA: Array<Cafe> = cafeDataRaw as Array<Cafe>
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 10
  const totalItems = cafeDataRaw.length
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1

  const [userLocation, setUserLocation] = useState<{
    lat: number
    lng: number
  } | null>(null)

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((curr) => curr - 1)
  }

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((curr) => curr + 1)
  }

  const handlePageClick = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F9F9F9] font-sans">
      <div className="relative flex w-full flex-col gap-8 p-4 md:flex-row md:px-8 md:py-8">
        <main className="flex-1">
          <div className="mb-8 flex justify-center">
            <div className="relative rounded bg-[#FF6347] px-12 py-3 text-center text-xl font-bold text-white shadow-sm">
              お気に入りのカフェ
            </div>
          </div>

          {cafeDataRaw.length > 0 ? (
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
              {cafeDataRaw.map((item) => (
                <CafeCard
                  key={item.id}
                  data={item}
                  userLocation={userLocation}
                  showDistance={true}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white py-20 text-gray-500">
              <Search size={48} className="mb-4 text-gray-300" />
              <p className="text-lg font-bold">
                適切なカフェが見つかりませんでした。
              </p>
              <p className="text-sm">
                フィルターやキーワードを変更してお試しください。
              </p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-8 mb-8 flex items-center justify-center gap-2 select-none">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="cursor-pointer rounded-md border border-gray-200 p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50">
                <ChevronLeft size={18} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationButton
                    key={page}
                    active={currentPage === page}
                    onClick={() => handlePageClick(page)}>
                    {page}
                  </PaginationButton>
                ),
              )}

              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="cursor-pointer rounded-md border border-gray-200 p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50">
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
