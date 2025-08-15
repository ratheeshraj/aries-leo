import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export const VerifyOtp: React.FC = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const { verifyOtp, resendOtp } = useAuth();

  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setVerifyLoading(true);

    const trimedOtp = otp.trim();

    const success = await verifyOtp(email, trimedOtp);
    if (!success) {
      setError('Invalid or expired OTP. Please try again.');
    }

    setVerifyLoading(false);
  };

  const handleResend = async () => {
    setError('');
    setMessage('');
    setResendLoading(true);

    const success = await resendOtp(email);
    if (success) {
      setMessage('A new OTP has been sent to your email.');
    } else {
      setError('Failed to resend OTP. Please try again.');
    }

    setResendLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <h2 className="text-2xl font-bold">Verify Your Email</h2>
      <p className="mt-2 text-gray-600">
        We’ve sent a verification code to <strong>{email}</strong>
      </p>

      {error && <p className="mt-4 text-red-500">{error}</p>}
      {message && <p className="mt-4 text-green-600">{message}</p>}

      <form className="mt-6 w-full max-w-sm space-y-4" onSubmit={handleVerify}>
        <Input
          label="Enter OTP"
          value={otp}
          onChange={(val) => setOtp(val)}
          placeholder="123456"
          required
        />
        <Button type="submit" variant="primary" className="w-full" disabled={verifyLoading}>
          {verifyLoading ? 'Verifying...' : 'Verify Email'}
        </Button>
      </form>

      <div className="mt-4">
        <button
          type="button"
          onClick={handleResend}
          className="text-sm text-accent-rose hover:underline disabled:opacity-50"
          disabled={resendLoading}
        >
          {resendLoading ? 'Resending...' : 'Resend OTP'}
        </button>
      </div>
    </div>
  );
};
