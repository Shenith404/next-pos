import CustomInput from '@/components/ui/input';
import ProgressButton from '@/components/ui/pogress_btn/pogress_btn';
import { toast } from 'react-toastify';
import useForm from '../../../hooks/useForm';
import apiService from '../../../services/clientSideApiService';
import { emailValidationSchema } from '../../../utils/validations';

interface RequestOTPProps {
    setSection: (section: number) => void;
    setEmail: (email: string) => void;
}

const RequestOTP: React.FC<RequestOTPProps> = ({ setSection, setEmail }) => {
    const initialValues = { email: '' };

    const { values, errors, isSubmitting, handleChange, handleSubmit, resetForm, setErrors } = useForm(initialValues, emailValidationSchema);

    const requesetOtp = async () => {
        const data = { email: values.email };
        setEmail(values.email);

        try {
            const result: any = await apiService.post('/auth/request-otp', data);
            toast.success('We have sent you an email to reset your password');
            setSection(1);
        } catch (error: any) {
            setErrors({ email: error.message });
            console.log(error);
            toast.error(error.message || 'An error occurred');
        } finally {
            resetForm();
        }
    };

    return (
        <form onSubmit={(e) => handleSubmit(e, requesetOtp)}>
            <div className="justify-center items-center flex m-2">
            </div>
            <div className="justify-center items-center flex m-2">
                <h1 className='text-primary font-bold'>Enter your Email</h1>
            </div>
            <div>
                <CustomInput
                    type={'email'}
                    name={'email'}
                    errors={errors.email}
                    placeholder={'Email'}
                    onchange={handleChange}
                    value={values.email}
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

export default RequestOTP;
