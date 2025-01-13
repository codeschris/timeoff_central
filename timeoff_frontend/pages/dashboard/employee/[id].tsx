import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from '@/components/ui/table';
import { returnEmployee, getLeaveHistory } from '@/pages/api/utils/endpoints';

interface Employee {
    id: string;
    employee_id: string;
    name: string;
    total_days: number;
    days_taken: number;
}

interface LeaveHistory {
    id: string;
    start_date: string;
    end_date: string;
    purpose: string;
    days_requested: number;
    created_at: string;
}

const EmployeePage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [leaveHistory, setLeaveHistory] = useState<LeaveHistory[]>([]);

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

            const fetchLeaveHistory = async () => {
                try {
                    const history = await getLeaveHistory(id as string);
                    setLeaveHistory(history);
                } catch (error) {
                    console.error('Error fetching leave history:', error);
                }
            };

            fetchEmployee();
            fetchLeaveHistory();
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
                            <p className='mb-2'><strong>ID:</strong> {employee.employee_id}</p>
                            <p className='mb-2'><strong>Leave Days Taken:</strong> {employee.days_taken}</p>
                        </CardContent>
                    </Card>
                </div>
                {/*<div className='w-full md:w-1/2 p-4'>
                    <Calendar />
                </div>*/}
            </div>

            {/* Leave History Section */}
            <div className='w-full mt-6'>
                <Card>
                    <CardContent>
                        <h2 className='text-xl font-bold my-4'>Leave History</h2>
                        {leaveHistory.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Start Date</TableHead>
                                        <TableHead>End Date</TableHead>
                                        <TableHead>Purpose</TableHead>
                                        <TableHead>Days Requested</TableHead>
                                        <TableHead>Request Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {leaveHistory.map((leave) => (
                                        <TableRow key={leave.id}>
                                            <TableCell>{leave.start_date}</TableCell>
                                            <TableCell>{leave.end_date}</TableCell>
                                            <TableCell>{leave.purpose}</TableCell>
                                            <TableCell>{leave.days_requested}</TableCell>
                                            <TableCell>{leave.created_at}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <p className="text-muted-foreground">No leave history available.</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Leave Request Section */}
            {/*<div className='mt-6'>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button>Request Leave</Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <DatePickerWithRange />
                    </PopoverContent>
                </Popover>
            </div>*/}
        </div>
    );
};

export default EmployeePage;