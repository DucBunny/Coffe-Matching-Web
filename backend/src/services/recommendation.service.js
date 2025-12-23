import * as shopRepo from '@/repositories/shop.repository.js'
import * as historyRepo from '@/repositories/history.repository.js'
import * as favoriteRepo from '@/repositories/favorite.repository.js'
import * as userRepo from '@/repositories/user.repository.js'
import { STYLE_TO_TAGS_MAP } from '@/utils/recommendation-map.js'

export async function getRecommendations(userId) {
  // 1. Lấy toàn bộ dữ liệu cần thiết
  // Chạy song song để tối ưu thời gian
  const [allShops, favoriteShopIds, recentHistory, selectedStyles] =
    await Promise.all([
      shopRepo.getAllShops(),
      userId
        ? favoriteRepo.getFavoriteShopIdsByUserId(userId)
        : Promise.resolve([]),
      userId ? historyRepo.getRecentHistory(userId, 7) : Promise.resolve([]),
      userId ? userRepo.getAllStylesByUserId(userId) : Promise.resolve([])
    ])

  // 2. Xây dựng "Hồ sơ sở thích ngầm" (Implicit Profile)
  // Dựa trên history và favorite
  const userPreferredTags = _buildImplicitProfile(
    allShops,
    favoriteShopIds,
    recentHistory
  )

  // 3. Tính điểm cho từng quán
  const scoredShops = allShops.map((shop) => {
    const score = _calculateShopScore(shop, selectedStyles, userPreferredTags)
    return { ...shop, score } // Gắn điểm vào shop
  })

  // 4. Lọc và Sắp xếp
  return scoredShops
    .filter((shop) => shop.score > 0) // Chỉ lấy quán có điểm
    .sort((a, b) => b.score - a.score) // Điểm cao xếp trước
    .slice(0, 10) // Lấy top 10
}

// --- Helper: Xây dựng profile ngầm từ lịch sử & yêu thích ---
function _buildImplicitProfile(allShops, favoriteShopIds, recentHistory) {
  const historyShopIds = recentHistory.map((h) => h.shop_id.toString())

  // Gom tất cả ID quán user quan tâm (Favorite + History)
  const interestedIds = new Set([...favoriteShopIds, ...historyShopIds])

  const interestedShops = allShops.filter((s) =>
    interestedIds.has(s._id.toString())
  )
  const tagFrequency = {}

  // Đếm tần suất xuất hiện của các tag
  interestedShops.forEach((shop) => {
    const tags = [...(shop.purpose || []), ...(shop.amenities || [])]
    tags.forEach((tag) => {
      tagFrequency[tag] = (tagFrequency[tag] || 0) + 1
    })
  })

  // Trả về mảng các tag xuất hiện ít nhất 1 lần (có thể tăng ngưỡng nếu cần)
  return Object.keys(tagFrequency).filter((tag) => tagFrequency[tag] >= 1)
}

// --- Helper: Hàm tính điểm cốt lõi ---
function _calculateShopScore(shop, selectedStyles, preferredTags) {
  let score = 0
  // Gom tag của shop để tìm kiếm O(1)
  const shopTags = new Set([...(shop.purpose || []), ...(shop.amenities || [])])

  // Dựa trên style user đang chọn (+ 10)
  if (selectedStyles && selectedStyles.length > 0) {
    selectedStyles.forEach((style) => {
      const config = STYLE_TO_TAGS_MAP[style]
      if (!config) return

      if (config.purpose) {
        config.purpose.forEach((p) => {
          if (shopTags.has(p)) score += 10
        })
      }
      if (config.amenities) {
        config.amenities.forEach((a) => {
          if (shopTags.has(a)) score += 10
        })
      }
    })
  }

  // Dựa trên thói quen quá khứ: yêu thích + lịch sử (+ 2)
  preferredTags.forEach((tag) => {
    if (shopTags.has(tag)) {
      score += 2
    }
  })

  return score
}
