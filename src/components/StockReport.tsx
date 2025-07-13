
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { BarChart3, AlertTriangle, CheckCircle, Search, Filter } from 'lucide-react'
import { Product } from '@/types/inventory'

interface StockReportProps {
  products: Product[]
}

const StockReport = ({ products }: StockReportProps) => {
  const [sortBy, setSortBy] = useState<'high-to-low' | 'low-to-high' | 'name'>('high-to-low')
  const [filterBy, setFilterBy] = useState<'all' | 'low-stock' | 'normal'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.code.toLowerCase().includes(searchTerm.toLowerCase())
      
      if (filterBy === 'low-stock') {
        return matchesSearch && product.currentStock <= product.minStock
      } else if (filterBy === 'normal') {
        return matchesSearch && product.currentStock > product.minStock
      }
      return matchesSearch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'high-to-low':
          return b.currentStock - a.currentStock
        case 'low-to-high':
          return a.currentStock - b.currentStock
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

  const lowStockCount = products.filter(p => p.currentStock <= p.minStock).length
  const totalValue = products.reduce((sum, p) => sum + (p.currentStock * p.buyPrice), 0)
  const totalItems = products.reduce((sum, p) => sum + p.currentStock, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            รายงานสินค้าคงเหลือ
          </h2>
          <p className="text-gray-600 mt-1">ตรวจสอบปริมาณสินค้าคงเหลือและสถานะการเตือน</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">จำนวนสินค้าทั้งหมด</p>
                <p className="text-2xl font-bold text-blue-700">{products.length}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">จำนวนคงเหลือรวม</p>
                <p className="text-2xl font-bold text-green-700">{totalItems.toLocaleString()}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-red-50 to-pink-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">สินค้าใกล้หมด</p>
                <p className="text-2xl font-bold text-red-700">{lowStockCount}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-pink-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">มูลค่าคงเหลือ</p>
                <p className="text-2xl font-bold text-purple-700">฿{totalValue.toLocaleString()}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>ตัวกรองและการเรียงลำดับ</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">ค้นหาสินค้า</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="ค้นหาด้วยชื่อหรือรหัสสินค้า..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">เรียงลำดับตาม</label>
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high-to-low">จำนวนมาก → น้อย</SelectItem>
                  <SelectItem value="low-to-high">จำนวนน้อย → มาก</SelectItem>
                  <SelectItem value="name">ชื่อสินค้า A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">กรองตามสถานะ</label>
              <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  <SelectItem value="low-stock">ใกล้หมด</SelectItem>
                  <SelectItem value="normal">ปกติ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stock Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>รายการสินค้าคงเหลือ ({filteredProducts.length} รายการ)</CardTitle>
          <CardDescription>
            แสดงรายการสินค้าทั้งหมดพร้อมจำนวนคงเหลือและสถานะ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>รหัสสินค้า</TableHead>
                  <TableHead>ชื่อสินค้า</TableHead>
                  <TableHead>หน่วยนับ</TableHead>
                  <TableHead>จำนวนคงเหลือ</TableHead>
                  <TableHead>จำนวนขั้นต่ำ</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead>มูลค่า</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-mono">{product.code}</TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.unit}</TableCell>
                    <TableCell className="text-center font-bold">
                      {product.currentStock}
                    </TableCell>
                    <TableCell className="text-center">
                      {product.minStock}
                    </TableCell>
                    <TableCell>
                      {product.currentStock <= product.minStock ? (
                        <Badge variant="destructive" className="flex items-center space-x-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>ใกล้หมด</span>
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="flex items-center space-x-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>ปกติ</span>
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      ฿{(product.currentStock * product.buyPrice).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default StockReport
