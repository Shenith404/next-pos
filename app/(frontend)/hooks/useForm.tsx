'use client';
import { useEffect, useState } from "react";
import { ZodSchema } from "zod";

// Define a type for the field types we want to support
type FieldType = string | number | boolean;

const useForm = <T extends Record<string, FieldType>>(initialValues: T, schema: ZodSchema<T>) => {
    const [values, setValues] = useState<T>(initialValues);
    const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setValues(initialValues);
    }, [JSON.stringify(initialValues)]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = event.target;

        // Determine the appropriate value based on input type
        let parsedValue: FieldType = value;

        // Handle different input types
        switch (type) {
            case 'number':
                // Convert to number but handle empty string
                parsedValue = value === '' ? 0 : Number(value);
                break;
            case 'checkbox':
                parsedValue = event.target.checked;
                break;
            default:
                // Keep as string for text inputs
                parsedValue = value;
        }

        // Check if the field should be treated as a number based on initial value type
        if (typeof initialValues[name] === 'number' && typeof parsedValue !== 'number') {
            parsedValue = value === '' ? 0 : Number(value);
        }

        setValues(prev => ({
            ...prev,
            [name]: parsedValue,
        }) as T);
    };

    const handleSubmit = async (event: React.FormEvent, callback: () => Promise<void>) => {
        if (event) event.preventDefault();
        setIsSubmitting(true);

        try {
            schema.parse(values);
            setErrors({});
            await callback();
        } catch (e: any) {
            const validationErrors = e.errors.reduce((acc: any, error: any) => {
                acc[error.path[0]] = error.message;
                return acc;
            }, {});
            setErrors(validationErrors);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setValues(initialValues);
        setErrors({});
        setIsSubmitting(false);
    };

    return {
        values,
        errors,
        isSubmitting,
        handleChange,
        handleSubmit,
        resetForm,
        setErrors,
        setValues,
    };
};

export default useForm;