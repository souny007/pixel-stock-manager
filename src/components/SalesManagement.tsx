
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, QrCode, Receipt } from 'lucide-react'
import { Product, Sale, SaleItem } from '@/types/inventory'
import QRScanner from './QRScanner'
import { toast } from 'sonner'

interface SalesManagementProps {
  products: Product[]
  sales: Sale[]
  setSales: (sales: Sale[]) => void
  setProducts: (products: Product[]) => void
}

const SalesManagement = ({ products, sales, setSales, setProducts }: SalesManagementProps) => {
  const [showScanner, setShowScanner] = useState(false)
  const [saleItems, setSaleItems] = useState<SaleItem[]>([])
  const [currentItem, setCurrentItem] = useState({
    productId: '',
    price: '',
    quantity: '',
    note: ''
  })
  const [saleNote, setSaleNote] = useState('')

  const addItemToSale = () => {
    if (!currentItem.productId || !currentItem.quantity) {
      toast.error('กรุณาเลือกสินค้าและใส่จำนวน')
      return
    }

    const product = products.find(p => p.id === currentItem.productId)
    if (!product) return

    const quantity = parseInt(currentItem.quantity)
    const price = parseFloat(currentItem.price) || product.sellPrice

    if (quantity > product.currentStock) {
      toast.error('จำนวนสินค้าคงเหลือไม่เพียงพอ')
      return
    }

    const newItem: SaleItem = {
      productId: product.id,
      productCode: product.code,
      productName: product.name,
      price: price,
      quantity: quantity,
      total: price * quantity,
      note: currentItem.note
    }

    setSaleItems([...saleItems, newItem])
    setCurrentItem({
      productId: '',
      price: '',
      quantity: '',
      note: ''
    })
    toast.success('เพิ่มสินค้าในรายการขายแล้ว')
  }

  const removeItemFromSale = (index: number) => {
    setSaleItems(saleItems.filter((_, i) => i !== index))
    toast.success('ลบสินค้าจากรายการขายแล้ว')
  }

  const completeSale = () => {
    if (saleItems.length === 0) {
      toast.error('กรุณาเพิ่มสินค้าในรายการขาย')
      return
    }

    // Check stock availability
    for (const item of saleItems) {
      const product = products.find(p => p.id === item.productId)
      if (!product || product.currentStock < item.quantity) {
        toast.error(`สินค้า ${item.productName} คงเหลือไม่เพียงพอ`)
        return
      }
    }

    const documentNumber = `SAL${Date.now()}`
    const totalAmount = saleItems.reduce((sum, item) => sum + item.total, 0)

    const newSale: Sale = {
      id: Date.now().toString(),
      documentNumber,
      items: saleItems,
      totalAmount,
      createdAt: new Date(),
      note: saleNote
    }

    // Update product stock
    const updatedProducts = products.map(product => {
      const soldItem = saleItems.find(item => item.productId === product.id)
      if (soldItem) {
        return {
          ...product,
          currentStock: product.currentStock - soldItem.quantity
        }
      }
      return product
    })

    setSales([...sales, newSale])
    setProducts(updatedProducts)
    setSaleItems([])
    setSaleNote('')
    
    toast.success(`บันทึกการขายสำเร็จ เลขที่ ${documentNumber}`)
  }

  const handleQRScan = (result: string) => {
    const product = products.find(p => p.code === result)
    if (product) {
      setCurrentItem({
        ...currentItem,
        productId: product.id,
        price: product.sellPrice.toString()
      })
      toast.success(`พบสินค้า: ${product.name}`)
    } else {
      toast.error('ไม่พบสินค้าที่มีรหัสนี้')
    }
    setShowScanner(false)
  }

  const totalAmount = saleItems.reduce((sum, item) => sum + item.total, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            จัดการการขาย
          </h2>
          <p className="text-gray-600 mt-1">สร้างรายการขายสินค้าและอัพเดทสต๊อก</p>
        </div>
      </div>

      {/* Add Item Form */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>เพิ่มสินค้าในรายการขาย</span>
          </CardTitle>
          <CardDescription>
            เลือกสินค้า ใส่ราคาและจำนวน หรือใช้ QR Scanner
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label>สินค้า</Label>
              <div className="flex space-x-2">
                <Select 
                  value={currentItem.productId} 
                  onValueChange={(value) => {
                    const product = products.find(p => p.id === value)
                    setCurrentItem({
                      ...currentItem,
                      productId: value,
                      price: product?.sellPrice.toString() || ''
                    })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกสินค้า" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map(product => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.code} - {product.name} (คงเหลือ: {product.currentStock})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setShowScanner(true)}
                >
                  <QrCode className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>ราคาขาย</Label>
              <Input
                type="number"
                step="0.01"
                value={currentItem.price}
                onChange={(e) => setCurrentItem({ ...currentItem, price: e.target.value })}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label>จำนวน</Label>
              <Input
                type="number"
                value={currentItem.quantity}
                onChange={(e) => setCurrentItem({ ...currentItem, quantity: e.target.value })}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label>หมายเหตุ</Label>
              <Input
                value={currentItem.note}
                onChange={(e) => setCurrentItem({ ...currentItem, note: e.target.value })}
                placeholder="หมายเหตุ (ถ้ามี)"
              />
            </div>

            <div className="flex items-end">
              <Button 
                onClick={addItemToSale}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                เพิ่มสินค้า
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sale Items Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>รายการสินค้าที่จะขาย</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>รหัสสินค้า</TableHead>
                  <TableHead>ชื่อสินค้า</TableHead>
                  <TableHead>ราคา</TableHead>
                  <TableHead>จำนวน</TableHead>
                  <TableHead>รวม</TableHead>
                  <TableHead>หมายเหตุ</TableHead>
                  <TableHead>จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {saleItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono">{item.productCode}</TableCell>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell>฿{item.price.toFixed(2)}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell className="font-bold">฿{item.total.toFixed(2)}</TableCell>
                    <TableCell>{item.note || '-'}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeItemFromSale(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {saleItems.length > 0 && (
            <div className="mt-4 space-y-4">
              <div className="flex justify-end">
                <div className="text-right space-y-2">
                  <div className="text-2xl font-bold text-green-600">
                    ยอดรวม: ฿{totalAmount.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>หมายเหตุการขาย</Label>
                <Textarea
                  value={saleNote}
                  onChange={(e) => setSaleNote(e.target.value)}
                  placeholder="หมายเหตุสำหรับการขายนี้ (ถ้ามี)"
                  rows={3}
                />
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={completeSale}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  <Receipt className="w-4 h-4 mr-2" />
                  บันทึกการขาย
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* QR Scanner Modal */}
      {showScanner && (
        <QRScanner
          onScan={handleQRScan}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  )
}

export default SalesManagement
