export const ITEMS_PER_PAGE = 12

// Review Form constants
export const MAX_REVIEW_LENGTH = 500
export const MAX_FILE_SIZE = 5 * 1024 * 1024
export const MAX_IMAGES = 5
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
]

// Maps for area, purpose, and amenities
export const AREA_MAP = [
  { id: 'hbt', label: 'Hai Ba Trung', jpLabel: 'ハイバーチュン区' },
  { id: 'hk', label: 'Hoan Kiem', jpLabel: 'ホアンキエム区' },
  { id: 'cg', label: 'Cau Giay', jpLabel: 'カウザイ区' },
  { id: 'bd', label: 'Ba Dinh', jpLabel: 'バーディン区' },
  { id: 'th', label: 'Tay Ho', jpLabel: 'タイホー区' },
  { id: 'dd', label: 'Dong Da', jpLabel: 'ドンダー区' },
]

export const PURPOSE_MAP: Record<string, string> = {
  date: 'デート',
  relax: 'リラックス',
  study: '勉強',
  work: '仕事',
  meetup: 'おしゃべり',
  view: '観光・絶景',
}

export const AMENITY_MAP: Record<string, string> = {
  // Tiện ích kỹ thuật
  wifi: 'Wi-Fi高速',
  power: '電源あり',
  ac: 'エアコン',
  parking: '駐車場',

  // Không gian & Vị trí
  // quiet: '静か',
  // hidden: '隠れ家',
  // spacious: '広々',
  // outdoor: 'テラス・自然',
  // garden: '庭',
  // rooftop: 'ルーフトップ',
  // lake_view: 'レイクビュー',
  // street_view: '街並み',
  // landmark: '観光名所',

  // Phong cách
  vintage: 'レトロ',
  modern: 'モダン',
  luxury: '高級感',
  industrial: 'インダストリアル',
  cozy: '居心地が良い',

  // Dịch vụ & Đồ uống
  food: '食事・スイーツ',
  late_night: '深夜営業',
  pet: 'ペット可',

  // Đối tượng
  // family: '家族向け',
}

export const PURPOSE_MAP_DESCRIPTION: Record<string, string> = {
  date: 'ロマンチックな雰囲気や美味しいデザートが楽しめるカフェ',
  relax: '静かで落ち着いた空間でリラックスできるカフェ',
  study: '集中できる環境と快適な設備が整ったカフェ',
  work: '仕事やミーティングに適した設備と雰囲気のカフェ',
  meetup: '友人とのおしゃべりや交流に最適なカフェ',
  view: '美しい景色やユニークなデザインが楽しめるカフェ',
}

// Styles Profile
export const STYLES: Array<string> = [
  '勉強',
  '仕事',
  'デート',
  'おしゃべり',
  '観光・絶景',
  '静か',
  '賑やか',
  'レトロ',
  'モダン',
  '自然・庭',
  'ルーフトップ',
  '隠れ家',
  'WiFi高速',
  '電源あり',
  'テラス席',
  '駐車場',
  '広々',
  'ペット可',
  '深夜営業',
  '食事・スイーツ',
  '一人',
  '友人',
  'カップル',
  'ファミリー',
]
