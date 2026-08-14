export interface CollectionsSummaryData {
  totalCollections: number
  estimatedLitersCollected: number
  byBin: Array<{ binName: string; binCode: string; collections: number; estimatedLiters: number }>
}

export interface Report {
  _id: string
  title: string
  type: string
  generatedBy: { _id: string; name: string } | string
  periodStart?: string
  periodEnd?: string
  data: CollectionsSummaryData
  createdAt: string
}
