export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data: T | null
  errors: Record<string, string[]> | string | null
}

export interface AlatKategori {
  alat_kategori_id: number
  alat_kategori_nama: string
  alat_kategori_deskripsi: string | null
}

export interface Alat {
  alat_id: number
  alat_kategori_id: number
  alat_nama: string
  alat_deskripsi: string | null
  alat_harga_sewa_perhari: number
  alat_stok: number
}

export interface User {
  user_id: number
  username: string
  email: string
  password: string
  created_at: string
}