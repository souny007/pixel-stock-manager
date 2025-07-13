
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, ShoppingCart, ShoppingBag, BarChart3, TrendingUp, TrendingDown } from 'lucide-react'
import ProductManagement from '@/components/ProductManagement'
import SalesManagement from '@/components/SalesManagement'
import PurchaseManagement from '@/components/PurchaseManagement'
import StockReport from '@/components/StockReport'
import SalesReport from '@/components/SalesReport'
import PurchaseReport from '@/components/PurchaseReport'
import { Product, Sale, Purchase } from '@/types/inventory'

const Index = () => {
  // Global state management
  const [products, setProducts] = useState<Product[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [purchases, setPurchases] = useState<Purchase[]>([])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Noobit Stock
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4">
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid grid-cols-6 w-full mb-8 bg-white/80 backdrop-blur-sm p-1 rounded-2xl shadow-lg">
            <TabsTrigger 
              value="products" 
              className="flex items-center space-x-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
            >
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">ข้อมูลสินค้า</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="sales" 
              className="flex items-center space-x-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">ขาย</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="purchases" 
              className="flex items-center space-x-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">ซื้อ</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="stock-report" 
              className="flex items-center space-x-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">คงเหลือ</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="sales-report" 
              className="flex items-center space-x-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
            >
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">รายงานขาย</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="purchase-report" 
              className="flex items-center space-x-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
            >
              <TrendingDown className="w-4 h-4" />
              <span className="hidden sm:inline">รายงานซื้อ</span>
            </TabsTrigger>
          </TabsList>

          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6">
            <TabsContent value="products" className="mt-0">
              <ProductManagement 
                products={products} 
                setProducts={setProducts} 
              />
            </TabsContent>

            <TabsContent value="sales" className="mt-0">
              <SalesManagement 
                products={products}
                sales={sales}
                setSales={setSales}
                setProducts={setProducts}
              />
            </TabsContent>

            <TabsContent value="purchases" className="mt-0">
              <PurchaseManagement 
                products={products}
                purchases={purchases}
                setPurchases={setPurchases}
                setProducts={setProducts}
              />
            </TabsContent>

            <TabsContent value="stock-report" className="mt-0">
              <StockReport products={products} />
            </TabsContent>

            <TabsContent value="sales-report" className="mt-0">
              <SalesReport sales={sales} />
            </TabsContent>

            <TabsContent value="purchase-report" className="mt-0">
              <PurchaseReport purchases={purchases} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}

export default Index
