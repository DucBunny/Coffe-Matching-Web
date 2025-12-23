import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../ui/button'

type SectionCardRenderProps = {
  pageIndex: number
  totalPages: number
  goPrev: () => void
  goNext: () => void
}

const SectionCard: React.FC<{
  title: string
  children:
    | React.ReactNode
    | ((props: SectionCardRenderProps) => React.ReactNode)
  icon?: React.ReactNode
  itemsLength?: number
  itemsPerPage?: number
}> = ({ title, children, icon, itemsLength = 0, itemsPerPage = 1 }) => {
  const [pageIndex, setPageIndex] = useState(0)

  const totalPages = Math.max(1, Math.ceil(itemsLength / itemsPerPage))

  const goPrev = () => setPageIndex((p) => (p - 1 + totalPages) % totalPages)
  const goNext = () => setPageIndex((p) => (p + 1) % totalPages)

  const renderedChildren =
    typeof children === 'function'
      ? children({ pageIndex, totalPages, goPrev, goNext })
      : children

  return (
    <div className="group/row relative mt-8 w-full">
      <div className="absolute -top-4 left-6 z-10 flex items-center gap-2 rounded-full border border-[#F26546]/20 bg-white px-3 py-1 shadow-sm">
        {icon && <span className="text-[#F26546]">{icon}</span>}
        <h2 className="text-sm font-bold tracking-wide text-[#F26546] md:text-base">
          {title}
        </h2>
      </div>

      <div className="w-full rounded-xl border border-[#F26546]/30 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md md:p-8">
        {renderedChildren}

        {totalPages > 1 && (
          <>
            <Button
              onClick={goPrev}
              aria-label="Previous"
              className="absolute top-1/2 -left-5 z-20 hidden size-11 -translate-y-1/2 scale-90 items-center justify-center rounded-full border border-orange-100 bg-white text-slate-600 opacity-0 shadow-xl transition-all group-hover/row:opacity-100 hover:scale-100 hover:bg-[#ff6347] hover:text-white md:flex">
              <ChevronLeft size={20} strokeWidth={3} />
            </Button>

            <Button
              onClick={goNext}
              aria-label="Next"
              className="absolute top-1/2 -right-5 z-20 hidden size-11 -translate-y-1/2 scale-90 items-center justify-center rounded-full border border-orange-100 bg-white text-slate-600 opacity-0 shadow-xl transition-all group-hover/row:opacity-100 hover:scale-100 hover:bg-[#ff6347] hover:text-white md:flex">
              <ChevronRight size={20} strokeWidth={3} />
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

export default SectionCard
