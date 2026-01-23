import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ProductCard, type Product } from './components/ProductCard';
import { Cart, type CartItem } from './components/Cart';
import { PaymentModal } from './components/PaymentModal';
import { Receipt } from './components/Receipt';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';
import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { 
  Truck, 
  Clock, 
  Shield, 
  Phone, 
  MapPin, 
  Star,
  CheckCircle,
  Droplet,
  Flame
} from 'lucide-react';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { toast, Toaster } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from './utils/supabase/info';
import galonGasImage from 'figma:asset/986d38c78f6564c8a6f9486da2feab7f800b6ac7.png';
import logoImage from 'figma:asset/6023443bdc9e9831e1289e3da94eb423a42810fe.png';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'shop' | 'admin' | 'admin-dashboard' | 'receipt'>('shop');
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [orderData, setOrderData] = useState<any>(null);

  // Check URL for admin route
  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('/admin')) {
      const token = localStorage.getItem('adminToken');
      if (token) {
        setAdminToken(token);
        setCurrentPage('admin-dashboard');
      } else {
        setCurrentPage('admin');
      }
    }
  }, []);

  // Fetch products from database on mount
  useEffect(() => {
    if (currentPage === 'shop') {
      fetchProducts();
    }
  }, [currentPage]);

  const defaultProducts: Product[] = [
    {
      id: '1',
      name: 'Galon Air Aqua 19L',
      description: 'Air mineral berkualitas tinggi, higienis dan segar untuk kebutuhan sehari-hari',
      price: 21000,
      image: 'https://images.unsplash.com/photo-1739200445580-b32f168899a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlciUyMGdhbGxvbiUyMGRpc3BlbnNlcnxlbnwxfHx8fDE3NTY2NDQyNTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'galon',
      inStock: true,
      popular: true,
    },
    {
      id: '2',
      name: 'Tabung Gas 3kg',
      description: 'Tabung gas LPG 3kg untuk kebutuhan memasak rumah tangga, aman dan berkualitas',
      price: 23000,
      image: 'https://images.unsplash.com/photo-1596465664095-f1f622965562?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYXMlMjBjeWxpbmRlciUyMHRhbmt8ZW58MXx8fHwxNzU2NjQ0MjU1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'gas',
      inStock: true,
      popular: true,
    },
    {
      id: '3',
      name: 'Galon Air Isi Ulang',
      description: 'Galon isi ulang ekonomis untuk kebutuhan sehari-hari, hemat dan praktis',
      price: 6000,
      image: 'https://images.unsplash.com/photo-1739200445580-b32f168899a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYXRlciUyMGdhbGxvbiUyMGRpc3BlbnNlcnxlbnwxfHx8fDE3NTY2NDQyNTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'galon',
      inStock: true,
    },
    {
      id: '4',
      name: 'Tabung Gas 12kg',
      description: 'Tabung gas LPG 12kg untuk kebutuhan komersial dan rumah tangga besar',
      price: 217000,
      image: 'https://images.unsplash.com/photo-1596465664095-f1f622965562?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYXMlMjBjeWxpbmRlciUyMHRhbmt8ZW58MXx8fHwxNzU2NjQ0MjU1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'gas',
      inStock: true,
    },
    {
      id: '5',
      name: 'Galon Air Vit',
      description: 'Air mineral dengan harga ekonomis dan segar untuk kebutuhan sehari-hari',
      price: 17000,
      image: 'https://images.unsplash.com/photo-1739200445580-b32f168899a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYXRlciUyMGdhbGxvbiUyMGRpc3BlbnNlcnxlbnwxfHx8fDE3NTY2NDQyNTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'galon',
      inStock: true,
      popular: true,
    },
    {
      id: '6',
      name: 'Tabung Gas 5.5kg',
      description: 'Tabung gas LPG 5.5kg cocok untuk kebutuhan menengah',
      price: 110000,
      image: 'https://images.unsplash.com/photo-1596465664095-f1f622965562?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYXMlMjBjeWxpbmRlciUyMHRhbmt8ZW58MXx8fHwxNzU2NjQ0MjU1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'gas',
      inStock: true,
    },
  ];

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-19737827/products`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch products');

      const data = await response.json();
      
      // If there are products in database, use them, otherwise use default products
      if (data.products && data.products.length > 0) {
        setProducts(data.products);
      } else {
        // Default products as fallback
        setProducts(defaultProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      // Use default products on error
      setProducts(defaultProducts);
    }
  };

  const handleAdminLogin = (token: string) => {
    localStorage.setItem('adminToken', token);
    setAdminToken(token);
    setCurrentPage('admin-dashboard');
    window.history.pushState({}, '', '/admin');
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    setAdminToken(null);
    setCurrentPage('shop');
    window.history.pushState({}, '', '/');
  };

  const handleAddToCart = (product: Product, quantity: number) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    toast.success(`${product.name} ditambahkan ke keranjang`);
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    toast.success('Item dihapus dari keranjang');
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = (data: any) => {
    setCartItems([]);
    setOrderData(data);
    setCurrentPage('receipt');
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const filteredProducts = (category: string) => {
    if (category === 'all') return products;
    return products.filter(product => product.category === category);
  };

  // Show admin pages
  if (currentPage === 'admin') {
    return (
      <>
        <AdminLogin onLoginSuccess={handleAdminLogin} />
        <Toaster position="top-right" />
      </>
    );
  }

  if (currentPage === 'admin-dashboard' && adminToken) {
    return (
      <>
        <AdminDashboard accessToken={adminToken} onLogout={handleAdminLogout} />
        <Toaster position="top-right" />
      </>
    );
  }

  if (currentPage === 'receipt' && orderData) {
    const order = orderData.order;
    
    // Generate user-friendly order number from the ID
    const orderNumber = order.id.replace('order:', '').substring(0, 8).toUpperCase();
    
    return (
      <>
        <Receipt 
          orderId={order.id}
          orderNumber={orderNumber}
          customerName={order.customerName}
          customerPhone={order.customerPhone}
          customerAddress={order.customerAddress}
          items={order.items}
          subtotal={order.subtotal}
          total={order.total}
          paymentMethod={order.paymentMethod}
          notes={order.notes}
          createdAt={order.createdAt}
          onBackToShop={() => {
            setCurrentPage('shop');
            setOrderData(null);
            window.scrollTo(0, 0);
          }}
        />
        <Toaster position="top-right" />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        cartItems={cartItemCount} 
        onCartClick={() => setIsCartOpen(true)} 
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-16 bg-[rgba(44,94,219,0.91)]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Galon & Gas
                <br />
                <span className="text-yellow-300">Antar Cepat!</span>
              </h1>
              <p className="text-xl mb-6 opacity-90">
                Layanan antar galon air dan tabung gas terpercaya dengan kualitas terbaik 
                dari Acacia Water
              </p>
            </div>
            <div className="relative">
              <img
                src={galonGasImage}
                alt="Galon Air dan Tabung Gas"
                className="rounded-lg shadow-2xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                icon: Truck,
                title: 'Antar Cepat',
                description: 'Pengantaran 30-60 menit'
              },
              {
                icon: Clock,
                title: '24 Jam',
                description: 'Layanan sepanjang hari'
              },
              {
                icon: Shield,
                title: 'Terpercaya',
                description: 'Produk berkualitas tinggi'
              },
              {
                icon: Star,
                title: 'Rating 4.9',
                description: 'Kepuasan pelanggan terjamin'
              }
            ].map((feature, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <feature.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Produk Kami</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Pilihan lengkap galon air berkualitas dan tabung gas untuk kebutuhan rumah tangga Anda
            </p>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-8">
              <TabsTrigger value="all">Semua</TabsTrigger>
              <TabsTrigger value="galon" className="flex items-center gap-2">
                <Droplet className="h-4 w-4" />
                Galon
              </TabsTrigger>
              <TabsTrigger value="gas" className="flex items-center gap-2">
                <Flame className="h-4 w-4" />
                Gas
              </TabsTrigger>
            </TabsList>

            {['all', 'galon', 'gas'].map((category) => (
              <TabsContent key={category} value={category}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts(category).map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Layanan Kami</h2>
            <p className="text-muted-foreground">
              Komitmen kami untuk memberikan pelayanan terbaik
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                title: 'Pengantaran Express',
                description: 'Layanan antar kilat dalam 30 menit untuk area tertentu',
                features: ['Prioritas tinggi', 'Tracking real-time', 'Gratis ongkir minimum order']
              },
              {
                title: 'Paket Berlangganan',
                description: 'Hemat lebih banyak dengan paket langganan bulanan',
                features: ['Diskon hingga 15%', 'Jadwal antar tetap', 'Prioritas stok']
              }
            ].map((service, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Hubungi Kami</h2>
            <p className="text-muted-foreground">
              Tim customer service kami siap membantu Anda 24/7
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center">
              <CardContent className="p-6">
                <Phone className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Telepon</h3>
                <p className="text-muted-foreground">0858-9410-9114</p>
                <p className="text-sm text-muted-foreground">Senin - Minggu</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <MapPin className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Alamat</h3>
                <p className="text-muted-foreground">Perum Harapan Mulya Regency</p>
                <p className="text-sm text-muted-foreground">Cluster Acacia Blok CA 23 NO 08</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Clock className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Jam Operasional</h3>
                <p className="text-muted-foreground">08:00 - 17:00</p>
                <p className="text-sm text-muted-foreground">Setiap Hari</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <img 
                src={logoImage} 
                alt="Acacia Water Logo" 
                className="h-16 w-auto object-contain"
              />
            </div>
            <p className="opacity-75 mb-4">
              Melayani kebutuhan galon air dan tabung gas berkualitas untuk rumah tangga dan bisnis Anda.
            </p>
            <div className="flex items-center justify-center gap-4 mb-4">
              <button
                onClick={() => {
                  setCurrentPage('admin');
                  window.history.pushState({}, '', '/admin');
                }}
                className="text-sm opacity-50 hover:opacity-100 transition-opacity underline"
              >
                Admin Login
              </button>
            </div>
            <p className="text-sm opacity-50">
              © 2025 Acacia Water. Semua hak dilindungi.
            </p>
          </div>
        </div>
      </footer>

      {/* Components */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        items={cartItems}
        total={cartTotal}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <Toaster position="top-right" />
    </div>
  );
}