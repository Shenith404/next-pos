'use client';

import useForm from "@/app/(frontend)/hooks/useForm";
import apiService from "@/app/(frontend)/services/clientSideApiService";
import { categorySchema } from "@/app/(frontend)/utils/validations/category";
import CustomInput from "@/components/ui/input";
import ProgressButton from "@/components/ui/pogress_btn/pogress_btn";
import { toast } from "react-toastify";

interface CategoryFormProps {
    reload: () => void;
    selectedItem?: {
        _id: string;
        title: string;
    };
}

const CreateCategory = ({ reload, selectedItem }: CategoryFormProps) => {
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
        { title: selectedItem?.title || '' },
        categorySchema
    );

    const onSubmit = async () => {
        const data = { title: values.title };

        try {
            if (selectedItem) {
                await apiService.patch(`/category/`, {
                    _id: selectedItem._id,
                    ...data,
                });
                toast.success("Category updated successfully");
            } else {
                await apiService.post('/category', data);
                toast.success("Category created successfully");
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
                label="Title"
                type="text"
                name="title"
                value={values.title}
                errors={errors.title}
                onchange={handleChange}
                placeholder="Category title"
            />
            <ProgressButton
                width="w-full"
                title={`${selectedItem ? "Edit" : "Create"} Category`}
                handleClick={(e: React.MouseEvent<HTMLButtonElement>) => handleSubmit(e, onSubmit)}
                isSubmitting={isSubmitting}
            />
        </div>
    );
};

export default CreateCategory;
