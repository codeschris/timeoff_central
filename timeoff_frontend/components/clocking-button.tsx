import React, { useState } from 'react';
import { clockInOut } from '@/pages/api/utils/endpoints';
import { Button } from './ui/button';

const ClockInOutButton = ({ employee_id }: { employee_id: string }) => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleClockInOut = async () => {
        setLoading(true);
        setMessage('');
        try {
            const result = await clockInOut(employee_id);
            setMessage(result.message);
        } catch {
            setMessage("Failed to clock in/out.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='mt-4'>
            <Button className='mt-3' onClick={handleClockInOut} disabled={loading}>
                {loading ? 'Processing...' : 'Clock In/Out'}
            </Button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ClockInOutButton;
