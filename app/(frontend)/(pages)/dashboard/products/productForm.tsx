'use client';

import useFetch from "@/app/(frontend)/hooks/useFetch";
import useForm from "@/app/(frontend)/hooks/useForm";
import apiService from "@/app/(frontend)/services/clientSideApiService";
import { productSchema } from "@/app/(frontend)/utils/validations/product";
import { Combobox } from "@/components/ui/combobox";
import CustomInput from "@/components/ui/input";
import LoadingAnimation from "@/components/ui/loading animation";
import ProgressButton from "@/components/ui/pogress_btn/pogress_btn";
import { toast } from "react-toastify";

interface ProductFormProps {
    reload: () => void;
    selectedItem?: any
}
interface Category {
    _id: string;
    categoryId: string;
    productCount: number;
    shopId: string;
    slug: string;
    title: string;
    __v: number;
}

const ProductForm = ({ reload, selectedItem }: ProductFormProps) => {
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
            title: selectedItem?.title || '',
            category: selectedItem?.category._id || null,
            price: selectedItem?.price || 0,
            discount: selectedItem?.discount || 0,
            costPrice: selectedItem?.costPrice || 0,
        },
        productSchema
    );

    //get data
    const { data, loading, error, } = useFetch<Category[]>('/category');




    console.log("data", values.category, values.title, typeof values.price, values.discount, values.costPrice);
    const onSubmit = async () => {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("price", JSON.stringify(Number(values.price)));
        formData.append("discount", JSON.stringify(Number(values.discount || 0)));
        formData.append("costPrice", JSON.stringify(Number(values.costPrice ?? 0)));
        formData.append("category", values.category);
        formData.append("stock", JSON.stringify(0));
        selectedItem?._id && formData.append("_id", selectedItem._id);

        try {
            if (selectedItem) {
                await apiService.patch(`/Product/`, formData);
                toast.success("Product updated successfully");
            } else {
                await apiService.post('/Product', formData);
                toast.success("Product created successfully");
            }
            resetForm();
            reload();
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || "Something went wrong";
            toast.error(errorMessage);
        }
    };
    return (
        <div>
            {loading ? <LoadingAnimation /> : <div className="w-full space-y-4">
                <CustomInput
                    label="Title"
                    type="text"
                    name="title"
                    value={values.title}
                    errors={errors.title}
                    onchange={handleChange}
                    placeholder="Product title"
                />
                <Combobox value={values.category} name={'category'} options={data?.map((c: Category) => {
                    return { value: c._id, label: c.title }
                }) || []} onChange={handleChange} label={"Category"} error={errors.category} />
                <CustomInput
                    label="Price"
                    type="number"
                    name="price"
                    value={values.price}
                    errors={errors.price}
                    onchange={handleChange}
                    placeholder="Product price"
                />
                <CustomInput
                    label="Discount"
                    type="number"
                    name="discount"
                    value={values.discount}
                    errors={errors.discount}
                    onchange={handleChange}
                    placeholder="Product discount"
                />
                <CustomInput
                    label="Cost Price"
                    type="number"
                    name="costPrice"
                    value={values.costPrice}
                    errors={errors.costPrice}
                    onchange={handleChange}
                    placeholder="Product cost price"
                />
                <ProgressButton
                    width="w-full"
                    title={`${selectedItem ? "Edit" : "Create"} Product`}
                    handleClick={(e: React.MouseEvent<HTMLButtonElement>) => handleSubmit(e, onSubmit)}
                    isSubmitting={isSubmitting}
                />
            </div>}
        </div>
    );
};

export default ProductForm;
