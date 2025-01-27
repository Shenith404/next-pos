'use client';
import { useCart } from "@/app/(frontend)/context/cart";
import useForm from "@/app/(frontend)/hooks/useForm";
import apiService from "@/app/(frontend)/services/clientSideApiService";
import { getFinalPrice } from "@/app/(frontend)/types/functions";
import { Order } from "@/app/(frontend)/types/interfaces";
import { summarySectionSchema } from "@/app/(frontend)/utils/validations/summarySection";
import { Button } from "@/components/ui/button";
import CustomInput from "@/components/ui/input";
import ProgressButton from "@/components/ui/pogress_btn/pogress_btn";
import printJS from "print-js";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import SearchOldOrder from "../searchOldOrder";
import CartItem from "./cartItem";
import ReturnCartItem from "./returnCartItem";

type ReturnItem = {
    productId: string;
    returnQuantity: number;
}

const SummarySection = () => {

    const { cart, clearCart } = useCart()

    // form elements
    const {
        values,
        errors,
        isSubmitting,
        handleChange,
        handleSubmit,
        resetForm,
        setErrors,
        setValues,
    } = useForm(
        {
            customerName: " ",
            phoneNumber: " ",
            discount: 0,
            discountPrice: 0,
            holdReason: " ",
            cashGiven: 0,
        },
        summarySectionSchema
    );



    // returns section
    const [oldOrder, setOldOrder] = useState<Order | null>(null);
    const [returnItems, setReturnItems] = useState<ReturnItem[]>([]);


    const getReturnItemFinalPrice = (product: any) => {
        if (oldOrder?.discount) {
            return product.price - (product.price * oldOrder.discount / 100)
        }
        return product.price
    }

    const prices = useMemo(() => {
        // Calculate new items total
        const newItemsSubTotal = cart.reduce(
            (acc, item) => acc + getFinalPrice(item) * item.quantity,
            0
        );

        // Calculate return items total
        const returnItemsTotal = returnItems.reduce((acc, returnItem) => {
            // Find the original item in the old order to get its price
            const originalItem = oldOrder?.items.find(
                (item: any) => item.productId === returnItem.productId
            );
            if (originalItem) {
                return acc + (getReturnItemFinalPrice(originalItem) * returnItem.returnQuantity);
            }
            return acc;
        }, 0);

        const subTotal = newItemsSubTotal - returnItemsTotal;
        const tax = 0; // Tax calculation can be added here if needed
        const total = subTotal + tax;

        // Calculate discount amount
        const discountPercentage = (values.discount) || 0;
        const discountAmount = (newItemsSubTotal * discountPercentage) / 100;
        const finalTotal = total - discountAmount;

        return {
            newItemsSubTotal,
            returnItemsTotal,
            subTotal,
            tax,
            discountAmount,
            finalTotal
        };
    }, [cart, returnItems, oldOrder, values.discount]);


    // Sync discountPrice based on discount percentage
    useEffect(() => {
        const calculateDiscountPrice = () => {


            if (prices.newItemsSubTotal > 0) {
                const discountPrice = (prices.newItemsSubTotal * values.discount) / 100;
                if (values.discountPrice !== discountPrice) {
                    setValues((prev) => ({
                        ...prev,
                        discountPrice: parseFloat(discountPrice.toFixed(2)),
                    }));
                }
            } else {
                setValues((prev) => ({ ...prev, discountPrice: 0 }));
            }
        };
        calculateDiscountPrice();
    }, [values.discount]);

    // Sync discount percentage based on discount price
    useEffect(() => {

        const calculateDiscountPercentage = () => {

            if (prices.newItemsSubTotal > 0) {
                const discount = (values.discountPrice / prices.newItemsSubTotal) * 100;
                if (values.discount !== discount) {
                    setValues((prev) => ({
                        ...prev,
                        discount: parseFloat(discount.toFixed(8)),
                    }));
                }
            } else {
                setValues((prev) => ({ ...prev, discount: 0 }));
            }
        };
        calculateDiscountPercentage();
    }, [values.discountPrice, prices.newItemsSubTotal]);



    const onSubmit = async (isHold?: boolean) => {
        if (cart.length === 0) {
            toast.error(`Item list is empty!`);

            return;
        }




        let data = {
            orderId: oldOrder?._id,
            returnItems: returnItems,
            newItems: cart.map(({ _id, quantity }: { _id: any, quantity: any }) => {
                return { _id, quantity };
            }),

            discount: (values.discount),
            cashGiven: (values.cashGiven),
        };

        try {

            const result: any = await apiService.post<{ token: string }>(
                "order/return",
                data
            );

            printJS(result?.invoiceUrl);



            clearCart();
            toast.success(`Order placed successfully!`);
        } catch (e: any) {
            toast.error(e as string || e[0]);
            console.log(e);
        } finally {
            setValues({
                customerName: " ",
                phoneNumber: " ",
                discount: 0,
                discountPrice: 0,
                holdReason: " ",
                cashGiven: 0,
            });
        }
    };



    //return item
    // Handle returning items
    const handleReturnItem = (item: any) => {
        if (!item || item.quantity === 0) return;

        setReturnItems((prev: any) => {
            const existingItem = prev.find((i: ReturnItem) => i.productId === item._id);

            if (existingItem) {
                if (existingItem.returnQuantity === 0) return prev;
                return prev.map((i: ReturnItem) =>
                    i.productId === item._id
                        ? { ...i, returnQuantity: i.returnQuantity + 1 }
                        : i
                );
            }
            return [...prev, { productId: item._id, returnQuantity: 1 }];
        });

        // Update old order quantities
        setOldOrder((prev: any) => {
            if (!prev) return null;
            return {
                ...prev,
                items: prev.items.map((i: any) =>
                    i.productId === item._id
                        ? { ...i, quantity: Math.max(0, i.quantity - 1) }
                        : i
                ),
            };
        });
    };

    const giveWarning = (item: any) => {
        toast.error(`Return items can only be reduced, not added or removed!`);
    }

    // Reset return items
    const resetReturnItems = () => {
        setReturnItems([]);

        if (oldOrder) {
            setValues({
                customerName: oldOrder.customerName || "",
                phoneNumber: oldOrder.phoneNumber || "",
                discount: oldOrder.discount || 0,
                discountPrice: 0,
                holdReason: "",
                cashGiven: 0,
            });
        }
    };

    return (
        <div className="w-full items-center p-2">

            {/* title and clear btn */}
            <div className="w-full flex items-center justify-between m-1 mb-3">
                <h1 className="text-lg font-bold">Current Order</h1>
                <Button size={'sm'} onClick={() => { clearCart(); resetReturnItems(); setOldOrder(null); }} className="">Clear</Button>
            </div>

            {/* search old order */}
            <SearchOldOrder selected={oldOrder} setSelected={setOldOrder}
                resetFunctions={resetReturnItems}
            />

            {/* view old Order Cart Items */}

            {oldOrder && (
                <div className="mt-4">
                    <ul className="divide-y divide-gray-200">
                        {oldOrder.items.map((item: any) => (
                            <ReturnCartItem
                                handleRemove={giveWarning}
                                handleIncrement={giveWarning}
                                handleDecrement={handleReturnItem}
                                key={item.productId}
                                item={{
                                    _id: item.productId,
                                    title: item.productName,
                                    price: item.price,
                                    quantity: item.quantity,
                                    image: item.productImageUrl,
                                }}
                                totalDiscount={oldOrder.discount} />
                        ))}
                    </ul>
                </div>)
            }

            {/* cart Items */}
            <div className="w-full  p-2 mb-2 grid grid-cols-1 gap-2">
                {cart.map((item, index: any) => {
                    return <CartItem item={item} key={index} />
                })}

            </div>

            {/* Price Breakdown */}
            <div className="mt-6 ">


                <div className="rounded-xl bg-gray-200 p-5 ">
                    <div className="flex justify-between text-lg">
                        <span>New Item Subtotal</span>
                        <span>{prices.newItemsSubTotal.toFixed(2)} LKR</span>
                    </div>

                    <div className="flex justify-between text-red-500 text-lg">
                        <span>Return Item Subtotal</span>
                        <span>-{prices.returnItemsTotal.toFixed(2)} LKR</span>
                    </div>
                    <div className="flex justify-between text-lg">
                        <span>Subtotal</span>
                        <span>{prices.subTotal.toFixed(2)} LKR</span>
                    </div>
                    {prices.tax > 0 && (
                        <div className="flex justify-between text-lg">
                            <span>Tax</span>
                            <span>{prices.tax.toFixed(2)} LKR</span>
                        </div>
                    )}
                    {prices.discountAmount > 0 && (
                        <div className="flex justify-between text-lg text-red-500">
                            <span>Discount ({values.discount}%)</span>
                            <span>-{prices.discountAmount.toFixed(2)} LKR</span>
                        </div>
                    )}
                </div>
                <div className="w-full grid place-items-center">
                    <div className="w-[97%] border-[1px] border-dashed  border-gray-500"></div>
                </div>
                <div className="rounded-xl bg-gray-200 p-5 mb-3">
                    <div className="flex justify-between text-xl [font-weight:600]">
                        <span>Final Total</span>
                        <span>{prices.finalTotal.toFixed(2)} LKR</span>
                    </div>
                    {(values.cashGiven || values.cashGiven !== 0) && <div>
                        <div className="flex justify-between   ">
                            <span>Cash Given</span>
                            <span>{((values.cashGiven)).toFixed(2)}  LKR</span>
                        </div>
                        <div className="flex justify-between [font-weight:500]">
                            <span>Balance</span>
                            <span>{((values.cashGiven) - parseFloat(prices.finalTotal.toFixed(2))).toFixed(2)} LKR</span>
                        </div>
                    </div>}
                </div>


            </div>


            {/* Billing section */}
            <div className="grid grid-cols-2 gap-4 w-full">
                {/* customer name */}
                <CustomInput type="text" label="Customer Name" name="customerName" value={values.customerName} onchange={handleChange} placeholder="Customer Name" />
                {/* customer contact */}
                <CustomInput type="tel" label="Phone Number" name="phoneNumber" value={values.phoneNumber} onchange={handleChange} placeholder="Phone Number" />
                {/* discount % */}
                <CustomInput type="number" label="Discount" name="discount" value={values.discount} onchange={handleChange} placeholder="Discount %" />
                {/* discount price */}
                <CustomInput type="number" label="Discount Price" name="discountPrice" value={values.discountPrice} onchange={handleChange} placeholder="Discount Amount" />
                {/* hold reason */}
                <CustomInput type="text" label="Hold Reason" name="holdReason" value={values.holdReason} onchange={handleChange} placeholder="Hold Reason" />
                {/* cash given */}
                <CustomInput type="number" label="Cash" name="cashGiven" value={values.cashGiven} onchange={handleChange} placeholder="Cash Given" />

                <ProgressButton width={"w-full"} title={"Place Order"} handleClick={(e: any) => handleSubmit(e, onSubmit)} isSubmitting={isSubmitting} />
                <Button className="border-primary text-primary " onClick={(e: any) => handleSubmit(e, () => onSubmit(false))} variant={'outline'}>Hold Order</Button>

            </div>

        </div>
    )
}

export default SummarySection