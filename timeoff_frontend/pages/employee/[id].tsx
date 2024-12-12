import React from 'react';
import { useRouter } from 'next/router';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const EmployeePage = () => {
    const router = useRouter();
    const { id } = router.query;

    // Dummy data
    const employee = {
        name: 'John Doe',
        id: id,
        leaveDaysRemaining: Math.floor(Math.random() * 20) + 1,
    };

    const handleRequestLeave = () => {
        // Handle leave request logic here
        alert('Leave requested!');
        
    };

    return (
        <div className='flex container mx-auto px-1 md:px-20 py-5 flex-col items-center'>
            <div className='flex w-full flex-col md:flex-row'>
            <div className='w-full md:w-1/2 p-4'>
                <Card className='p-6 mb-6'>
                <CardContent>
                    <h1 className='text-2xl font-bold mb-4'>Employee Details</h1>
                    <p className='mb-2'><strong>Name:</strong> {employee.name}</p>
                    <p className='mb-2'><strong>ID:</strong> {employee.id}</p>
                    <p className='mb-2'><strong>Leave Days Remaining:</strong> {employee.leaveDaysRemaining}</p>
                </CardContent>
                </Card>
            </div>
            <div className='w-full md:w-1/2 p-4'>
                <Calendar />
            </div>
            </div>
            <div className='mt-6'>
            <Button onClick={handleRequestLeave}>Request Leave</Button>
            </div>
        </div>
    );
};

export default EmployeePage;