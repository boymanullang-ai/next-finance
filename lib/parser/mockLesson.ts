import { ParsedLesson } from './types'

export const mockLesson: ParsedLesson = {
  lessonId: 'acct-eq-001',
  lessonSlug: 'accounting-equation-basics',
  moduleSlug: 'balance-sheet',
  title: 'Accounting Equation Basics',
  description: 'Lengkapi komponen laporan posisi keuangan sederhana berdasarkan transaksi awal bisnis.',
  objective: 'Memahami hubungan Assets = Liabilities + Equity melalui input langsung di spreadsheet workspace.',
  difficulty: 'Beginner',
  estimatedMinutes: 12,
  revealAllowed: true,
  grid: {
    rows: 10,
    cols: 6,
    cells: {
      'A1': { value: 'Mini Case', type: 'label' },
      'A2': { value: 'Modal disetor pemilik', type: 'label' },
      'B2': { value: '100000000', type: 'locked-value' },
      'D2': { value: 'Utang bank', type: 'label' },
      'E2': { value: '40000000', type: 'locked-value' },
      'A4': { value: 'Total Assets', type: 'label' },
      'A5': { value: 'Liabilities', type: 'label' },
      'A6': { value: 'Equity', type: 'label' },
      'B4': { value: '', type: 'answer-target' },
      'B5': { value: '', type: 'answer-target' },
      'B6': { value: '', type: 'answer-target' },
    }
  },
  hintCount: 3,
  walkthroughAvailable: true,
  answerKey: [
    { cell: 'B4', expectedValue: '140000000', valueType: 'number', tolerance: 0, explanation: 'Total assets = 100jt + 40jt' },
    { cell: 'B5', expectedValue: '40000000', valueType: 'number', tolerance: 0, explanation: 'Liabilities' },
    { cell: 'B6', expectedValue: '100000000', valueType: 'number', tolerance: 0, explanation: 'Equity' },
  ],
  hints: [
    { level: 1, hintText: 'Mulai dari total aset dulu, lalu cocokkan sisi kanan persamaan.' },
    { level: 2, hintText: 'Jika modal pemilik Rp100 juta dan utang Rp40 juta, maka total aset harus Rp140 juta.' },
    { level: 3, hintText: 'Pastikan nilai akhir Assets sama dengan Liabilities + Equity.' },
  ],
  walkthrough: [
    { stepNumber: 1, explanation: 'Ambil nilai liabilities dan equity dari data kasus.' },
    { stepNumber: 2, explanation: 'Jumlahkan liabilities dan equity untuk memperoleh total assets.' },
    { stepNumber: 3, explanation: 'Masukkan angka ke cell target yang diminta.' },
  ],
  sheetSourceId: 'mock'
}
