'use client';

import useForm from "@/app/(frontend)/hooks/useForm";
import apiService from "@/app/(frontend)/services/clientSideApiService";
import { stockSchema } from "@/app/(frontend)/utils/validations/stock";
import CustomInput from "@/components/ui/input";
import ProgressButton from "@/components/ui/pogress_btn/pogress_btn";
import { toast } from "react-toastify";

interface ChangeStock {
    reload: () => void;
    type: 'main' | 'damaged';
    selectedItem?: any;

}

const UpdateStock = ({ reload, type, selectedItem }: ChangeStock) => {
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
        { count: 0 },
        stockSchema
    );

    const onSubmit = async () => {
        const data = { stock: values.count };

        try {

            if (type === 'damaged') {
                const result: any = await apiService.patch(`/Product/${selectedItem._id}/damaged-stock`,
                    {
                        "damagedStock": values.count
                    }
                );
            } else {

                await apiService.patch(`/Product/${selectedItem._id}/update-stock`,
                    data
                );
                toast.success("Stock updated successfully");
            }

            resetForm();
            reload();
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || "Something went wrong";
            toast.error(errorMessage);
        }
    };

    return (
        <div className="w-full space-y-4">
            <CustomInput
                label="Count"
                type="number"
                name="count"
                value={values.count.toString()}
                errors={errors.count}
                onchange={handleChange}
                placeholder="Category title"
            />
            <ProgressButton
                width="w-full"
                title={`Update`}
                handleClick={(e: React.MouseEvent<HTMLButtonElement>) => handleSubmit(e, onSubmit)}
                isSubmitting={isSubmitting}
            />
        </div>
    );
};

export default UpdateStock;
