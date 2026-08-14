import { Report } from '../models/Report.js'

export const reportRepository = {
  async create(input: { title: string; type: string; generatedBy: string; periodStart?: Date; periodEnd?: Date; data: unknown }) {
    const report = await Report.create(input)
    return report.populate('generatedBy', 'name')
  },
  findAll(limit = 50) {
    return Report.find().sort({ createdAt: -1 }).limit(limit).populate('generatedBy', 'name')
  },
  findById(id: string) {
    return Report.findById(id).populate('generatedBy', 'name')
  },
}
