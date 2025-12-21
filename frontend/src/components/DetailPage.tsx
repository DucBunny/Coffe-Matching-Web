import { useEffect, useRef, useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import MainDetail from './detail/MainDetail'
import type { Cafe } from '@/types/cafe'
import type { CreateHistory } from '@/types/history'
import cafeDataRaw from '@/data/cafes.json'
import { historyAPI } from '@/services/history.api'
import { useAuthStore } from '@/stores/useAuthStore'

const CAFES_DATA: Array<Cafe> = cafeDataRaw as Array<Cafe>

export default function DetailPage() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()

  // Ref để lưu lại ID của quán đã được log lịch sử
  // useRef giữ giá trị xuyên suốt các lần render mà không gây re-render
  const loggedHistoryRef = useRef<string | number | null>(null)

  const createHistoryMutation = useMutation({
    mutationFn: ({ userId, shopId }: CreateHistory) =>
      historyAPI.create(userId, shopId),
    onSuccess: () => {
      // Chỉ invalidate khi user thực sự quan tâm đến dữ liệu mới
      queryClient.invalidateQueries({ queryKey: ['history'] })
    },
  })

  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null)
  const params = useParams({ from: '/_guest/detail/$id' })
  const idParam = params.id

  useEffect(() => {
    if (idParam) {
      const foundCafe = CAFES_DATA.find((c) => c.id === Number(idParam))

      if (foundCafe) {
        setSelectedCafe(foundCafe)

        // --- LOGIC CHẶN GỌI 2 LẦN ---
        // Kiểm tra:
        // 1. User phải tồn tại (nếu yêu cầu login mới lưu lịch sử)
        // 2. Kiểm tra xem ID quán hiện tại đã được log chưa
        if (user?._id && loggedHistoryRef.current !== idParam) {
          createHistoryMutation.mutate({
            userId: user._id,
            // Lưu ý: Bạn đang hardcode ID ở đây, nên đổi thành ID thật của quán
            shopId: '6946d19d0229432acb45ac61',
            // shopId: foundCafe._id || foundCafe.id.toString(), // Ví dụ lấy ID thật
          })

          // Đánh dấu là đã log cho ID này rồi
          loggedHistoryRef.current = idParam
        }
      } else {
        // Fallback nếu ID không tồn tại: Chọn quán đầu tiên
        setSelectedCafe(CAFES_DATA[0])
      }
    } else {
      // Fallback nếu không có ID: Chọn quán đầu tiên
      setSelectedCafe(CAFES_DATA[0])
    }
  }, [idParam, user?._id]) // Thêm user?._id vào deps nếu muốn log ngay khi user vừa load xong

  if (!selectedCafe) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F9F9F9] font-sans text-gray-800">
      <MainDetail cafe={selectedCafe} />
    </div>
  )
}
