import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import MainDetail from './detail/MainDetail'
import type { Shop } from '@/types/shop'
import { getShopById } from '@/services/search.api'

export default function DetailPage({ shopId }: { shopId: string }) {
  const {
    data: shopData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['shop', shopId],
    queryFn: () => getShopById(shopId),
  })

  const selectedCafe: Shop | null = shopData?.data ?? null

  if (isLoading) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center">
        <Loader2 className="size-10 animate-spin text-[#FF6347]" />
        <div className="mt-4 text-[#ff6347]">読み込み中...</div>
      </div>
    )
  }

  if (isError || !selectedCafe) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="text-center text-[#ff6347]">
          <p className="text-lg font-bold">{'エラーが発生しました'}</p>
          <p className="mt-2 text-sm">ページを再度読み込んでください</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F9F9F9] font-sans text-gray-800">
      <MainDetail cafe={selectedCafe} shopId={shopId} />
    </div>
  )
}
