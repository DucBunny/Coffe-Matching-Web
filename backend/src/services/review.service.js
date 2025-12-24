import * as reviewRepo from '@/repositories/review.repository.js'

export const createReview = async (data) => {
  const { user_id, shop_id, rating, content, images } = data

  const imageUrls = images.map((file) => file.filename)

  return await reviewRepo.createReview({
    user_id,
    shop_id,
    rating,
    content,
    images: imageUrls
  })
}

export const getReviewsByShopId = async (filters, shopId) => {
  return await reviewRepo.findReviewsByShopId(filters, shopId)
}

export async function updateReview({
  reviewId,
  userId,
  rating,
  content,
  images,
  existingImages = []
}) {
  const review = await reviewRepo.findById(reviewId)

  if (!review) {
    throw new AppError('Review not found', 404)
  }

  if (review.user_id.toString() !== userId) {
    throw new AppError('Permission denied', 403)
  }

  const newImageUrls = images.map((file) => file.filename)
  // merge existing filenames with newly uploaded files
  const imageUrls = Array.isArray(existingImages)
    ? [...existingImages, ...newImageUrls]
    : [...newImageUrls]

  return reviewRepo.updateById(reviewId, {
    rating,
    content,
    images: imageUrls
  })
}

export async function deleteReview(reviewId, userId) {
  const review = await reviewRepo.findById(reviewId)

  if (!review) {
    throw new AppError('Review not found', 404)
  }

  if (review.user_id.toString() !== userId) {
    throw new AppError('Permission denied', 403)
  }

  await reviewRepo.deleteById(reviewId)
}
