import * as favoriteRepo from '@/repositories/favorite.repository.js'

const handleGetFavoriteByUserId = async (userId) => {
  return await favoriteRepo.findFavoriteByUserId(userId)
}

export { handleGetFavoriteByUserId }
