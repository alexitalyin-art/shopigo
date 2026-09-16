
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Product = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  sizes: string[];
  colors: string[];
  stock: number;
  sku?: string;
  isActive: boolean;
  isFeatured: boolean;
};

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState("");

  const [currentImage, setCurrentImage] = useState("");
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [newImagePreview, setNewImagePreview] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    compareAtPrice: "",
    category: "",
    sizes: "",
    colors: "",
    stock: "",
    sku: "",
    isActive: true,
    isFeatured: false,
  });

  // Load product
  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);

        const response = await fetch(`/api/products/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load product."
          );
        }

        const product: Product = data.product;

        setFormData({
          name: product.name || "",
          slug: product.slug || "",
          description: product.description || "",
          price: product.price?.toString() || "",
          compareAtPrice:
            product.compareAtPrice?.toString() || "",
          category: product.category || "",
          sizes: product.sizes?.join(", ") || "",
          colors: product.colors?.join(", ") || "",
          stock: product.stock?.toString() || "",
          sku: product.sku || "",
          isActive: product.isActive,
          isFeatured: product.isFeatured,
        });

        setCurrentImage(product.images?.[0] || "");
      } catch (error) {
        console.error(error);

        setMessage(
          error instanceof Error
            ? error.message
            : "Failed to load product."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value, type } = event.target;

    if (type === "checkbox") {
      const checked = (event.target as HTMLInputElement).checked;

      setFormData((current) => ({
        ...current,
        [name]: checked,
      }));

      return;
    }

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setMessage("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image must be smaller than 5 MB.");
      return;
    }

    setNewImageFile(file);
    setNewImagePreview(URL.createObjectURL(file));
    setMessage("");
  }

  async function uploadNewImage(): Promise<string | null> {
    if (!newImageFile) {
      return null;
    }

    setUploadingImage(true);
    setMessage("");

    try {
      const formData = new FormData();

      formData.append("file", newImageFile);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to upload image."
        );
      }

      return data.image.secure_url;
    } catch (error) {
      console.error("IMAGE UPLOAD ERROR:", error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to upload image."
      );

      return null;
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");

      let imageUrl = currentImage;

      // Upload new image if selected
      if (newImageFile) {
        const uploadedUrl = await uploadNewImage();

        if (!uploadedUrl) {
          setSaving(false);
          return;
        }

        imageUrl = uploadedUrl;
      }

      const productData = {
        name: formData.name.trim(),
        slug: formData.slug.trim().toLowerCase(),
        description: formData.description.trim(),

        price: Number(formData.price),

        compareAtPrice: formData.compareAtPrice
          ? Number(formData.compareAtPrice)
          : undefined,

        images: imageUrl ? [imageUrl] : [],

        category: formData.category,

        sizes: formData.sizes
          .split(",")
          .map((size) => size.trim())
          .filter(Boolean),

        colors: formData.colors
          .split(",")
          .map((color) => color.trim())
          .filter(Boolean),

        stock: Number(formData.stock),

        sku: formData.sku.trim() || undefined,

        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
      };

      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update product."
        );
      }

      setMessage("Product updated successfully.");

      setCurrentImage(imageUrl);
      setNewImageFile(null);
      setNewImagePreview("");

      setTimeout(() => {
        router.push("/admin/products");
        router.refresh();
      }, 800);
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to update product."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 text-gray-900">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
            <p className="text-gray-500">
              Loading product...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto max-w-4xl px-6 py-12">

        {/* Header */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            Shopigo Admin
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight">
            Edit Product
          </h1>

          <p className="mt-3 text-gray-600">
            Update your product information.
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className="mt-8 rounded-lg bg-white px-4 py-3 text-sm font-medium shadow-sm">
            {message}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-8"
        >

          {/* Images */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
            <h2 className="text-xl font-semibold">
              Product Image
            </h2>

            <div className="mt-6">

              {/* Current Image */}
              {currentImage && !newImagePreview && (
                <div>
                  <p className="mb-3 text-sm font-medium">
                    Current Image
                  </p>

                  <div className="h-72 w-72 overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                    <img
                      src={currentImage}
                      alt={formData.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* New Image Preview */}
              {newImagePreview && (
                <div>
                  <p className="mb-3 text-sm font-medium">
                    New Image Preview
                  </p>

                  <div className="h-72 w-72 overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                    <img
                      src={newImagePreview}
                      alt="New product preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              )}

              {!currentImage && !newImagePreview && (
                <div className="flex h-72 w-72 items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50">
                  <span className="text-sm text-gray-400">
                    No image
                  </span>
                </div>
              )}

              {/* File Input */}
              <div className="mt-6">
                <label
                  htmlFor="product-image"
                  className="mb-2 block text-sm font-medium"
                >
                  {currentImage
                    ? "Replace Image"
                    : "Upload Image"}
                </label>

                <input
                  id="product-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm"
                />

                <p className="mt-2 text-xs text-gray-500">
                  JPG, PNG, WEBP, etc. Maximum 5 MB.
                </p>
              </div>
            </div>
          </section>

          {/* Basic Information */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
            <h2 className="text-xl font-semibold">
              Basic Information
            </h2>

            <div className="mt-6 space-y-6">

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="text-sm font-medium"
                >
                  Product Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                />
              </div>

              {/* Slug */}
              <div>
                <label
                  htmlFor="slug"
                  className="text-sm font-medium"
                >
                  Slug
                </label>

                <input
                  id="slug"
                  name="slug"
                  type="text"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                />

                <p className="mt-2 text-xs text-gray-500">
                  Example: mens-blue-jeans
                </p>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="text-sm font-medium"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="mt-2 w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                />
              </div>

            </div>
          </section>

          {/* Pricing */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
            <h2 className="text-xl font-semibold">
              Pricing
            </h2>

            <div className="mt-6 grid gap-6 md:grid-cols-2">

              <div>
                <label
                  htmlFor="price"
                  className="text-sm font-medium"
                >
                  Selling Price
                </label>

                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                />
              </div>

              <div>
                <label
                  htmlFor="compareAtPrice"
                  className="text-sm font-medium"
                >
                  Compare At Price
                </label>

                <input
                  id="compareAtPrice"
                  name="compareAtPrice"
                  type="number"
                  min="0"
                  value={formData.compareAtPrice}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                />

                <p className="mt-2 text-xs text-gray-500">
                  Optional original price shown with a
                  strikethrough.
                </p>
              </div>

            </div>
          </section>

          {/* Product Details */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
            <h2 className="text-xl font-semibold">
              Product Details
            </h2>

            <div className="mt-6 space-y-6">

              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="text-sm font-medium"
                >
                  Category
                </label>

                <input
                  id="category"
                  name="category"
                  type="text"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  placeholder="mens-jeans"
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                />
              </div>

              {/* Sizes */}
              <div>
                <label
                  htmlFor="sizes"
                  className="text-sm font-medium"
                >
                  Sizes
                </label>

                <input
                  id="sizes"
                  name="sizes"
                  type="text"
                  value={formData.sizes}
                  onChange={handleChange}
                  placeholder="S, M, L, XL"
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                />

                <p className="mt-2 text-xs text-gray-500">
                  Separate sizes with commas.
                </p>
              </div>

              {/* Colors */}
              <div>
                <label
                  htmlFor="colors"
                  className="text-sm font-medium"
                >
                  Colors
                </label>

                <input
                  id="colors"
                  name="colors"
                  type="text"
                  value={formData.colors}
                  onChange={handleChange}
                  placeholder="Black, Blue, White"
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                />

                <p className="mt-2 text-xs text-gray-500">
                  Separate colors with commas.
                </p>
              </div>

            </div>
          </section>

          {/* Inventory */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
            <h2 className="text-xl font-semibold">
              Inventory
            </h2>

            <div className="mt-6 grid gap-6 md:grid-cols-2">

              <div>
                <label
                  htmlFor="stock"
                  className="text-sm font-medium"
                >
                  Stock
                </label>

                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                />
              </div>

              <div>
                <label
                  htmlFor="sku"
                  className="text-sm font-medium"
                >
                  SKU
                </label>

                <input
                  id="sku"
                  name="sku"
                  type="text"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="SKU-001"
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 uppercase outline-none focus:border-black"
                />
              </div>

            </div>
          </section>

          {/* Status */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
            <h2 className="text-xl font-semibold">
              Product Status
            </h2>

            <div className="mt-6 space-y-5">

              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-4 w-4"
                />

                <span className="text-sm font-medium">
                  Product is active
                </span>
              </label>

              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="h-4 w-4"
                />

                <span className="text-sm font-medium">
                  Show as featured product
                </span>
              </label>

            </div>
          </section>

          {/* Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={() => router.push("/admin/products")}
              className="rounded-full border border-gray-300 bg-white px-8 py-3 text-sm font-semibold transition hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving || uploadingImage}
              className="rounded-full bg-black px-8 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploadingImage
                ? "Uploading Image..."
                : saving
                  ? "Saving..."
                  : "Save Changes"}
            </button>

          </div>

        </form>
      </div>
    </main>
  );
}

