export interface Shop {
  _id: string
  name: string
  purpose: Array<string>
  amenities: Array<string>
  features: Array<string>
  hours: {
    open: string
    close: string
  }
  location: {
    type: 'Point'
    coordinates: [number, number]
  }
  address: string
  area: string
  priceRange: {
    min: number
    max: number
  }
  description: string
  phone: string
  images: Array<string>
  menu: Array<Menu>
  rating: number
  reviews: Array<Review>
  totalReviews: number
}

export interface Review {
  _id: string
  user: string
  date?: string
  rating: number
  content: string
  image: string
}

export interface Menu {
  name: string
  price: number
  image: string
}
