import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { returnEmployee } from '../utils/api';
import { DatePickerWithRange } from '@/components/ui/date-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface Employee {
    id: string;
    name: string;
    total_days: number;
}

const EmployeePage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [employee, setEmployee] = useState<Employee | null>(null);

    useEffect(() => {
        if (id) {
            const fetchEmployee = async () => {
                try {
                    const data = await returnEmployee(id as string);
                    setEmployee(data);
                } catch (error) {
                    console.error('Error fetching employee:', error);
                }
            };
            fetchEmployee();
        }
    }, [id]);

    if (!employee) {
        return <div>Loading...</div>;
    }

    return (
        <div className='flex container mx-auto px-1 md:px-20 py-5 flex-col items-center'>
            <div className='flex w-full flex-col md:flex-row'>
                <div className='w-full md:w-1/2 p-4'>
                    <Card className='p-6 mb-6'>
                        <CardContent>
                            <h1 className='text-2xl font-bold mb-4'>Employee Details</h1>
                            <p className='mb-2'><strong>Name:</strong> {employee.name}</p>
                            <p className='mb-2'><strong>ID:</strong> {employee.id}</p>
                            <p className='mb-2'><strong>Leave Days Remaining:</strong> {employee.total_days}</p>
                        </CardContent>
                    </Card>
                </div>
                <div className='w-full md:w-1/2 p-4'>
                    <Calendar />
                </div>
            </div>
            <div className='mt-6'>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button>Request Leave</Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <DatePickerWithRange />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
};

export default EmployeePage;