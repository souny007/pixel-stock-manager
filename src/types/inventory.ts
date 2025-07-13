
export interface Product {
  id: string
  code: string
  name: string
  unit: string
  sellPrice: number
  buyPrice: number
  minStock: number
  currentStock: number
  createdAt: Date
}

export interface SaleItem {
  productId: string
  productCode: string
  productName: string
  price: number
  quantity: number
  total: number
  note?: string
}

export interface Sale {
  id: string
  documentNumber: string
  items: SaleItem[]
  totalAmount: number
  createdAt: Date
  note?: string
}

export interface PurchaseItem {
  productId: string
  productCode: string
  productName: string
  price: number
  quantity: number
  total: number
  note?: string
}

export interface Purchase {
  id: string
  documentNumber: string
  items: PurchaseItem[]
  totalAmount: number
  createdAt: Date
  note?: string
}
