import * as reviewService from '@/services/review.service.js'

export async function createReview(req, res, next) {
  try {
    const newReview = await reviewService.createReview(req.body)
    res.status(201).json({
      success: true,
      data: newReview
    })
  } catch (error) {
    next(error)
  }
}

export async function getReviewsByShopId(req, res, next) {
  try {
    const filters = req.query
    const { shopId } = req.params
    const reviews = await reviewService.getReviewsByShopId(filters, shopId)
    res.status(200).json({
      success: true,
      ...reviews
    })
  } catch (error) {
    console.error('review.getReviewsByShopId error:', error)
    next(error)
  }
}
