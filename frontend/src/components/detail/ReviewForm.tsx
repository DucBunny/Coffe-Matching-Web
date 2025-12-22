import { Star, Upload, User, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { useAuthStore } from '../../stores/useAuthStore'
import { Button } from '../ui/button'
import type { AnyFieldApi } from '@tanstack/react-form'
import { reviewAPI } from '@/services/review.api'

const MAX_REVIEW_LENGTH = 500
const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
]

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <p className="text-destructive text-xs">
          {field.state.meta.errors[0]?.message}
        </p>
      ) : null}
      {field.state.meta.isValidating ? '検証中...' : null}
    </>
  )
}

const reviewSchema = z.object({
  rating: z.number().min(1, '評価を選択してください'),
  content: z
    .string()
    .min(1, 'レビューを入力してください')
    .max(
      MAX_REVIEW_LENGTH,
      `レビューは${MAX_REVIEW_LENGTH}文字以内で入力してください`,
    ),
  image: z.string().optional(),
})

export default function ReviewForm({ shopId }: { shopId: string }) {
  const { user } = useAuthStore()
  const [hoverRating, setHoverRating] = useState<number>(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imageError, setImageError] = useState<string | undefined>(undefined)

  const createMutation = useMutation({
    mutationFn: (newReview: {
      rating: number
      content: string
      image?: string
    }) =>
      reviewAPI.create(
        user?._id || null,
        shopId,
        newReview.rating,
        newReview.content,
        newReview.image ? [newReview.image] : [],
      ),
  })

  const form = useForm({
    defaultValues: { rating: 0, content: '', image: undefined } as any,
    validators: { onSubmit: reviewSchema as any },
    onSubmit: async ({ value }) => {
      if (imageError) return
      try {
        await createMutation.mutateAsync({
          rating: value.rating,
          content: value.content,
          image: value.image,
        })
        toast.success('レビューを送信しました')
        form.reset()
      } catch (err) {
        console.error('レビュー送信エラー:', err)
      }
    },
  })

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: AnyFieldApi,
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setImageError(
        '画像ファイルのみアップロード可能です (JPEG, PNG, GIF, WebP)',
      )
      if (fileInputRef.current) fileInputRef.current.value = ''
      field.handleChange(undefined)
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setImageError(
        `ファイルサイズは${MAX_FILE_SIZE / 1024 / 1024}MB以下にしてください`,
      )
      if (fileInputRef.current) fileInputRef.current.value = ''
      field.handleChange(undefined)
      return
    }

    setImageError(undefined)
    const reader = new FileReader()
    reader.onloadend = () => {
      const dataUrl = reader.result as string
      field.handleChange(dataUrl)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = (field: AnyFieldApi) => {
    field.handleChange(undefined)
    setImageError(undefined)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="mb-8 w-full rounded-xl border border-gray-100 bg-gray-50 p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400">
            <User size={20} />
          </div>
          <div>
            <span className="block text-sm font-bold text-gray-800">
              {user ? user.username : ''}
            </span>
            <span className="text-xs text-gray-500">レビューを書く</span>
          </div>
        </div>

        <div>
          <form.Field
            name="rating"
            children={(field) => (
              <>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={24}
                      className={`cursor-pointer transition-all ${
                        star <= (hoverRating || field.state.value)
                          ? 'fill-[#F26546] text-[#F26546]'
                          : 'text-gray-300'
                      } hover:scale-110`}
                      onClick={() => field.handleChange(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    />
                  ))}
                </div>
                <FieldInfo field={field} />
              </>
            )}
          />
        </div>
      </div>

      <div className="mb-3">
        <form.Field
          name="content"
          children={(field) => (
            <div className="relative">
              <textarea
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className={`w-full border ${
                  field.state.meta.errors.length
                    ? 'border-red-300'
                    : 'border-gray-200'
                } rounded-lg p-4 pr-12 text-sm focus:ring-2 focus:outline-none ${
                  field.state.meta.errors.length
                    ? 'focus:border-red-400 focus:ring-red-200'
                    : 'focus:border-[#F26546] focus:ring-[#F26546]/20'
                } min-h-[100px] bg-white shadow-inner transition-all`}
                placeholder="このカフェはどうでしたか？"
                maxLength={MAX_REVIEW_LENGTH}
              />

              <div className="absolute right-0 bottom-6">
                <form.Field
                  name="image"
                  children={(imgField) => (
                    <>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, imgField)}
                        className="hidden"
                        id="review-image-upload"
                      />
                      <label
                        htmlFor="review-image-upload"
                        className="inline-flex cursor-pointer rounded-full p-2 text-gray-400 transition hover:text-[#F26546]">
                        <Upload size={20} />
                      </label>
                    </>
                  )}
                />
              </div>
              <div className="mt-1 flex items-center justify-between">
                <div>
                  <FieldInfo field={field} />
                </div>
                <p
                  className={`text-xs ${field.state.value?.length > MAX_REVIEW_LENGTH * 0.9 ? 'text-orange-500' : 'text-gray-400'}`}>
                  {field.state.value?.length ?? 0}/{MAX_REVIEW_LENGTH}
                </p>
              </div>
            </div>
          )}
        />
      </div>

      <form.Field
        name="image"
        children={(field) => (
          <>
            {imageError && (
              <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3">
                <p className="flex items-center gap-2 text-xs text-red-600">
                  <span className="font-bold">⚠</span>
                  {imageError}
                </p>
              </div>
            )}

            {field.state.value && (
              <div className="relative mb-3 inline-block">
                <img
                  src={field.state.value as string}
                  alt="Preview"
                  className="h-32 w-32 rounded-lg border-2 border-gray-200 object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(field)}
                  className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition hover:bg-red-600">
                  <X size={12} />
                </button>
              </div>
            )}
          </>
        )}
      />

      <div className="mt-3 flex justify-end">
        <form.Subscribe
          selector={(s) => [s.canSubmit, s.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit} className="px-6">
              {isSubmitting ? '送信中...' : '送信'}
            </Button>
          )}
        />
      </div>
    </form>
  )
}
