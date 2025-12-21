import { Check, ChevronDown, ChevronUp } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface DropdownOption {
  id: string
  label: string // Tên hiển thị (Tiếng Nhật)
}

interface FilterDropdownProps {
  title: string
  options: Array<DropdownOption>
  selectedId: string | null
  onSelect: (id: string | null) => void
  placeholder: string
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  title,
  options,
  selectedId,
  onSelect,
  placeholder,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Tìm option đang chọn để hiển thị label tiếng Nhật trên button
  const selectedOption = options.find((opt) => opt.id === selectedId)

  return (
    <div className="relative group" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full py-3 px-4 rounded flex justify-between items-center shadow-md transition
          ${isOpen ? 'bg-[#333] text-white' : 'bg-[#111] text-white hover:bg-black'}
        `}>
        <span className="font-bold truncate pr-2">
          {selectedOption ? selectedOption.label : title}
        </span>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-md shadow-xl border border-gray-200 z-20 overflow-hidden max-h-64 overflow-y-auto">
          <button
            type="button"
            onClick={() => {
              onSelect(null)
              setIsOpen(false)
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 border-b border-gray-100 font-medium">
            -- すべて / リセット --
          </button>

          {options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                onSelect(opt.id)
                setIsOpen(false)
              }}
              className={`w-full text-left px-4 py-3 text-sm flex justify-between items-center hover:bg-gray-50 transition
                ${selectedId === opt.id ? 'text-[#F26546] font-bold bg-orange-50' : 'text-gray-700'}
              `}>
              <span className="font-bold">{opt.label}</span>
              {selectedId === opt.id && <Check size={16} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default FilterDropdown