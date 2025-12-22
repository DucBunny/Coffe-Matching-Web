import type { Shop } from './shop'

export interface History {
  userId: string | null
  shopId: string
}

// Individual history entry
export interface HistoryEntry {
  id: string
  shopId?: string
  time: string
  shop: Shop
}

// Grouped history entries by date
export interface HistoryGroup {
  date: string
  items: Array<HistoryEntry>
}
