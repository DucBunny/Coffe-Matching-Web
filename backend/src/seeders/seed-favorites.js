import Favorite from '@/models/Favorite.js'
import User from '@/models/User.js'
import Shop from '@/models/Shop.js'

const seedFavorites = async () => {
  try {
    await Favorite.deleteMany()
    console.log('Favorites cleared')

    const user = await User.findOne({ username: 'user1' })
    if (!user) {
      console.log('user1 not found, skipping favorites')
      return
    }

    const shops = await Shop.find().limit(4)
    const favorites = shops.map((s) => ({ user_id: user._id, shop_id: s._id }))

    if (favorites.length) {
      await Favorite.insertMany(favorites)
      console.log('Favorites added for user1')
    } else {
      console.log('No shops found to favorite')
    }
  } catch (error) {
    console.error(`Error seeding favorites: ${error}`)
    throw error
  }
}

export default seedFavorites
