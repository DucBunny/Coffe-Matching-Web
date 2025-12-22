export interface Area {
  id: string
  label: string
  jpLabel: string
}

export interface Purpose {
  id: string
  label: string
  jpLabel: string
}

export interface Cafe {
  // id có thể là string (ObjectId từ backend) hoặc number (data local)
  id: string | number
  name: string
  rating: number
  // hours là object theo schema backend
  hours?: {
    open?: string
    close?: string
  }
  address: string
  area?: string
  // purpose có thể là nhiều giá trị
  purpose?: Array<string>
  description?: string
  phone?: string
  features?: Array<string>
  images?: Array<string>
  menu?: Array<{ name: string; price: number; image?: string }>
  reviews?: Array<{
    id: string | number
    user: string
    date: string
    rating: number
    content: string
    image?: string
  }>
  // location theo GeoJSON: [longitude, latitude]
  location?: {
    type: 'Point'
    coordinates: [number, number]
  }
  // giữ lat/lng cho compatibility nếu cần
  lat?: number
  lng?: number
  amenities?: Array<string>
  priceRange?: { min: number; max: number }
  totalReviews?: number
}
