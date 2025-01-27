'use client';
import CustomInput from '@/components/ui/input';
import ProgressButton from '@/components/ui/pogress_btn/pogress_btn';

import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import useForm from '../../../hooks/useForm';
import apiService from '../../../services/clientSideApiService';
import { resetPwSchema } from '../../../utils/validations';

interface ResetPwProps {
    setSection: (section: number) => void;
    otp: any,
    email: string
}

const ResetPw: React.FC<ResetPwProps> = ({ setSection, otp, email }) => {
    const initialValues = { password: '', confirmpassword: '' };
    const router = useRouter();

    const { values, errors, isSubmitting, handleChange, handleSubmit, resetForm, setErrors } = useForm(initialValues, resetPwSchema);

    const resetPw = async () => {
        if (values.password !== values.confirmpassword) {
            toast.error('Passwords do not match');
            return;
        }
        const data = {
            email: email,
            otp: otp,
            newPassword: values.password,
            confirmPassword: values.confirmpassword
        };
        console.log(data);

        try {
            const result: any = await apiService.post("auth/reset-password", {
                email: email,
                otp: otp.toString(),
                newPassword: values.password,
                confirmPassword: values.confirmpassword,
            });
            toast.success('Reset password successfully');
            resetForm();
            router.push('/signin');
        } catch (error: any) {
            //  setErrors({ email: error.message });
            console.log(error);
            toast.error(error || 'An error occurred');
        } finally {
        }
    };

    return (
        <form onSubmit={(e) => handleSubmit(e, resetPw)}>
            <div className="justify-center items-center flex m-2">
            </div>
            <div className="justify-center items-center flex m-2">
                <h1 className='text-primary font-bold'>Enter your Passwords</h1>
            </div>
            <div>
                <CustomInput
                    type={'password'}
                    name={'password'}
                    errors={errors.password}
                    placeholder={'password'}
                    onchange={handleChange}
                    value={values.password}
                />
                <CustomInput
                    type={'password'}
                    name={'confirmpassword'}
                    errors={errors.confirmpassword}
                    placeholder={'confirmpassword'}
                    onchange={handleChange}
                    value={values.confirmpassword}
                />
            </div>
            <ProgressButton width={'w-full'} title={'Send'} isSubmitting={isSubmitting} handleClick={() => { }} />
            <div className='flex items-center justify-between my-3'>
                <div>
                    <a href="/login" className='text-primary'>Back to Login?</a>
                </div>
            </div>
        </form>
    );
};

export default ResetPw;
