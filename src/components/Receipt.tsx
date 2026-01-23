import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { 
  CheckCircle2, 
  Building2, 
  Banknote, 
  MapPin, 
  Phone, 
  User,
  MessageCircle,
  Calendar,
  Package,
  Download,
  Home
} from 'lucide-react';

interface ReceiptItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ReceiptProps {
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: ReceiptItem[];
  subtotal: number;
  total: number;
  paymentMethod: string;
  notes?: string;
  createdAt: string;
  onBackToShop: () => void;
}

export function Receipt({
  orderId,
  orderNumber,
  customerName,
  customerPhone,
  customerAddress,
  items,
  subtotal,
  total,
  paymentMethod,
  notes,
  createdAt,
  onBackToShop
}: ReceiptProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const isTransferBank = paymentMethod === 'Transfer Bank';

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-background py-8 print:bg-white print:py-0">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Success Header - Hidden when printing */}
        <div className="text-center mb-8 print:hidden">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-green-700 mb-2">Pesanan Berhasil!</h1>
          <p className="text-muted-foreground">
            Terima kasih telah berbelanja di Acacia Water
          </p>
        </div>

        {/* Receipt Card */}
        <Card className="shadow-lg print:shadow-none">
          <CardHeader className="border-b bg-primary/5 print:bg-white">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">Bukti Pembelian</CardTitle>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    <span>No. Pesanan: <span className="font-semibold text-foreground">{orderNumber}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(createdAt)}</span>
                  </div>
                </div>
              </div>
              <div className="text-right print:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Cetak
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Customer Information */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Informasi Pengiriman
              </h3>
              <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex items-start gap-3">
                  <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-muted-foreground">Nama Penerima</p>
                    <p className="font-medium">{customerName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-muted-foreground">No. Telepon</p>
                    <p className="font-medium">{customerPhone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-muted-foreground">Alamat Pengiriman</p>
                    <p className="font-medium">{customerAddress}</p>
                  </div>
                </div>
                {notes && (
                  <div className="flex items-start gap-3 pt-2 border-t">
                    <div>
                      <p className="text-muted-foreground">Catatan</p>
                      <p className="font-medium italic">{notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Order Items */}
            <div>
              <h3 className="font-semibold mb-3">Detail Pesanan</h3>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity}x {formatPrice(item.price)}
                      </p>
                    </div>
                    <p className="font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Pricing Summary */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                <span>Total Pembayaran</span>
                <span className="text-primary">{formatPrice(total)}</span>
              </div>
            </div>

            <Separator />

            {/* Payment Method */}
            <div>
              <h3 className="font-semibold mb-3">Metode Pembayaran</h3>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  {isTransferBank ? (
                    <>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Transfer Bank</p>
                        <p className="text-sm text-muted-foreground">BCA - Acacia Water</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Banknote className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Cash On Delivery</p>
                        <p className="text-sm text-muted-foreground">Bayar saat barang diterima</p>
                      </div>
                    </>
                  )}
                </div>

                {isTransferBank && (
                  <div className="space-y-3 pt-3 border-t">
                    <div className="bg-background rounded-md p-3 space-y-2">
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
                      <div className="flex justify-between text-sm pt-2 border-t">
                        <span className="text-muted-foreground">Total Transfer</span>
                        <span className="font-bold text-primary text-lg">{formatPrice(total)}</span>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-3 rounded-md border border-green-200 print:border-green-400">
                      <div className="flex items-start gap-2">
                        <MessageCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-green-900">
                            Langkah Selanjutnya:
                          </p>
                          <ol className="text-sm text-green-900 space-y-1.5 list-decimal list-inside">
                            <li>Lakukan transfer ke rekening di atas</li>
                            <li>Simpan bukti transfer Anda</li>
                            <li>Konfirmasi pembayaran via WhatsApp</li>
                          </ol>
                          <a 
                            href={`https://wa.me/6285894109114?text=Halo, saya ingin konfirmasi pembayaran untuk pesanan ${orderNumber} atas nama ${customerName} sejumlah ${formatPrice(total)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm font-medium print:hidden"
                          >
                            <MessageCircle className="h-4 w-4" />
                            Konfirmasi via WhatsApp
                          </a>
                          <p className="text-xs text-green-700 hidden print:block">
                            WhatsApp: 0858-9410-9114
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!isTransferBank && (
                  <div className="space-y-2 pt-3 border-t">
                    <p className="text-sm font-medium text-foreground mb-2">
                      Instruksi Pembayaran:
                    </p>
                    <ul className="text-sm space-y-1.5 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>Kurir kami akan menghubungi Anda sebelum pengantaran</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>Siapkan uang pas sejumlah <span className="font-semibold text-foreground">{formatPrice(total)}</span></span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>Pembayaran dilakukan saat barang diterima</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-sm print:border-blue-400">
              <p className="font-semibold text-blue-900 mb-2">Informasi Penting:</p>
              <ul className="space-y-1 text-blue-900">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>Area layanan: Cluster Acacia</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>Estimasi pengiriman: 30-60 menit</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>Jam operasional: 08:00 - 17:00 setiap hari</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>Hubungi CS: 0858-9410-9114</span>
                </li>
              </ul>
            </div>

            {/* Actions - Hidden when printing */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 print:hidden">
              <Button
                onClick={onBackToShop}
                className="flex-1 gap-2"
                size="lg"
              >
                <Home className="h-4 w-4" />
                Kembali ke Beranda
              </Button>
              <Button
                onClick={handlePrint}
                variant="outline"
                className="flex-1 gap-2"
                size="lg"
              >
                <Download className="h-4 w-4" />
                Cetak Bukti
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer Note - Hidden when printing */}
        <div className="text-center mt-6 text-sm text-muted-foreground print:hidden">
          <p>Simpan bukti pembelian ini untuk referensi Anda</p>
        </div>
      </div>
    </div>
  );
}