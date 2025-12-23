import * as recommendationService from '@/services/recommendation.service.js'

export async function getRecommendations(req, res, next) {
  try {
    const userId = req.user ? req.user.id : null
    const results = await recommendationService.getRecommendations(userId)

    return res.status(200).json({
      success: true,
      data: results
    })
  } catch (error) {
    next(error)
  }
}
