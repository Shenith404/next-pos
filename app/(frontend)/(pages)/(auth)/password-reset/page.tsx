'use client'
import { useState } from 'react';
import ConfirmOtp from './confirm_otp'; // Fixed typo in the component name
import RequestOTP from './requeset_otp';
import ResetPw from './reset';

const ResetForm = () => {
    const [section, setSection] = useState<number>(0);
    const [otp, setOtp] = useState<any>(null);
    const [email, setEmail] = useState<string>('');
    return (
        <div className='flex items-center justify-center h-screen'>
            <div className="border z-20 w-[350px] px-6 pt-2 pb-6 rounded-lg">
                {section === 0 && <RequestOTP setSection={setSection} setEmail={setEmail} />}
                {section === 1 && <ConfirmOtp setSection={setSection} setOtp={setOtp} email={email} />} {/* Fixed typo in the component name */}
                {section === 2 && <ResetPw setSection={setSection} otp={otp} email={email} />}
            </div>
        </div>
    );
};

export default ResetForm;
