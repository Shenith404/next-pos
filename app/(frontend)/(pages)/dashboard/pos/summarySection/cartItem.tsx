'use client'

import { useCart } from "@/app/(frontend)/context/cart";
import { getFinalPrice } from "@/app/(frontend)/types/functions";
import Image from "next/image";

const CartItem = ({ item }: { item: any }) => {
    const { handleDecrement, handleIncrement, handleRemove } = useCart()
    return (
        <div className="flex justify-start gap-4 m-2  items-start">

            {/* image */}

            <div className="w-20 h-20 rounded-md  relative">
                <Image src={(item.image === '' || !item.image) ? '/productimg.PNG' : item.image} alt={item.title} className="object-cover" fill />
            </div>


            {/* details */}
            <div className="flex flex-col gap-2  w-full h-[100%]">
                {/* title */}
                <h1 className="font-bold relative ">{item.title}</h1>

                {/* price and quantity */}
                <div className="flex  items-end h-[100%]   justify-between  w-full">

                    {/* price */}
                    <h1 className="font-semibold text-secondary">{getFinalPrice(item) * item.quantity} LKR</h1>
                    <div className="flex gap-4 items-center">
                        {/* remove */}
                        <button onClick={() => { handleRemove(item) }} className="w-8 h-8 bg-red-500 rounded-md grid place-items-center text-white text-md ">x</button>

                        {/* decrement */}
                        <button onClick={() => { handleDecrement(item) }} className="w-8 h-8 bg-primary rounded-md grid place-items-center text-white text-xl ">-</button>
                        {/* quantity */}
                        <h1 className="font-semibold text-secondary">{item.quantity}</h1>
                        {/* increment  */}
                        <button onClick={() => { handleIncrement(item) }} className="w-8 h-8 bg-primary rounded-md grid place-items-center text-white text-xl ">+</button>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default CartItem;
