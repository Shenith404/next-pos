'use client';
import useForm from '@/app/(frontend)/hooks/useForm';
import { loginSchema } from '@/app/(frontend)/utils/validations';
import { Checkbox } from '@/components/ui/checkbox';
import { CustomInput } from '@/components/ui/input';
import ProgressButton from '@/components/ui/pogress_btn/pogress_btn';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useUser } from '../../../context/user';
import apiService from '../../../services/clientSideApiService';




const LoginForm = () => {
    const initialValues = { email: '', password: '' };

    const { values, errors, isSubmitting, handleChange, handleSubmit, resetForm, setErrors } = useForm(initialValues, loginSchema);

    const { user, updateAccessToken } = useUser();
    const router = useRouter();

    const onSubmit = async () => {
        const data = {

            email: values.email,
            password: values.password,

        }
        try {
            const result: any = await apiService.post('/auth/login', data);
            console.log('login result', result);
            updateAccessToken(result.access_token);
            toast.success('Login successful');
            router.push('/');


        } catch (error: any) {
            setErrors({ email: error.message });
            console.log(error, process.env.BASE_URL);
            toast.error(error || 'An error occurred');
        } finally {
            resetForm();
        }
    };

    return (
        <div className='flex items-center justify-center h-screen '>
            <div className="border  z-1  w-[350px] px-6  pt-2 pb-6 rounded-lg  ">
                <form onSubmit={(e) => handleSubmit(e, onSubmit)}>
                    <div className=" justify-center items-center  flex m-2">
                        {/* <Image src={logo} alt={'logo'}></Image> */}
                    </div>
                    <div className=" justify-center items-center  flex m-2">
                        <h1 className='text-primary font-bold'>Login</h1>
                    </div>
                    <div>
                        <CustomInput type={'email'}
                            name={'email'}
                            errors={errors.email}
                            placeholder={'Email'}
                            onchange={handleChange}
                            value={values.email}></CustomInput>
                    </div>
                    <div className='mb-3'>
                        <CustomInput
                            type={'password'}
                            name={'password'}
                            errors={errors.password}
                            placeholder={'Password'}
                            onchange={handleChange}
                            value={values.password}></CustomInput>
                    </div>
                    <div className='flex items-center justify-between my-3'>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="terms" />
                            <label
                                htmlFor="terms"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Remember me
                            </label>
                        </div>
                        <div>
                            <Link href="/password-reset" className='text-primary'>Forgot Password?</Link>
                        </div>

                    </div>
                    <ProgressButton width={'w-full'} title={'Login'} handleClick={function (): void {
                        //throw new Error('Function not implemented.');
                    }} isSubmitting={isSubmitting}></ProgressButton>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
