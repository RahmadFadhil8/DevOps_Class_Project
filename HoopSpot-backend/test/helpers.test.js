const test = require('node:test')
const assert = require('node:assert')
const { hitungHarga, hitungJamSelesai, tanggalValid, emailValid } = require('../helpers')

test('hitungHarga harus menghitung sewa dan total biaya dengan benar', () => {
  const result = hitungHarga(300000, 90)
  assert.strictEqual(result.sewa, 450000)
  assert.strictEqual(result.layanan, 5000)
  assert.strictEqual(result.total, 455000)
})

test('hitungJamSelesai harus menghitung waktu selesai berdasarkan durasi', () => {
  assert.strictEqual(hitungJamSelesai('16:00', 120), '18:00')
  assert.strictEqual(hitungJamSelesai('08:00', 90), '09:30')
})

test('tanggalValid harus memvalidasi tanggal kalender yang sah', () => {
  assert.strictEqual(tanggalValid('2026-12-31'), true)
  assert.strictEqual(tanggalValid('2026-02-31'), false)
  assert.strictEqual(tanggalValid('bukan-tanggal'), false)
})

test('emailValid harus mengenali format email valid dan invalid', () => {
  assert.strictEqual(emailValid('admin@hoopspot.com'), true)
  assert.strictEqual(emailValid('rahmad@example.com'), true)
  assert.strictEqual(emailValid('rahmad-tanpa-domain'), false)
  assert.strictEqual(emailValid(''), false)
})

