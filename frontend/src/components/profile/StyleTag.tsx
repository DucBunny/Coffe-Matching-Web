type StyleTagProps = {
  label: string
  selected: boolean
  onClick: () => void
}

const StyleTag: React.FC<StyleTagProps> = ({ label, selected, onClick }) => (
  <button
    onClick={onClick}
    className={`p-4 rounded-md text-sm border transition cursor-pointer
      ${
        selected
          ? 'bg-black text-white border-black'
          : 'bg-gray-200 text-gray-700 border-gray-300'
      }`}
  >
    {label}
  </button>
)

export default StyleTag
