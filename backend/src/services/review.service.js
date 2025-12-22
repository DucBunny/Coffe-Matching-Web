import * as reviewRepo from '@/repositories/review.repository.js'

export const createReview = async (data) => {
  return await reviewRepo.createReview(data)
}

export const getReviewsByShopId = async (filters, shopId) => {
  return await reviewRepo.findReviewsByShopId(filters, shopId)
}
