import Shop from '@/models/Shop.js'
import rawShops from './shops.json'

// Hàm chuyển đổi giá từ string "180 VND" -> number 180
const parsePrice = (priceStr) => {
  if (!priceStr) return 0
  return Number(priceStr.replace(/[^\d]/g, ''))
}

// Hàm chuyển đổi giờ "7:00 ~ 23:00" -> object
const parseHours = (hoursStr) => {
  if (!hoursStr) return { open: '', close: '' }
  const [open, close] = hoursStr.split(' ~ ')
  return { open: open || '', close: close || '' }
}

// Hàm chuyển đổi khoảng giá "300-600" -> object
const parsePriceRange = (rangeStr) => {
  if (!rangeStr) return { min: 0, max: 0 }
  const [min, max] = rangeStr.split('-')
  return { min: Number(min), max: Number(max) }
}

const seedShops = async () => {
  try {
    await Shop.deleteMany()
    console.log('Shops cleared')

    const shops = rawShops.map((shop) => ({
      name: shop.name,
      purpose: [shop.purpose], // Model yêu cầu mảng
      amenities: shop.amenities || [],
      features: shop.features || [],
      hours: parseHours(shop.hours),
      location: {
        type: 'Point',
        coordinates: [shop.lng, shop.lat] // GeoJSON yêu cầu [Longitude, Latitude]
      },
      address: shop.address,
      area: shop.area,
      priceRange: parsePriceRange(shop.priceRange),
      description: shop.description,
      phone: shop.phone,
      images: shop.images || [],
      menu: (shop.menu || []).map((item) => ({
        name: item.name,
        price: parsePrice(item.price),
        image: item.image
      })),
      rating: shop.rating, // Giữ rating ban đầu từ JSON
      totalReviews: shop.reviews ? shop.reviews.length : 0
    }))

    await Shop.insertMany(shops)
    console.log('Shops added')
  } catch (error) {
    console.error(`Error seeding shops: ${error}`)
    throw error
  }
}

export default seedShops
