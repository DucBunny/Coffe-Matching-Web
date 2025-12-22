import { Star } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import type { HistoryEntry } from '@/types/history'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'

export default function HistoryItem({
  item,
  isSelected,
  onToggle,
}: {
  item: HistoryEntry
  isSelected: boolean
  onToggle: (id: string) => void
}) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate({
      to: '/detail/$id',
      params: { id: String(item.shopId ?? item.cafe.id) },
    })
  }

  return (
    <div
      className={`flex h-32 items-stretch overflow-hidden rounded-3xl border bg-white shadow-sm transition-all duration-300 ${
        isSelected
          ? 'border-orange-400 shadow-xl ring-4 ring-orange-500/5'
          : 'border-[#F9F9FB] hover:border-orange-100 hover:shadow-lg'
      }`}>
      <div className="flex w-24 shrink-0 items-center justify-center gap-3 border-r border-gray-100 bg-gray-50/50 px-2 sm:w-32 md:px-4">
        <Checkbox
          checked={isSelected}
          onClick={(e) => {
            e.stopPropagation()
            onToggle(item.id)
          }}
          className="size-6 border-orange-300 data-[state=checked]:border-[#ff6347] data-[state=checked]:bg-[#ff6347]"
        />

        <span className="font-mono text-xs font-black md:text-base">
          {item.time}
        </span>
      </div>

      <div onClick={handleClick} className="flex flex-1 cursor-pointer">
        <div className="m-2 w-24 shrink-0 overflow-hidden rounded-[18px] sm:w-40 md:m-3">
          <img
            src={(item.cafe.images && item.cafe.images[0]) || ''}
            alt={item.cafe.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center p-3 pl-2 md:p-5">
          <div className="mb-2 flex items-start justify-between gap-2">
            <h3 className="truncate text-sm font-black md:text-lg">
              {item.cafe.name}
            </h3>
            <Badge className="bg-[#ff6347]">
              {item.cafe.rating}
              <Star size={12} className="text-white" fill="white" />
            </Badge>
          </div>

          <div className="mt-auto space-y-1 text-xs font-medium">
            <div>
              {item.cafe.hours
                ? `${item.cafe.hours.open ?? ''} - ${item.cafe.hours.close ?? ''}`
                : ''}
            </div>
            <span className="truncate">{item.cafe.address}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
