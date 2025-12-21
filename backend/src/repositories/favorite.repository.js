import Favorite from '@/models/Favorite.js'

async function findFavoriteByUserId(user_id) {
  return Favorite.find({ user_id })
}

export { findFavoriteByUserId }
