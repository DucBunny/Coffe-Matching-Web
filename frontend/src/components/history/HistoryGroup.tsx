import HistoryItem from './HistoryItem'
import type { HistoryEntry, HistoryGroup } from '@/types/history'
import { Checkbox } from '@/components/ui/checkbox'

export default function HistoryGroup({
  group,
  selectedIds,
  onToggle,
  onToggleGroup,
}: {
  group: HistoryGroup
  selectedIds: Set<string>
  onToggle: (id: string) => void
  onToggleGroup: (items: Array<HistoryEntry>) => void
}) {
  const groupIds = group.items.map((i) => i.id)
  const isGroupSelected = groupIds.every((id) => selectedIds.has(id))

  return (
    <section key={group.date} className="relative mb-12">
      <div className="sticky top-20 z-20 mb-4 flex items-center justify-between bg-transparent">
        <h2 className="border-b-4 border-[#ff6347] pb-1 text-xl font-black backdrop-blur-md md:text-2xl">
          {group.date}
        </h2>

        <div
          className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-extrabold ${isGroupSelected ? 'bg-[#ff6347] text-white' : 'border border-orange-200 bg-white text-orange-600'}`}>
          {isGroupSelected ? '選択解除' : 'すべて選択'}

          <Checkbox
            className="border-orange-300 data-[state=checked]:bg-[#ff6347]"
            checked={isGroupSelected}
            onClick={() => onToggleGroup(group.items)}
          />
        </div>
      </div>

      <div className="rounded-4xl border border-orange-200 bg-white p-3 shadow-sm md:rounded-[40px] md:p-6">
        <div className="grid gap-4 md:gap-6">
          {group.items.map((item) => (
            <HistoryItem
              key={item.id}
              item={item}
              isSelected={selectedIds.has(item.id)}
              onToggle={onToggle}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
