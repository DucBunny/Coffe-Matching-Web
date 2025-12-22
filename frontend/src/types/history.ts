import type { Cafe } from './cafe'

// Data required to create a new history entry
export interface CreateHistory {
  userId: string | null
  shopId: string
}

// Individual history entry
export interface HistoryEntry {
  id: string
  shopId?: string
  time: string
  cafe: Cafe
}

// Grouped history entries by date
export interface HistoryGroup {
  date: string
  items: Array<HistoryEntry>
}
