interface PaginationButtonProps {
  active?: boolean
  children: React.ReactNode
  onClick: () => void
}

const PaginationButton: React.FC<PaginationButtonProps> = ({
  active = false,
  children,
  onClick,
}) => {
  const baseClass =
    'w-9 h-9 flex items-center justify-center rounded-md text-sm font-bold transition-all duration-200 border cursor-pointer select-none'
  const activeClass =
    'bg-custom-primary text-white border-custom-primary shadow-sm transform scale-105'
  const inactiveClass =
    'bg-white text-gray-600 border-gray-200 hover:bg-gray-100 hover:border-gray-300 hover:text-custom-primary'

  return (
    <button
      className={`${baseClass} ${active ? activeClass : inactiveClass}`}
      onClick={onClick}>
      {children}
    </button>
  )
}

export default PaginationButton
