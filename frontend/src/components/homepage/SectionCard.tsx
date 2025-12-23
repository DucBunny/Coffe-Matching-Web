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
  description?: string
  children:
    | React.ReactNode
    | ((props: SectionCardRenderProps) => React.ReactNode)
  itemsLength?: number
  itemsPerPage?: number
}> = ({ title, description, children, itemsLength = 0, itemsPerPage = 1 }) => {
  const [pageIndex, setPageIndex] = useState(0)

  const totalPages = Math.max(1, Math.ceil(itemsLength / itemsPerPage))

  const goPrev = () => setPageIndex((p) => (p - 1 + totalPages) % totalPages)
  const goNext = () => setPageIndex((p) => (p + 1) % totalPages)

  const renderedChildren =
    typeof children === 'function'
      ? children({ pageIndex, totalPages, goPrev, goNext })
      : children

  return (
    <div className="group/row relative rounded-[40px] border-2 border-orange-500/20 bg-white p-6 shadow-sm shadow-orange-100/50 transition-all hover:border-orange-500/40 lg:p-10 lg:pt-6">
      <div className="mb-4 flex flex-col">
        <h3 className="text-2xl font-bold text-orange-500">{title}</h3>
        <p className="mt-1 text-[12px] font-medium tracking-wider text-slate-400">
          {description}
        </p>
      </div>

      {renderedChildren}

      {totalPages > 1 && (
        <>
          <Button
            onClick={goPrev}
            aria-label="Previous"
            hidden={pageIndex === 0}
            className="absolute top-1/2 left-5 z-20 hidden size-14 scale-90 items-center justify-center rounded-full border border-orange-100 bg-white text-slate-600 opacity-0 shadow-xl transition-all group-hover/row:opacity-100 hover:scale-100 hover:bg-[#ff6347] hover:text-white md:flex">
            <ChevronLeft size={20} strokeWidth={4} />
          </Button>

          <Button
            onClick={goNext}
            aria-label="Next"
            hidden={pageIndex === totalPages - 1}
            className="absolute top-1/2 right-5 z-20 hidden size-14 scale-90 items-center justify-center rounded-full border border-orange-100 bg-white text-slate-600 opacity-0 shadow-xl transition-all group-hover/row:opacity-100 hover:scale-100 hover:bg-[#ff6347] hover:text-white md:flex">
            <ChevronRight size={20} strokeWidth={4} />
          </Button>
        </>
      )}
    </div>
  )
}

export default SectionCard
