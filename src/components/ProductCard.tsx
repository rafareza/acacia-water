import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { Plus, Minus, ShoppingCart, CheckCircle, XCircle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: 'galon' | 'gas';
  inStock: boolean;
  popular?: boolean;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setQuantity(1);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(price);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
      <div className="relative">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-2">
          {product.popular && (
            <Badge className="bg-orange-500 hover:bg-orange-600">
              ⭐ Populer
            </Badge>
          )}
          <Badge 
            variant={product.inStock ? "default" : "destructive"}
            className={product.inStock ? "bg-green-500 hover:bg-green-600 ml-auto" : "ml-auto"}
          >
            {product.inStock ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                Tersedia
              </>
            ) : (
              <>
                <XCircle className="h-3 w-3 mr-1" />
                Habis
              </>
            )}
          </Badge>
        </div>
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center">
              <Badge variant="secondary" className="text-lg py-2 px-4">
                Stok Habis
              </Badge>
            </div>
          </div>
        )}
      </div>

      <CardContent className="p-4 flex-grow">
        <h3 className="font-medium mb-2">{product.name}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="font-semibold text-lg text-primary">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Stock Status Info */}
        <div className="mb-3">
          {product.inStock ? (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium">Stok Tersedia - Siap Dikirim</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <XCircle className="h-4 w-4" />
              <span className="font-medium">Stok Habis - Segera Restock</span>
            </div>
          )}
        </div>

        {product.inStock && (
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm">Jumlah:</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 mt-auto">
        <Button
          className="w-full"
          onClick={handleAddToCart}
          disabled={!product.inStock}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.inStock ? 'Tambah ke Keranjang' : 'Stok Habis'}
        </Button>
      </CardFooter>
    </Card>
  );
}