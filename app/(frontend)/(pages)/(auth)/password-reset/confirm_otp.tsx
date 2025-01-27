'use client';
import { InputOTP, InputOTPSlot } from '@/components/ui/input-otp';
import ProgressButton from '@/components/ui/pogress_btn/pogress_btn';
import { toast } from 'react-toastify';
import useForm from '../../../hooks/useForm';
import apiService from '../../../services/clientSideApiService';
import { confrimOtpSchema } from '../../../utils/validations';

interface ConfirmOtpProps {
    setSection: (section: number) => void;
    setOtp: (otp: string) => void; // Made the type more specific
    email: string;
}

const ConfirmOtp: React.FC<ConfirmOtpProps> = ({ setSection, setOtp, email }) => {
    const initialValues = { otp: '' };

    const { values, errors, isSubmitting, handleSubmit, resetForm, setValues } = useForm(initialValues, confrimOtpSchema);

    const requestOtp = async () => {
        const data = { email, otp: values.otp }; // Destructured email
        console.log(data);
        setOtp(values.otp);
        try {
            const result: any = await apiService.post('/auth/verify-otp', data);

            toast.success('OTP verified successfully');
            setSection(2);
        } catch (error: any) {
            console.log(error);
            toast.error(error.message || 'An error occurred');
        } finally {
            resetForm();
        }
    };

    return (
        <form onSubmit={(e) => handleSubmit(e, requestOtp)}>
            <div className="justify-center items-center flex m-2">
            </div>
            <div className="justify-center items-center flex m-2">
                <h1 className='text-primary font-bold'>Confirm OTP</h1>
            </div>
            <div className='w-full flex mb-2 justify-center'>
                <InputOTP
                    value={values.otp}
                    onChange={(e: any) => setValues({ ...values, otp: e })}

                    className="flex justify-between"
                    maxLength={6}
                >
                    {[...Array(6)].map((_, index) => (
                        <InputOTPSlot key={index} index={index} />
                    ))}
                </InputOTP>
            </div>
            <ProgressButton
                width={'w-full'}
                title={'Confirm'}
                isSubmitting={isSubmitting}
                handleClick={() => { }} // Removed unnecessary function body
            />
            <div className='flex items-center justify-between my-3'>
                <div>
                    <a href="/reset-password" className='text-primary'>Resend?</a> {/* Fixed the spacing around the question mark */}
                </div>
                <div>
                    <a href="/login" className='text-primary'>Back to Login?</a>
                </div>
            </div>
        </form>
    );
};

export default ConfirmOtp;
