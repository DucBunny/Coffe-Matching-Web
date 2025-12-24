import { useEffect, useMemo, useRef, useState } from 'react'
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { Clock, Loader2, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
import type {
  HistoryEntry,
  HistoryGroup as HistoryGroupType,
} from '@/types/history'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/useAuthStore'
import { historyAPI } from '@/services/history.api'
import HistoryGroup from '@/components/history/HistoryGroup'

// Transform server data to grouped history format
const transformServerToHistory = (
  serverItems: Array<any>,
): Array<HistoryGroupType> => {
  const getLocalKey = (d: Date) => {
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const map = new Map<string, { display: string; items: Array<HistoryEntry> }>()

  const now = new Date()
  const todayKey = getLocalKey(now)

  const yesterdayDate = new Date(now)
  yesterdayDate.setDate(now.getDate() - 1)
  const yesterdayKey = getLocalKey(yesterdayDate)

  serverItems.forEach((it) => {
    const dateObj = new Date(it.createdAt)
    const dateKey = getLocalKey(dateObj)
    let displayDate = dateObj.toLocaleDateString()

    if (dateKey === todayKey) displayDate = '今日'
    else if (dateKey === yesterdayKey) displayDate = '昨日'

    const time = dateObj.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
    const shop = it.shop || {}

    const entry: HistoryEntry = {
      id: it._id,
      shopId: shop._id || '',
      time,
      shop: shop,
    }

    if (!map.has(dateKey)) map.set(dateKey, { display: displayDate, items: [] })
    map.get(dateKey)!.items.push(entry)
  })

  // Convert map to array and sort by date descending
  const groups: Array<HistoryGroupType> = Array.from(map.entries())
    .map(([, { display, items }]) => ({ date: display, items }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return groups
}

export default function HistoryPage() {
  const { user } = useAuthStore()
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  const queryClient = useQueryClient()

  const {
    data: historyData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['history', user?._id],
    queryFn: ({ pageParam }) => {
      if (!user?._id) return { data: [], meta: {} }
      return historyAPI.getAll(user._id, pageParam, 10)
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage?.meta?.nextCursor,
    enabled: !!user?._id,
  })

  const deleteMutation = useMutation({
    mutationFn: (historyIds: Array<string>) =>
      historyAPI.deleteMany(historyIds),
    onSuccess: () => {
      toast.success('選択した履歴を削除しました')
      queryClient.invalidateQueries({ queryKey: ['history'] })
      setSelectedIds(new Set())
    },
  })

  // Recalculate grouped history when historyData changes
  const historyGroups = useMemo(() => {
    if (!historyData) return []

    // Flatten all pages' data into a single array
    const allItems = historyData.pages.flatMap((page: any) => page.data)

    return transformServerToHistory(allItems)
  }, [historyData])

  // Auto load next page when sentinel becomes visible
  useEffect(() => {
    const el = loadMoreRef.current
    if (!el || !hasNextPage || isFetchingNextPage) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage()
        }
      },
      { root: null, rootMargin: '200px', threshold: 0.1 }, // rootMargin to preload earlier 200px upcoming
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  // Toggle selection of a single history item
  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) newSelected.delete(id)
    else newSelected.add(id)
    setSelectedIds(newSelected)
  }

  // Toggle selection of all items in a group
  const toggleGroup = (groupItems: Array<HistoryEntry>) => {
    const groupIds = groupItems.map((item) => item.id)
    const allGroupSelected = groupIds.every((id) => selectedIds.has(id))
    const newSelected = new Set(selectedIds)
    if (allGroupSelected) groupIds.forEach((id) => newSelected.delete(id))
    else groupIds.forEach((id) => newSelected.add(id))
    setSelectedIds(newSelected)
  }

  // Deselect all selected items
  const deselectAll = () => setSelectedIds(new Set())

  // Delete selected history items from state
  const deleteSelected = () => {
    deleteMutation.mutate(Array.from(selectedIds))
  }

  return (
    <>
      <main className="mx-auto max-w-[96%] space-y-12 p-4 md:p-8">
        <div className="mb-8 flex justify-center">
          <div className="border-custom-primary text-custom-primary border-b-4 pb-1 text-center text-3xl font-bold">
            閲覧履歴
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex min-h-[50vh] flex-col items-center justify-center">
            <Loader2 className="text-custom-primary size-10 animate-spin" />
            <div className="text-custom-primary mt-4">読み込み中...</div>
          </div>
        ) : historyGroups.length === 0 ? (
          <div className="text-custom-primary/50 flex min-h-[50vh] flex-col items-center justify-center gap-6">
            <div className="flex size-20 items-center justify-center rounded-full bg-orange-50">
              <Clock className="size-10" />
            </div>
            <p className="text-xl font-bold">履歴はありません</p>
          </div>
        ) : (
          <>
            {historyGroups.map((group) => (
              <HistoryGroup
                key={group.date}
                group={group}
                selectedIds={selectedIds}
                onToggle={toggleSelect}
                onToggleGroup={toggleGroup}
              />
            ))}

            {/* Loading Indicator at the bottom (Sentinel) */}
            <div
              ref={loadMoreRef}
              className="flex h-20 w-full items-center justify-center py-4">
              {isFetchingNextPage && (
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              )}
            </div>

            {/* Fallback button if observer fails (rare but should have) */}
            {hasNextPage && !isFetchingNextPage && (
              <div className="h-1" /> /* Invisible spacer */
            )}
          </>
        )}
      </main>

      {/* Dialog Selection */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-8 left-1/2 z-40 w-full max-w-xl -translate-x-1/2">
          <div className="flex items-center justify-between rounded-4xl border border-white/10 bg-zinc-900 p-4 text-white shadow-2xl">
            <div className="flex items-center gap-4 pl-3">
              <span className="bg-custom-primary flex size-9 items-center justify-center rounded-xl text-sm font-black text-white">
                {selectedIds.size}
              </span>
              <p className="hidden text-sm font-black sm:block">選択中</p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={deselectAll}
                className="rounded-2xl bg-white/10 text-xs hover:bg-white/20">
                <X className="size-4" />
                キャンセル
              </Button>
              <Button
                onClick={deleteSelected}
                className="bg-custom-primary hover:bg-custom-primary/80 rounded-2xl text-xs">
                <Trash2 className="size-4" />
                削除
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
