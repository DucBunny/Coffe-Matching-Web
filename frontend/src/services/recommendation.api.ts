import instance from './axios.customize.js'

export const recommendationAPI = {
  getRecommendations: async () => {
    const res = await instance.get(`/recommendation/`)
    return res.data
  },
}
