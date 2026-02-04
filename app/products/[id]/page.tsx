"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProductById } from "../../services/productservices";
import { product } from "../../types/product";
import Link from "next/link";

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchProduct() {
      try {
        const data = await getProductById(Number(id));
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  if (loading) return <p>Loading product...</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <div style={{ display: "flex", gap: 20 }}>
      <img src={product.image} alt={product.title} width={300} />
      <div>
        <h1>{product.title}</h1>
        <p>💲 {product.price}</p>
        <p>Category: {product.category}</p>
        <p>⭐ {product.rating.rate} ({product.rating.count})</p>
        <p>{product.description}</p>
        <button onClick={() => router.back()} style={{ marginTop: 20 }}>
          ← Back
        </button>
      </div>
    </div>
  );
}
