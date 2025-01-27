'use client';
import { Product } from "@/app/(frontend)/types/interfaces";
import ProductCard from "./productCard";


const ProductSection = ({ data }: { data: Product[] }) => {
    return (
        <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4  ">
            {data.map((product: Product) => {
                return (
                    <ProductCard product={product} key={product._id} />)
            })}
        </div>
    )
}

export default ProductSection