
"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { useCart } from "@/components/cart/CartProvider";

type AddToCartButtonProps = {
  productId: string;
  name: string;
  slug: string;
  price: number;
  image?: string;
  stock: number;
  sizes: string[];
  colors: string[];
};

export default function AddToCartButton({
  productId,
  name,
  slug,
  price,
  image,
  stock,
  sizes,
  colors,
}: AddToCartButtonProps) {
  const { items, addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [selectedColor, setSelectedColor] = useState<string | undefined>();

  const existingItem = items.find(
    (item) =>
      item.productId === productId &&
      item.size === selectedSize &&
      item.color === selectedColor
  );

  const currentQuantity = existingItem?.quantity ?? 0;
  const remainingStock = Math.max(stock - currentQuantity, 0);

  const isOutOfStock = stock <= 0;
  const isLimitReached = remainingStock <= 0;

  const sizeRequired = sizes.length > 0;
  const colorRequired = colors.length > 0;

  const selectionMissing =
    (sizeRequired && !selectedSize) ||
    (colorRequired && !selectedColor);

  function decreaseQuantity() {
    setQuantity((current) => Math.max(1, current - 1));
  }

  function increaseQuantity() {
    setQuantity((current) =>
      Math.min(current + 1, remainingStock)
    );
  }

  function handleAddToCart() {
    if (isOutOfStock || isLimitReached) return;

    if (sizeRequired && !selectedSize) {
      alert("Please select a size.");
      return;
    }

    if (colorRequired && !selectedColor) {
      alert("Please select a color.");
      return;
    }

    if (quantity > remainingStock) {
      alert("You cannot add more than the available stock.");
      return;
    }

    addToCart({
      productId,
      name,
      slug,
      price,
      image,
      quantity,
      size: selectedSize,
      color: selectedColor,
    });

    setQuantity(1);

    alert("Product added to cart.");
  }

  if (isOutOfStock) {
    return (
      <div className="w-full sm:w-auto">
        <Button type="button" disabled>
          Out of Stock
        </Button>
      </div>
    );
  }

  if (isLimitReached) {
    return (
      <div className="w-full sm:w-auto">
        <Button type="button" disabled>
          Stock Limit Reached
        </Button>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Size Selection */}
      {sizes.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold">Select Size</h2>

          <div className="mt-3 flex flex-wrap gap-3">
            {sizes.map((size) => {
              const isSelected = selectedSize === size;

              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`rounded-lg border px-6 py-3 text-sm font-medium transition ${
                    isSelected
                      ? "border-black bg-black text-white"
                      : "border-gray-300 bg-white text-gray-900 hover:border-black"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Color Selection */}
      {colors.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold">Select Color</h2>

          <div className="mt-3 flex flex-wrap gap-3">
            {colors.map((color) => {
              const isSelected = selectedColor === color;

              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`rounded-lg border px-5 py-3 text-sm font-medium transition ${
                    isSelected
                      ? "border-black bg-black text-white"
                      : "border-gray-300 bg-white text-gray-900 hover:border-black"
                  }`}
                >
                  {color}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div>
        <h2 className="text-sm font-semibold">Quantity</h2>

        <div className="mt-3 flex w-fit items-center rounded-full border border-gray-300">
          <button
            type="button"
            onClick={decreaseQuantity}
            disabled={quantity <= 1}
            className="flex h-12 w-12 items-center justify-center rounded-full text-xl transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Decrease quantity"
          >
            −
          </button>

          <span className="min-w-12 text-center text-sm font-semibold">
            {quantity}
          </span>

          <button
            type="button"
            onClick={increaseQuantity}
            disabled={quantity >= remainingStock}
            className="flex h-12 w-12 items-center justify-center rounded-full text-xl transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex w-full flex-col gap-3 sm:flex-row">
        <Button
          type="button"
          onClick={handleAddToCart}
          disabled={selectionMissing}
        >
          Add to Cart
        </Button>

        <Button
          type="button"
          variant="secondary"
          disabled={selectionMissing}
        >
          Buy Now
        </Button>
      </div>
    </div>
  );
}