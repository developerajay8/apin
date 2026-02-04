"use client";
import React, { useEffect, useState } from 'react'
import { product } from '../types/product'
import { getProducts } from '../services/productservices';
import Link from 'next/link';

export default function ProductsPage(){
const [products, setProducts] = useState<product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchProducts() {
            try{
                // console.log("hiii")
                const data = await getProducts();
                // console.log(data);
                setProducts(data);

            } catch (error:any){
                setError(error.message);
            } finally {
                setLoading(false);
            }


            
        }
        fetchProducts();
    },[]);

    if (loading) return <h2>Loading Products............</h2>
    if (error) return <h2>Error: {error}</h2>
  return (
    <div>
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-10 py-10 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
  {products.map((product) => (
    <Link key={product.id} href={`/products/${product.id}`}>
      <div className="group rounded-2xl overflow-hidden bg-linear-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">

        {/* Image */}
        <div className="relative bg-white p-4">
          <img
            src={product.image}
            alt={product.title}
            className="h-[280px] w-full object-contain group-hover:scale-105 transition-transform duration-300"
          />

          {/* Price Badge */}
          <span className="absolute top-3 right-3 bg-linear-to-r from-pink-500 to-purple-500 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-md">
            ${product.price}
          </span>
        </div>

        {/* Content */}
        <div className="p-5 text-white">
          <h3 className="text-lg font-semibold line-clamp-2 mb-2">
            {product.title}
          </h3>

          <div className="flex items-center justify-between text-sm text-gray-300">
            <span className="capitalize">{product.category}</span>
            <span className="flex items-center gap-1">
              ⭐ {product.rating.rate}
              <span className="text-gray-400">({product.rating.count})</span>
            </span>
          </div>

          {/* Button */}
          <button className="mt-4 w-full rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 py-2 text-sm font-semibold text-white hover:opacity-90 transition">
            View Details
          </button>
        </div>

      </div>
    </Link>
  ))}
</div>

    </div>
  )
}
