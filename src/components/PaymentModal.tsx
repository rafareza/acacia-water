import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Building2, MapPin, Banknote, MessageCircle, CheckCircle2, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import type { CartItem } from './Cart';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  onPaymentSuccess: (orderData: any) => void;
}

export function PaymentModal({ isOpen, onClose, items, total, onPaymentSuccess }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    notes: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(price);
  };

  const handleConfirmClick = () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      toast.error('Mohon lengkapi informasi pengiriman');
      return;
    }
    setShowConfirmDialog(true);
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      const subtotal = total;
      const grandTotal = subtotal;
      
      // Save order to database
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-19737827/orders`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            customerName: customerInfo.name,
            customerPhone: customerInfo.phone,
            customerAddress: customerInfo.address,
            items: items.map(item => ({
              id: item.id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
            })),
            subtotal: subtotal,
            total: grandTotal,
            paymentMethod: paymentMethod === 'bank' ? 'Transfer Bank' : 'Cash On Delivery',
            notes: customerInfo.notes || undefined,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const orderData = await response.json();
      setIsProcessing(false);
      
      if (paymentMethod === 'bank') {
        toast.success('Pesanan dikonfirmasi! Silakan lakukan transfer dan konfirmasi via WhatsApp ke 0858-9410-9114');
      } else {
        toast.success('Pesanan dikonfirmasi! Kurir akan menghubungi Anda segera.');
      }
      
      onPaymentSuccess(orderData);
      onClose();
      
      // Reset form
      setCustomerInfo({
        name: '',
        phone: '',
        address: '',
        notes: '',
      });
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Gagal membuat pesanan. Silakan coba lagi.');
      setIsProcessing(false);
    }
  };

  const paymentMethods = [
    { id: 'bank', name: 'Transfer Bank', icon: Building2 },
    { id: 'cod', name: 'Cash On Delivery', icon: Banknote },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Checkout Pesanan</DialogTitle>
          <DialogDescription>
            Lengkapi informasi pengiriman dan pilih metode pembayaran untuk menyelesaikan pesanan Anda.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ringkasan Pesanan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity}x {formatPrice(item.price)}
                      </p>
                    </div>
                    <p className="font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
                
                <Separator />
                
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Informasi Pengiriman
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input
                    id="name"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">No. Telepon</Label>
                  <Input
                    id="phone"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Contoh: 08123456789"
                  />
                </div>
                
                <div>
                  <Label htmlFor="address">Alamat Lengkap</Label>
                  <Textarea
                    id="address"
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Jalan, No. Rumah, RT/RW, Kelurahan, Kecamatan"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="notes">Catatan (Opsional)</Label>
                  <Textarea
                    id="notes"
                    value={customerInfo.notes}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Catatan tambahan untuk kurir"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Method */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Metode Pembayaran</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  {/* Transfer Bank */}
                  <div className="relative">
                    <RadioGroupItem value="bank" id="bank" className="peer sr-only" />
                    <Label
                      htmlFor="bank"
                      className="flex flex-col cursor-pointer rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <Building2 className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Transfer Bank</p>
                            <p className="text-sm text-muted-foreground">BCA - Acacia Water</p>
                          </div>
                        </div>
                        {paymentMethod === 'bank' && (
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      
                      {paymentMethod === 'bank' && (
                        <div className="space-y-3 pt-3 border-t">
                          <div className="bg-muted/50 p-3 rounded-md space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Bank</span>
                              <span className="font-medium">BCA</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">No. Rekening</span>
                              <span className="font-medium">5211687666</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Atas Nama</span>
                              <span className="font-medium">Rafa Rezandrya Jaelani</span>
                            </div>
                          </div>
                          
                          <div className="bg-green-50 p-3 rounded-md border border-green-200">
                            <div className="flex items-start gap-2">
                              <MessageCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <div className="space-y-2">
                                <p className="text-sm font-medium text-green-900">
                                  Setelah transfer, konfirmasi via WhatsApp
                                </p>
                                <a 
                                  href="https://wa.me/6285894109114" 
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 bg-green-600 text-white px-3 py-1.5 rounded-md hover:bg-green-700 transition-colors text-sm"
                                >
                                  <MessageCircle className="h-3.5 w-3.5" />
                                  0858-9410-9114
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Label>
                  </div>

                  {/* Cash on Delivery */}
                  <div className="relative">
                    <RadioGroupItem value="cod" id="cod" className="peer sr-only" />
                    <Label
                      htmlFor="cod"
                      className="flex flex-col cursor-pointer rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <Banknote className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Cash On Delivery</p>
                            <p className="text-sm text-muted-foreground">Bayar saat barang diterima</p>
                          </div>
                        </div>
                        {paymentMethod === 'cod' && (
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      
                      {paymentMethod === 'cod' && (
                        <div className="space-y-2 pt-3 border-t">
                          <p className="text-sm text-muted-foreground">
                            Pembayaran tunai langsung kepada kurir saat barang diterima.
                          </p>
                          <ul className="text-sm space-y-1.5 text-muted-foreground">
                            <li className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></div>
                              Kurir akan menghubungi sebelum pengantaran
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></div>
                              Siapkan uang pas untuk memudahkan transaksi
                            </li>
                          </ul>
                        </div>
                      )}
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Button
              className="w-full mt-4"
              onClick={handleConfirmClick}
              disabled={isProcessing}
              size="lg"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Memproses...
                </>
              ) : (
                <>
                  {paymentMethod === 'bank' ? (
                    <Building2 className="h-4 w-4 mr-2" />
                  ) : (
                    <Banknote className="h-4 w-4 mr-2" />
                  )}
                  Konfirmasi Pesanan - {formatPrice(total)}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Confirmation Dialog */}
        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                Konfirmasi Pesanan
              </AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin membeli item berikut?
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="space-y-4 py-4">
              {/* Item List */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Jumlah: {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <p className="font-semibold text-primary">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Total */}
              <div className="flex justify-between items-center font-semibold text-lg">
                <span>Total Pembayaran:</span>
                <span className="text-primary">{formatPrice(total)}</span>
              </div>

              {/* Payment Method Info */}
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-900">
                  Metode Pembayaran: <span className="font-semibold">{paymentMethod === 'bank' ? 'Transfer Bank' : 'Cash On Delivery'}</span>
                </p>
              </div>
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowConfirmDialog(false)}>
                Batal
              </AlertDialogCancel>
              <AlertDialogAction onClick={handlePayment} disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Memproses...
                  </>
                ) : (
                  'Ya, Saya Yakin'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
}