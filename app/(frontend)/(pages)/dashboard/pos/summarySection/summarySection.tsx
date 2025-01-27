'use client';
import { useCart } from "@/app/(frontend)/context/cart";
import useForm from "@/app/(frontend)/hooks/useForm";
import apiService from "@/app/(frontend)/services/clientSideApiService";
import { getFinalPrice } from "@/app/(frontend)/types/functions";
import { summarySectionSchema } from "@/app/(frontend)/utils/validations/summarySection";
import { Button } from "@/components/ui/button";
import CustomInput from "@/components/ui/input";
import ProgressButton from "@/components/ui/pogress_btn/pogress_btn";
import printJS from "print-js";
import { useCallback, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import CartItem from "./cartItem";

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







    const prices = useMemo(() => {
        // Calculate new items total
        const newItemsSubTotal = cart.reduce(
            (acc, item) => acc + getFinalPrice(item) * item.quantity,
            0
        );

        const subTotal = newItemsSubTotal;
        const tax = 0; // Tax calculation can be added here if needed
        const total = subTotal + tax;

        // Calculate discount amount
        const discountPercentage = values.discount || 0;
        const discountAmount = (subTotal * discountPercentage) / 100;
        const finalTotal = total - discountAmount;

        return {
            newItemsSubTotal,
            subTotal,
            tax,
            discountAmount,
            finalTotal
        };
    }, [cart, values.discount]);


    // Optimize discount price calculation
    const calculateDiscountPrice = useCallback(() => {
        if (prices.subTotal > 0) {
            const discountPrice = (prices.subTotal * values.discount) / 100;
            setValues(prev => ({
                ...prev,
                discountPrice: Number(discountPrice.toFixed(2))
            }));
        } else {
            setValues(prev => ({ ...prev, discountPrice: 0 }));
        }
    }, [values.discount, setValues]);

    // Optimize discount percentage calculation
    const calculateDiscountPercentage = useCallback(() => {
        if (prices.subTotal > 0) {
            const discount = (values.discountPrice / prices.subTotal) * 100;
            setValues(prev => ({
                ...prev,
                discount: Number(discount.toFixed(8))
            }));
        } else {
            setValues(prev => ({ ...prev, discount: 0 }));
        }
    }, [prices.subTotal, values.discountPrice, setValues]);

    // Use separate useEffects for clarity
    useEffect(() => {
        calculateDiscountPrice();
    }, [calculateDiscountPrice]);

    useEffect(() => {
        calculateDiscountPercentage();
    }, [calculateDiscountPercentage]);



    const onSubmit = async (isHold?: boolean) => {
        if (cart.length === 0) {
            toast.error(`Item list is empty!`);

            return;
        }




        let data = {
            items: cart.map(({ _id, quantity }: { _id: any, quantity: any }) => {
                return { _id, quantity };
            }),
            customerName: values.customerName,
            phoneNumber: values.phoneNumber ?? 0,
            discount: (values.discount) || 0,
            isHold: isHold,
            holdReason: values.holdReason,
            cashGiven: (values.cashGiven) ?? 0,
        };

        try {

            const result: any = await apiService.post<{ token: string }>(
                "order",
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


    return (
        <div className="w-full items-center p-2">

            {/* title and clear btn */}
            <div className="w-full flex items-center justify-between m-1 mb-3">
                <h1 className="text-lg font-bold">Current Order</h1>
                <Button size={'sm'} onClick={clearCart} className="">Clear</Button>
            </div>

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