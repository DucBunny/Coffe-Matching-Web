import StyleTag from './StyleTag'
import { Card } from '@/components/ui/card'

type StyleSelectorProps = {
  styles: Array<string>
  selected: Array<string>
  toggleStyle: (item: string) => void
  isEditing: boolean
  setIsEditing: (val: boolean) => void
}

const StyleSelector: React.FC<StyleSelectorProps> = ({
  styles,
  selected,
  toggleStyle,
  isEditing,
}) => (
  <>
    <Card className="h-full p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-primary text-lg font-semibold">スタイル</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {styles.map((item) => (
          <StyleTag
            key={item}
            label={item}
            selected={selected.includes(item)}
            onClick={() => isEditing && toggleStyle(item)}
          />
        ))}
      </div>
    </Card>
  </>
)

export default StyleSelector
