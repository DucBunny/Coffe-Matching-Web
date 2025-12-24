import { useEffect, useState } from 'react'
import FilterDropdown from './FilterDropdown'
import { Button } from '@/components/ui/button'
import { getAmenities, getAreas, getPurposes } from '@/services/search.api'
import { AMENITY_MAP, AREA_MAP, PURPOSE_MAP } from '@/util/constant'

interface Filters {
  area: string | null
  purpose: string | null
  priceMin: number | null
  priceMax: number | null
  amenities: Array<string>
}

interface FilterSidebarProps {
  filters: Filters
  setFilters: React.Dispatch<React.SetStateAction<Filters>>
  priceInputs: { min: string; max: string }
  setPriceInputs: React.Dispatch<
    React.SetStateAction<{ min: string; max: string }>
  >
  onApplyPrice: () => void
  priceApplied: boolean
  setPriceApplied: React.Dispatch<React.SetStateAction<boolean>>
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  setFilters,
  priceInputs,
  setPriceInputs,
  onApplyPrice,
  priceApplied,
  setPriceApplied,
}) => {
  const [areas, setAreas] = useState<Array<{ id: string; label: string }>>([])
  const [purposes, setPurposes] = useState<
    Array<{ id: string; label: string }>
  >([])
  const [amenities, setAmenities] = useState<
    Array<{ id: string; label: string }>
  >([])

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [areasRes, purposesRes, amenitiesRes] = await Promise.all([
          getAreas(),
          getPurposes(),
          getAmenities(),
        ])

        // Chuyển đổi Area code sang Tiếng Nhật dựa trên AREA_MAP
        if (areasRes.data.success && Array.isArray(areasRes.data.data)) {
          setAreas(
            areasRes.data.data.map((id: string) => ({
              id,
              label: AREA_MAP.find((area) => area.id === id)?.jpLabel || id, // Hiển thị tiếng Nhật, nếu không tìm thấy thì hiện ID gốc
            })),
          )
        }

        // Chuyển đổi Purpose code sang Tiếng Nhật dựa trên PURPOSE_MAP
        if (purposesRes.data.success && Array.isArray(purposesRes.data.data)) {
          setPurposes(
            purposesRes.data.data.map((id: string) => ({
              id,
              label: PURPOSE_MAP[id] || id,
            })),
          )
        }

        // Lọc bỏ null và chuyển đổi sang Tiếng Nhật dựa trên AMENITY_MAP
        if (
          amenitiesRes.data.success &&
          Array.isArray(amenitiesRes.data.data)
        ) {
          setAmenities(
            amenitiesRes.data.data
              .filter(
                (id: string | null) => id !== null && Boolean(AMENITY_MAP[id]),
              )
              .map((id: string) => ({
                id: id,
                label: AMENITY_MAP[id],
              })),
          )
        }
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu filter:', err)
      }
    }

    fetchFilterOptions()
  }, [])

  return (
    <aside className="h-fit w-full shrink-0 space-y-6 md:sticky md:top-24 md:w-64">
      {/* Dropdown Khu vực */}
      <FilterDropdown
        title="場所"
        options={areas}
        selectedId={filters.area}
        onSelect={(id) => setFilters((prev) => ({ ...prev, area: id }))}
      />

      {/* Dropdown Mục đích */}
      <FilterDropdown
        title="目的"
        options={purposes}
        selectedId={filters.purpose}
        onSelect={(id) => setFilters((prev) => ({ ...prev, purpose: id }))}
      />

      {/* Phần khoảng giá */}
      <div className="rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
        <div className="mb-4 rounded bg-[#555] py-1.5 text-center text-sm font-bold text-white">
          価格帯
        </div>

        <div className="mb-4 flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute top-2 right-1 text-xs text-gray-500">
              đ
            </span>
            <input
              type="text"
              placeholder="Min"
              className="focus:border-custom-primary w-full rounded border border-gray-300 px-2 py-1.5 pr-8 text-sm focus:outline-none"
              value={priceInputs.min}
              onChange={(e) => {
                setPriceInputs((prev) => ({ ...prev, min: e.target.value }))
                setPriceApplied(false)
              }}
            />
          </div>
          <span className="text-gray-500">~</span>
          <div className="relative flex-1">
            <span className="absolute top-2 right-1 text-xs text-gray-500">
              đ
            </span>
            <input
              type="text"
              placeholder="Max"
              className="focus:border-custom-primary w-full rounded border border-gray-300 px-2 py-1.5 pr-8 text-sm focus:outline-none"
              value={priceInputs.max}
              onChange={(e) => {
                setPriceInputs((prev) => ({ ...prev, max: e.target.value }))
                setPriceApplied(false)
              }}
            />
          </div>
        </div>

        <Button
          size="lg"
          type="button"
          onClick={onApplyPrice}
          className={`hover:bg-custom-primary/90 mb-6 w-full rounded font-bold transition ${
            priceApplied
              ? 'bg-[#e85f2f] shadow-md ring-2'
              : 'bg-custom-primary hover:opacity-90'
          }`}>
          適用
        </Button>

        {/* Danh sách các tiện ích */}
        <div className="grid grid-cols-1 gap-2">
          {amenities.map((amenity) => {
            const isActive = filters.amenities.includes(amenity.id)
            return (
              <Button
                size="lg"
                key={amenity.id}
                onClick={() => {
                  setFilters((prev) => {
                    const exists = prev.amenities.includes(amenity.id)
                    return {
                      ...prev,
                      amenities: exists
                        ? prev.amenities.filter((a) => a !== amenity.id)
                        : [...prev.amenities, amenity.id],
                    }
                  })
                }}
                className={`rounded font-bold transition ${
                  isActive
                    ? 'hover:bg-custom-primary/90 border-custom-primary bg-custom-primary text-white shadow-sm'
                    : 'border-[#444444] bg-[#444444] text-white hover:bg-[#555]'
                }`}>
                {amenity.label}
              </Button>
            )
          })}
        </div>
      </div>
    </aside>
  )
}

export default FilterSidebar
