import { useState } from 'react';
import { Button } from './components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { ProductsManager } from './components/admin/ProductsManager';
import { SalesReport } from './components/admin/SalesReport';
import { OrdersManager } from './components/admin/OrdersManager';
import { LogOut, Package, BarChart3, ShoppingCart } from 'lucide-react';
import logoImage from 'figma:asset/6023443bdc9e9831e1289e3da94eb423a42810fe.png';

interface AdminDashboardProps {
  accessToken: string;
  onLogout: () => void;
}

export function AdminDashboard({ accessToken, onLogout }: AdminDashboardProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src={logoImage} 
                alt="Acacia Water Logo" 
                className="h-12 w-auto object-contain"
              />
              <div>
                <h1 className="font-bold text-xl">Acacia Water</h1>
                <p className="text-sm text-muted-foreground">Admin Dashboard</p>
              </div>
            </div>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-3">
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Pesanan
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Produk
            </TabsTrigger>
            <TabsTrigger value="sales" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Laporan Penjualan
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-6">
            <OrdersManager accessToken={accessToken} />
          </TabsContent>

          <TabsContent value="products" className="mt-6">
            <ProductsManager accessToken={accessToken} />
          </TabsContent>

          <TabsContent value="sales" className="mt-6">
            <SalesReport accessToken={accessToken} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}