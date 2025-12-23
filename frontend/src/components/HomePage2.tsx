import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Link } from '@tanstack/react-router'
import { useAuthStore } from '../stores/useAuthStore'
import CafeCard from './cafe/CafeCard'
import SectionCard from './homepage/SectionCard'
import { Button } from './ui/button'
import { PURPOSE_MAP, PURPOSE_MAP_DESCRIPTION } from '@/util/constant'
import { recommendationAPI } from '@/services/recommendation.api'
import { getPurposes, getShopBySearch } from '@/services/search.api'
import {
  deleteFavorite,
  getFavoriteByUserId,
  postFavorite,
} from '@/services/favorite.api'

export default function HomePage() {
  const { user } = useAuthStore()

  const { data: recommendationsData } = useQuery({
    queryKey: ['recommendations'],
    queryFn: async () => await recommendationAPI.getRecommendations(),
    enabled: !!user,
  })

  const recommendationsCafe = recommendationsData?.data || []

  const [favorites, setFavorites] = useState<Array<string>>([]) // Lưu mảng shop_id đã thích

  const handleToggle = async (shopId: string) => {
    if (!user) {
      toast.warning('この機能を使用するにはログインする必要があります')
      return
    }
    const isFav = favorites.includes(shopId)
    const previousFavorites = [...favorites]

    try {
      if (isFav) {
        setFavorites((prev) => prev.filter((id) => id !== shopId))
        toast.success('お気に入りから削除しました')
        await deleteFavorite(shopId)
      } else {
        setFavorites((prev) => [...prev, shopId])
        toast.success('お気に入りに追加しました')
        await postFavorite(shopId)
      }
    } catch (error) {
      setFavorites(previousFavorites)
      console.error('Lỗi khi cập nhật yêu thích:', error)
    }
  }

  // Load favorite list
  useEffect(() => {
    const loadFavorite = async () => {
      const res = await getFavoriteByUserId()
      if (res.data.success && res.data.data) {
        setFavorites(res.data.data.map((f) => f.shop_id))
      }
    }
    if (user) loadFavorite()
  }, [user])

  return (
    <div className="my-12 min-h-screen font-sans">
      <div className="mx-auto max-w-[1440px] space-y-12 px-6">
        {!!user && recommendationsCafe.length > 0 && (
          <SectionCard
            title="おすすめ"
            description="あなたに合いそうなカフェをいくつかご紹介します"
            itemsLength={recommendationsCafe.length}
            itemsPerPage={5}>
            {({ pageIndex }) => {
              return (
                <div className="overflow-hidden">
                  <div
                    className="flex transition-transform duration-300"
                    style={{
                      transform: `translateX(-${pageIndex * 100}%)`,
                    }}>
                    {recommendationsCafe.map((c: IShop) => (
                      <div key={c._id} className="w-1/5 shrink-0 px-2">
                        <CafeCard
                          data={c}
                          userLocation={null}
                          showDistance={false}
                          isFavorite={favorites.includes(c._id)}
                          handleToggle={handleToggle}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )
            }}
          </SectionCard>
        )}

        {/* Random 2 purposes: pick 2 each reload and fetch shops for each */}
        {(() => {
          const { data: purposesData } = useQuery({
            queryKey: ['purposes'],
            queryFn: async () => await getPurposes(),
          })

          const purposes: Array<string> = purposesData?.data.data || []

          const selectedPurposes = useMemo(() => {
            if (purposes.length === 0) return [] as Array<string>
            const shuffled = [...purposes].sort(() => Math.random() - 0.5)
            return shuffled.slice(0, 2)
          }, [purposes])

          const { data: shopsData } = useQuery({
            queryKey: ['shopsByPurposes', selectedPurposes],
            enabled: selectedPurposes.length > 0,
            queryFn: async () => {
              const results = await Promise.all(
                selectedPurposes.map((p) =>
                  getShopBySearch({ purpose: p } as any),
                ),
              )
              return results.map((r) => r.data.data || [])
            },
          })

          const shopsLists: Array<Array<IShop>> = shopsData || []

          return (
            <div className="space-y-12">
              {selectedPurposes.map((title, idx) => (
                <SectionCard
                  key={`purpose-sec-${idx}`}
                  title={`${PURPOSE_MAP[title]}向けのカフェ`}
                  description={PURPOSE_MAP_DESCRIPTION[title]}
                  itemsLength={shopsLists[idx]?.length || 0}
                  itemsPerPage={5}>
                  {({ pageIndex }) => {
                    return (
                      <div className="overflow-hidden">
                        <div
                          className="flex transition-transform duration-300"
                          style={{
                            transform: `translateX(-${pageIndex * 100}%)`,
                          }}>
                          {(shopsLists[idx] || []).map((s) => (
                            <div key={s._id} className="w-1/5 shrink-0 px-2">
                              <CafeCard
                                data={s}
                                userLocation={null}
                                showDistance={false}
                                isFavorite={favorites.includes(s._id)}
                                handleToggle={handleToggle}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  }}
                </SectionCard>
              ))}
            </div>
          )
        })()}

        <Link to="/search" className="flex justify-center">
          <Button size="lg" variant="primary" className="rounded-2xl">
            もっとカフェを探す
          </Button>
        </Link>
      </div>
    </div>
  )
}
