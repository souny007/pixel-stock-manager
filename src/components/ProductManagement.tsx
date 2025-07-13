
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit, Plus, QrCode, Search } from 'lucide-react'
import { Product } from '@/types/inventory'
import QRScanner from './QRScanner'
import { toast } from 'sonner'

interface ProductManagementProps {
  products: Product[]
  setProducts: (products: Product[]) => void
}

const ProductManagement = ({ products, setProducts }: ProductManagementProps) => {
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [showScanner, setShowScanner] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    unit: '',
    sellPrice: '',
    buyPrice: '',
    minStock: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.code || !formData.name || !formData.unit) {
      toast.error('กรุณากรอกข้อมูลให้ครบถ้วน')
      return
    }

    const newProduct: Product = {
      id: isEditing || Date.now().toString(),
      code: formData.code,
      name: formData.name,
      unit: formData.unit,
      sellPrice: parseFloat(formData.sellPrice) || 0,
      buyPrice: parseFloat(formData.buyPrice) || 0,
      minStock: parseInt(formData.minStock) || 0,
      currentStock: isEditing ? products.find(p => p.id === isEditing)?.currentStock || 0 : 0,
      createdAt: new Date()
    }

    if (isEditing) {
      setProducts(products.map(p => p.id === isEditing ? newProduct : p))
      toast.success('แก้ไขข้อมูลสินค้าสำเร็จ')
    } else {
      setProducts([...products, newProduct])
      toast.success('เพิ่มสินค้าใหม่สำเร็จ')
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      unit: '',
      sellPrice: '',
      buyPrice: '',
      minStock: ''
    })
    setIsEditing(null)
  }

  const handleEdit = (product: Product) => {
    setFormData({
      code: product.code,
      name: product.name,
      unit: product.unit,
      sellPrice: product.sellPrice.toString(),
      buyPrice: product.buyPrice.toString(),
      minStock: product.minStock.toString()
    })
    setIsEditing(product.id)
  }

  const handleDelete = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId))
    toast.success('ลบสินค้าสำเร็จ')
  }

  const handleQRScan = (result: string) => {
    setFormData({ ...formData, code: result })
    setShowScanner(false)
    toast.success('สแกน QR Code สำเร็จ')
  }

  const filteredProducts = products.filter(product =>
    product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            จัดการข้อมูลสินค้า
          </h2>
          <p className="text-gray-600 mt-1">เพิ่ม แก้ไข และจัดการข้อมูลสินค้าในระบบ</p>
        </div>
      </div>

      {/* Add/Edit Form */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>{isEditing ? 'แก้ไขข้อมูลสินค้า' : 'เพิ่มสินค้าใหม่'}</span>
          </CardTitle>
          <CardDescription>
            กรอกข้อมูลสินค้าด้านล่าง หรือใช้ QR Scanner เพื่อเพิ่มรหัสสินค้า
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">รหัสสินค้า</Label>
              <div className="flex space-x-2">
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="กรอกรหัสสินค้า"
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setShowScanner(true)}
                  className="shrink-0"
                >
                  <QrCode className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">ชื่อสินค้า</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="กรอกชื่อสินค้า"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">หน่วยนับ</Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="เช่น ชิ้น, กิโลกรัม"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sellPrice">ราคาขาย</Label>
              <Input
                id="sellPrice"
                type="number"
                step="0.01"
                value={formData.sellPrice}
                onChange={(e) => setFormData({ ...formData, sellPrice: e.target.value })}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="buyPrice">ราคาซื้อ</Label>
              <Input
                id="buyPrice"
                type="number"
                step="0.01"
                value={formData.buyPrice}
                onChange={(e) => setFormData({ ...formData, buyPrice: e.target.value })}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minStock">จำนวนขั้นต่ำ</Label>
              <Input
                id="minStock"
                type="number"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                placeholder="0"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-3 flex space-x-2">
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {isEditing ? 'บันทึกการแก้ไข' : 'เพิ่มสินค้า'}
              </Button>
              {isEditing && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  ยกเลิก
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Search Bar */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="ค้นหาสินค้าด้วยรหัสหรือชื่อ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Products Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>รายการสินค้าทั้งหมด ({filteredProducts.length} รายการ)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>รหัสสินค้า</TableHead>
                  <TableHead>ชื่อสินค้า</TableHead>
                  <TableHead>หน่วยนับ</TableHead>
                  <TableHead>ราคาขาย</TableHead>
                  <TableHead>ราคาซื้อ</TableHead>
                  <TableHead>คงเหลือ</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead>จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-mono">{product.code}</TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.unit}</TableCell>
                    <TableCell>฿{product.sellPrice.toFixed(2)}</TableCell>
                    <TableCell>฿{product.buyPrice.toFixed(2)}</TableCell>
                    <TableCell>{product.currentStock}</TableCell>
                    <TableCell>
                      {product.currentStock <= product.minStock ? (
                        <Badge variant="destructive">ใกล้หมด</Badge>
                      ) : (
                        <Badge variant="secondary">ปกติ</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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

export default ProductManagement
