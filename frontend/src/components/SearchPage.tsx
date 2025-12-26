import { useEffect, useState } from 'react'
import { MapPinned } from 'lucide-react'
import FilterSidebar from './search/filter/FilterSidebar'
import MainContent from './search/MainSearch'
import SelectLocationMap from './search/SelectLocationMap'
import { Button } from './ui/button'
import { getShopBySearch } from '@/services/search.api'
import { ITEMS_PER_PAGE } from '@/util/constant'
import { useLocationStore } from '@/stores/useLocationStore'

interface Filters {
  area: string | null
  purpose: string | null
  priceMin: number | null
  priceMax: number | null
  amenities: Array<string>
}

interface Meta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function SearchPage({
  initialKeyword = '',
}: {
  initialKeyword?: string
}) {
  const { userLocation, requestUserLocation, setUserLocation, isLocating } =
    useLocationStore()
  const [isOpenMap, setIsOpenMap] = useState(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [filters, setFilters] = useState<Filters>({
    area: null,
    purpose: null,
    priceMin: null,
    priceMax: null,
    amenities: [],
  })
  type SortType = 'distance' | 'rating' | null

  const [sortBy, setSortBy] = useState<SortType>(null)
  const [priceInputs, setPriceInputs] = useState<{ min: string; max: string }>({
    min: '',
    max: '',
  })
  const [priceApplied, setPriceApplied] = useState<boolean>(false)

  const [shops, setShops] = useState<Array<IShop>>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [meta, setMeta] = useState<Meta | null>(null)

  // Fetch data từ API
  const fetchShops = async () => {
    try {
      setLoading(true)
      setError(null)
      const params: ISearchShopParams = {
        keyword: initialKeyword || undefined,
        area: filters.area || undefined,
        purpose: filters.purpose || undefined,
        amenities:
          filters.amenities.length > 0
            ? filters.amenities.join(',')
            : undefined,
        min_price: filters.priceMin || undefined,
        max_price: filters.priceMax || undefined,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        sortRating: sortBy === 'rating',
        lat: sortBy === 'distance' ? userLocation?.lat : undefined,
        lng: sortBy === 'distance' ? userLocation?.lng : undefined,
      }
      const response = await getShopBySearch(params)
      setShops(response.data.data ?? [])
      setMeta(response.data.meta ?? null)
    } catch (err) {
      setError('Lỗi khi tải dữ liệu')
      console.error('Error fetching shops:', err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch shops khi filter thay đổi
  useEffect(() => {
    fetchShops()
  }, [filters, currentPage, sortBy, initialKeyword, userLocation])

  const parsePriceInput = (value: string) => {
    const numeric = parseInt(value.replace(/[^0-9]/g, ''), 10)
    return Number.isFinite(numeric) ? numeric : null
  }

  const handleApplyPrice = () => {
    const minValue = parsePriceInput(priceInputs.min)
    const maxValue = parsePriceInput(priceInputs.max)
    setFilters((prev) => ({ ...prev, priceMin: minValue, priceMax: maxValue }))
    setPriceApplied(true)
  }

  // Reset về trang 1 khi filter thay đổi
  useEffect(() => {
    setCurrentPage(1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [filters, initialKeyword, sortBy])

  const handleSortChange = (type: 'distance' | 'rating') => {
    setSortBy((prev) => {
      const next = prev === type ? null : type

      if (next === 'distance' && !userLocation) {
        requestUserLocation()
      }

      return next
    })
  }

  if (error) {
    return (
      <div className="flex w-full flex-col font-sans">
        <div className="flex items-center justify-center p-8 text-red-600">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-[#F7F7F7] font-sans">
      <div className="flex items-center border-b bg-white px-4 py-3 md:px-8">
        {isLocating ? (
          <div className="text-custom-primary flex h-8 items-center gap-2">
            <MapPinned size={16} />
            <span>位置情報を取得中...</span>
          </div>
        ) : (
          <>
            <div className="text-custom-primary mr-5 flex items-center gap-2">
              <MapPinned size={16} />
              <span>{userLocation?.address ?? '現在地'}</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsOpenMap(true)}>
              地図で選択
            </Button>
            <Button
              size="sm"
              variant="primary"
              className="ml-auto"
              onClick={() => requestUserLocation()}>
              位置をリセット
            </Button>
          </>
        )}
      </div>

      {/* ===== Main content ===== */}
      <div className="flex gap-6 px-4 py-6 md:px-8">
        {/* Sidebar */}
        <aside className="hidden w-[260px] shrink-0 md:block">
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            priceInputs={priceInputs}
            setPriceInputs={setPriceInputs}
            onApplyPrice={handleApplyPrice}
            priceApplied={priceApplied}
            setPriceApplied={setPriceApplied}
          />
        </aside>

        {/* Main result */}
        <main className="flex-1">
          <MainContent
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            cafes={shops}
            totalPages={meta?.totalPages ?? 1}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            userLocation={userLocation}
            showDistance={sortBy === 'distance'}
            loading={loading}
          />
        </main>
      </div>

      {/* ===== Map Modal ===== */}
      {isOpenMap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[95%] rounded-xl bg-white md:w-[700px]">
            <SelectLocationMap
              onConfirm={(lat, lng, address) => {
                setUserLocation({ lat, lng, address })
                setIsOpenMap(false)
              }}
              onClose={() => setIsOpenMap(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
