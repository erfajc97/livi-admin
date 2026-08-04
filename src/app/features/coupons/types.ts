export type CouponType = 'fixed_amount' | 'percentage' | 'free_shipping'
export type CouponScope =
  | 'all_products'
  | 'specific_products'
  | 'specific_categories'

export interface Coupon {
  id: string | number
  code: string
  description: string | null
  type: CouponType
  value: number
  scope: CouponScope
  maxUses: number | null
  currentUses: number
  singleUsePerCustomer: boolean
  minOrderAmount: number | null
  isActive: boolean
  expiresAt: string | null
  products: { id: number; name: string }[]
  categories: { id: number; name: string }[]
  createdAt: string
  updatedAt: string
}

export interface CreateCouponPayload {
  code: string
  description?: string
  type: CouponType
  value: number
  scope?: CouponScope
  maxUses?: number
  singleUsePerCustomer?: boolean
  minOrderAmount?: number
  isActive?: boolean
  expiresAt?: string
  productIds?: number[]
  categoryIds?: number[]
}

export interface UpdateCouponPayload {
  code?: string
  description?: string
  type?: CouponType
  value?: number
  scope?: CouponScope
  maxUses?: number
  singleUsePerCustomer?: boolean
  minOrderAmount?: number
  isActive?: boolean
  expiresAt?: string
  productIds?: number[]
  categoryIds?: number[]
}

export interface CouponFormData {
  code: string
  description: string
  type: CouponType
  value: string
  scope: CouponScope
  maxUses: string
  singleUsePerCustomer: boolean
  minOrderAmount: string
  isActive: boolean
  expiresAt: string
}
