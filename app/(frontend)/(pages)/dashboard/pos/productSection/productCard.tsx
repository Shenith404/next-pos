import { useCart } from "@/app/(frontend)/context/cart"
import { getFinalPrice } from "@/app/(frontend)/types/functions"
import { Product } from "@/app/(frontend)/types/interfaces"
import Image from "next/image"

interface ProductCardProps {
    product: Product
}
const ProductCard = ({ product }: { product: Product }) => {
    const { addToCart } = useCart()

    return (
        <button onClick={() => { addToCart(product as any) }} className="bg-white   p-4 rounded-md" >
            <div className="w-full h-44 rounded-md  relative">
                <Image src={(product.image === '' || !product.image) ? '/productimg.PNG' : product.image} alt={product.title} className="object-cover" fill />
            </div>
            <h1 className="font-semibold mt-2 flex justify-start ">{product.title}</h1>
            {product.discount !== 0 && <p className="flex justify-start text-secondary text-sm line-through">{product.price} LKR</p>}
            <div className="flex items-center">

                <p className="flex justify-start text-secondary font-semibold">{getFinalPrice(product)} LKR</p>
                <p className=" text-sm ml-2 text-gray-500 font-semibold"> /{product.stock} items</p>
            </div>
        </button>
    )
}

export default ProductCard