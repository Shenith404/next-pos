'use client';

import useForm from "@/app/(frontend)/hooks/useForm";
import apiService from "@/app/(frontend)/services/clientSideApiService";
import { emailValidationSchema } from "@/app/(frontend)/utils/validations";
import CustomInput from "@/components/ui/input";
import ProgressButton from "@/components/ui/pogress_btn/pogress_btn";
import { toast } from "react-toastify";

interface userFormProps {
    reload: () => void;
    selectedItem?: {
        _id: string;
        email: string;
    };
}

const UserForm = ({ reload, selectedItem }: userFormProps) => {
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
        { email: selectedItem?.email || '' },
        emailValidationSchema
    );

    const onSubmit = async () => {
        const data = { email: values.email };

        try {
            if (selectedItem) {
                await apiService.patch(`user/operator`, {
                    _id: selectedItem._id,
                    ...data,
                });
                toast.success("Operator updated successfully");
            } else {
                await apiService.post('user/operator', data);
                toast.success("Operator created successfully");
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
                label="email"
                type="text"
                name="email"
                value={values.email}
                errors={errors.email}
                onchange={handleChange}
                placeholder="Operator email"
            />
            <ProgressButton
                width="w-full"
                title={`${selectedItem ? "Edit" : "Create"} Operator`}
                handleClick={(e: React.MouseEvent<HTMLButtonElement>) => handleSubmit(e, onSubmit)}
                isSubmitting={isSubmitting}
            />
        </div>
    );
};

export default UserForm;
