import { useEffect, useState } from 'react'
import FilterSidebar from './search/filter/FilterSidebar'
import MainContent from './search/MainSearch'
import SelectLocationMap from './search/SelectLocationMap'
import { getShopBySearch } from '@/services/search.api'

type LocationSource = 'gps' | 'manual'

interface Filters {
  area: string | null
  purpose: string | null
  priceMin: number | null
  priceMax: number | null
  amenities: Array<string>
}

interface SelectedLocation {
  lat: number
  lng: number
  source: LocationSource
}

export default function SearchPage({
  initialKeyword = '',
}: {
  initialKeyword?: string
}) {
  const [selectedLocation, setSelectedLocation] =
    useState<SelectedLocation | null>(null)
  const [isOpenMap, setIsOpenMap] = useState(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [isLocating, setIsLocating] = useState(false)
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
  const [userLocation, setUserLocation] = useState<{
    lat: number
    lng: number
  } | null>(null)
  const [shops, setShops] = useState<Array<IShop>>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

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
        limit: 12,
        sortRating: sortBy === 'rating',
        lat: sortBy === 'distance' ? userLocation?.lat : undefined,
        lng: sortBy === 'distance' ? userLocation?.lng : undefined,
      }
      console.log('params', params)
      const response = await getShopBySearch(params)
      // console.log("res", response.data.data)
      setShops(response.data.data ?? [])
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

  const totalItems = shops.length

  const requestUserLocation = () => {
    setIsLocating(true)

    // Cấu hình để ép buộc sử dụng GPS và độ chính xác cao nhất
    const geoOptions = {
      enableHighAccuracy: true, // QUAN TRỌNG: Sử dụng GPS thay vì IP/Wifi
      timeout: 15000, // Chờ tối đa 15 giây (GPS cần thời gian để lock vệ tinh)
      maximumAge: 0, // Luôn lấy vị trí mới, không lấy từ bộ nhớ đệm
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setUserLocation({ lat: latitude, lng: longitude })
        console.log(`Đã lấy vị trí chính xác :`, latitude, longitude)
        setIsLocating(false)
      },
      (err) => {
        setIsLocating(false)
        console.error('Lỗi lấy vị trí:', err)
        if (!userLocation) {
          setUserLocation({ lat: 21.0285, lng: 105.8542 })
        }
      },
      geoOptions,
    )
  }

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
    <div className="flex w-full flex-col font-sans">
      <div className="relative flex w-full flex-col gap-8 p-4 md:flex-row md:px-8 md:py-8">
        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
          priceInputs={priceInputs}
          setPriceInputs={setPriceInputs}
          onApplyPrice={handleApplyPrice}
          priceApplied={priceApplied}
          setPriceApplied={setPriceApplied}
        />
        <MainContent
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          cafes={shops}
          totalItems={totalItems}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          userLocation={userLocation}
          showDistance={sortBy === 'distance'}
          loading={loading}
        />
      </div>
      <button onClick={() => setIsOpenMap(true)}>
        📍 Chọn vị trí trên bản đồ
      </button>
      {isOpenMap && (
        <div className="modal">
          <SelectLocationMap
            onConfirm={(lat, lng) => {
              console.log('check', lat, lng)
              setSelectedLocation({
                lat,
                lng,
                source: 'manual',
              })
              setIsOpenMap(false)
            }}
          />
        </div>
      )}
    </div>
  )
}
