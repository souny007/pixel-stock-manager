
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingDown, Package, Calendar, DollarSign } from 'lucide-react'
import { Purchase } from '@/types/inventory'

interface PurchaseReportProps {
  purchases: Purchase[]
}

const PurchaseReport = ({ purchases }: PurchaseReportProps) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('all')

  // Get unique months from purchases
  const availableMonths = [...new Set(purchases.map(purchase => {
    const date = new Date(purchase.createdAt)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
  }))].sort().reverse()

  const filteredPurchases = selectedMonth === 'all' 
    ? purchases 
    : purchases.filter(purchase => {
        const date = new Date(purchase.createdAt)
        const purchaseMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        return purchaseMonth === selectedMonth
      })

  // Group purchases by date
  const purchasesByDate = filteredPurchases.reduce((acc, purchase) => {
    const date = new Date(purchase.createdAt).toLocaleDateString('th-TH')
    if (!acc[date]) {
      acc[date] = {
        totalAmount: 0,
        totalQuantity: 0,
        purchasesCount: 0,
        purchases: []
      }
    }
    acc[date].totalAmount += purchase.totalAmount
    acc[date].totalQuantity += purchase.items.reduce((sum, item) => sum + item.quantity, 0)
    acc[date].purchasesCount += 1
    acc[date].purchases.push(purchase)
    return acc
  }, {} as Record<string, {
    totalAmount: number
    totalQuantity: number
    purchasesCount: number
    purchases: Purchase[]
  }>)

  const totalPurchases = filteredPurchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0)
  const totalQuantity = filteredPurchases.reduce((sum, purchase) => 
    sum + purchase.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0)
  const avgPurchaseValue = filteredPurchases.length > 0 ? totalPurchases / filteredPurchases.length : 0

  const formatMonth = (monthString: string) => {
    const [year, month] = monthString.split('-')
    const monthNames = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ]
    return `${monthNames[parseInt(month) - 1]} ${parseInt(year) + 543}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            รายงานการซื้อ
          </h2>
          <p className="text-gray-600 mt-1">สรุปยอดซื้อและข้อมูลการซื้อรายวัน</p>
        </div>
      </div>

      {/* Month Filter */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <div className="flex-1">
              <label className="text-sm font-medium">เลือกเดือน</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-full max-w-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกเดือน</SelectItem>
                  {availableMonths.map(month => (
                    <SelectItem key={month} value={month}>
                      {formatMonth(month)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-600">ยอดซื้อรวม</p>
                <p className="text-2xl font-bold text-indigo-700">฿{totalPurchases.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">จำนวนสินค้าที่ซื้อ</p>
                <p className="text-2xl font-bold text-blue-700">{totalQuantity.toLocaleString()}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-pink-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">จำนวนบิลซื้อ</p>
                <p className="text-2xl font-bold text-purple-700">{filteredPurchases.length}</p>
              </div>
              <Package className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-pink-50 to-red-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-pink-600">ยอดซื้อเฉลี่ย/บิล</p>
                <p className="text-2xl font-bold text-pink-700">฿{avgPurchaseValue.toLocaleString()}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-pink-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Purchase Summary */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>สรุปยอดซื้อรายวัน</CardTitle>
          <CardDescription>
            แสดงยอดซื้อและจำนวนสินค้าที่ซื้อในแต่ละวัน
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>วันที่</TableHead>
                  <TableHead>จำนวนบิล</TableHead>
                  <TableHead>จำนวนสินค้า</TableHead>
                  <TableHead>ยอดซื้อรวม</TableHead>
                  <TableHead>ยอดซื้อเฉลี่ย</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(purchasesByDate)
                  .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
                  .map(([date, summary]) => (
                    <TableRow key={date}>
                      <TableCell className="font-medium">{date}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{summary.purchasesCount} บิล</Badge>
                      </TableCell>
                      <TableCell>{summary.totalQuantity.toLocaleString()}</TableCell>
                      <TableCell className="font-bold text-indigo-600">
                        ฿{summary.totalAmount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        ฿{(summary.totalAmount / summary.purchasesCount).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Purchases */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>รายการซื้อล่าสุด</CardTitle>
          <CardDescription>
            แสดงรายการซื้อที่เกิดขึ้นล่าสุด
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>เลขที่บิล</TableHead>
                  <TableHead>วันที่</TableHead>
                  <TableHead>จำนวนรายการ</TableHead>
                  <TableHead>ยอดรวม</TableHead>
                  <TableHead>หมายเหตุ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPurchases
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .slice(0, 10)
                  .map((purchase) => (
                    <TableRow key={purchase.id}>
                      <TableCell className="font-mono">{purchase.documentNumber}</TableCell>
                      <TableCell>
                        {new Date(purchase.createdAt).toLocaleString('th-TH')}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{purchase.items.length} รายการ</Badge>
                      </TableCell>
                      <TableCell className="font-bold text-indigo-600">
                        ฿{purchase.totalAmount.toLocaleString()}
                      </TableCell>
                      <TableCell>{purchase.note || '-'}</TableCell>
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

export default PurchaseReport
