import History from '@/models/History.js'
import User from '@/models/User.js'
import Shop from '@/models/Shop.js'

const seedHistory = async () => {
  try {
    await History.deleteMany()
    console.log('History cleared')

    const user = await User.findOne({ username: 'user1' })
    if (!user) {
      console.log('user1 not found, skipping history')
      return
    }

    const shops = await Shop.find().limit(6)
    const entries = []
    const now = new Date()

    shops.forEach((s, idx) => {
      // create visits with decreasing timestamps (1 day apart)
      entries.push({
        user_id: user._id,
        shop_id: s._id,
        createdAt: new Date(now.getTime() - idx * 24 * 60 * 60 * 1000)
      })
    })

    if (entries.length) {
      await History.insertMany(entries)
      console.log('History added for user1')
    } else {
      console.log('No shops found for history')
    }
  } catch (error) {
    console.error(`Error seeding history: ${error}`)
    throw error
  }
}

export default seedHistory
