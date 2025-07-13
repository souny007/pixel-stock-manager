
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, Receipt, Calendar, DollarSign } from 'lucide-react'
import { Sale } from '@/types/inventory'

interface SalesReportProps {
  sales: Sale[]
}

const SalesReport = ({ sales }: SalesReportProps) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('all')

  // Get unique months from sales
  const availableMonths = [...new Set(sales.map(sale => {
    const date = new Date(sale.createdAt)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
  }))].sort().reverse()

  const filteredSales = selectedMonth === 'all' 
    ? sales 
    : sales.filter(sale => {
        const date = new Date(sale.createdAt)
        const saleMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        return saleMonth === selectedMonth
      })

  // Group sales by date
  const salesByDate = filteredSales.reduce((acc, sale) => {
    const date = new Date(sale.createdAt).toLocaleDateString('th-TH')
    if (!acc[date]) {
      acc[date] = {
        totalAmount: 0,
        totalQuantity: 0,
        salesCount: 0,
        sales: []
      }
    }
    acc[date].totalAmount += sale.totalAmount
    acc[date].totalQuantity += sale.items.reduce((sum, item) => sum + item.quantity, 0)
    acc[date].salesCount += 1
    acc[date].sales.push(sale)
    return acc
  }, {} as Record<string, {
    totalAmount: number
    totalQuantity: number
    salesCount: number
    sales: Sale[]
  }>)

  const totalSales = filteredSales.reduce((sum, sale) => sum + sale.totalAmount, 0)
  const totalQuantity = filteredSales.reduce((sum, sale) => 
    sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0)
  const avgSaleValue = filteredSales.length > 0 ? totalSales / filteredSales.length : 0

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
          <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            รายงานการขาย
          </h2>
          <p className="text-gray-600 mt-1">สรุปยอดขายและข้อมูลการขายรายวัน</p>
        </div>
      </div>

      {/* Month Filter */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Calendar className="w-5 h-5 text-teal-600" />
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
        <Card className="border-0 shadow-lg bg-gradient-to-r from-teal-50 to-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-teal-600">ยอดขายรวม</p>
                <p className="text-2xl font-bold text-teal-700">฿{totalSales.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-teal-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">จำนวนสินค้าที่ขาย</p>
                <p className="text-2xl font-bold text-green-700">{totalQuantity.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">จำนวนบิลขาย</p>
                <p className="text-2xl font-bold text-blue-700">{filteredSales.length}</p>
              </div>
              <Receipt className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-pink-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">ยอดขายเฉลี่ย/บิล</p>
                <p className="text-2xl font-bold text-purple-700">฿{avgSaleValue.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Sales Summary */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>สรุปยอดขายรายวัน</CardTitle>
          <CardDescription>
            แสดงยอดขายและจำนวนสินค้าที่ขายในแต่ละวัน
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
                  <TableHead>ยอดขายรวม</TableHead>
                  <TableHead>ยอดขายเฉลี่ย</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(salesByDate)
                  .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
                  .map(([date, summary]) => (
                    <TableRow key={date}>
                      <TableCell className="font-medium">{date}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{summary.salesCount} บิล</Badge>
                      </TableCell>
                      <TableCell>{summary.totalQuantity.toLocaleString()}</TableCell>
                      <TableCell className="font-bold text-teal-600">
                        ฿{summary.totalAmount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        ฿{(summary.totalAmount / summary.salesCount).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Sales */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>รายการขายล่าสุด</CardTitle>
          <CardDescription>
            แสดงรายการขายที่เกิดขึ้นล่าสุด
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
                {filteredSales
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .slice(0, 10)
                  .map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-mono">{sale.documentNumber}</TableCell>
                      <TableCell>
                        {new Date(sale.createdAt).toLocaleString('th-TH')}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{sale.items.length} รายการ</Badge>
                      </TableCell>
                      <TableCell className="font-bold text-teal-600">
                        ฿{sale.totalAmount.toLocaleString()}
                      </TableCell>
                      <TableCell>{sale.note || '-'}</TableCell>
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

export default SalesReport
