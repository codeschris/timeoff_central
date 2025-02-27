import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from '@/components/ui/table';
import { returnEmployee, getLeaveHistory, fetchPendingLeaveRequests } from '@/pages/api/utils/endpoints';
import { DatePickerWithRange } from '@/components/ui/date-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import ClockInOutButton from '@/components/clocking-button';

interface Employee {
    id: string;
    employee_id: string;
    name: string;
    role: string;
    email: string;
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

interface PendingLeaveRequest {
    id: string;
    start_date: string;
    end_date: string;
    purpose: string;
    days_requested: number;
    status: string;
}

const EmployeePage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [leaveHistory, setLeaveHistory] = useState<LeaveHistory[]>([]);
    const [pendingRequests, setPendingRequests] = useState<PendingLeaveRequest[]>([]);

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

            const fetchPendingRequests = async () => {
                try {
                    const requests = await fetchPendingLeaveRequests(id as string);
                    setPendingRequests(requests);
                } catch (error) {
                    console.error('Error fetching pending leave requests:', error);
                }
            };

            fetchEmployee();
            fetchLeaveHistory();
            fetchPendingRequests();
        }
    }, [id]);

    if (!employee) {
        return <div>Loading...</div>;
    }

    return (
        <div className='flex container mx-auto px-4 md:px-20 py-5 flex-col items-center'>
            <div className='flex w-full gap-6 flex-col md:flex-row'>
                <div className='w-1/2'>
                    <Card className='p-6 mb-6'>
                        <CardContent>
                            <h1 className='text-2xl font-bold mb-4'>Employee Details</h1>
                            <p className='mb-2'><strong>Name:</strong> {employee.name}</p>
                            <p className='mb-2'><strong>ID:</strong> {employee.employee_id}</p>
                            <p className='mb-2'><strong>Email:</strong> {employee.email}</p>
                            <p className='mb-2'><strong>Role:</strong> {employee.role}</p>
                            <p className='mb-2'><strong>Leave Days Taken:</strong> {leaveHistory.reduce((total, leave) => total + leave.days_requested, 0)}</p>
                            <p className='text-sm text-muted-foreground'>When clocking in, click the button. Do the same when clocking out</p>
                            <div className='flex gap-3'>
                                <ClockInOutButton employee_id={employee.employee_id} />
                                {/* Leave Request Section */}
                                <div className='mt-7'>
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
                        </CardContent>
                    </Card>
                </div>
                <div className='w-1/2'>
                    <Card>
                        <CardContent>
                            <h2 className='text-xl font-bold my-4'>Approved Leaves</h2>
                            {leaveHistory.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Start Date</TableHead>
                                            <TableHead>End Date</TableHead>
                                            <TableHead>Purpose</TableHead>
                                            <TableHead>Days Requested</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {leaveHistory.map((leave) => (
                                            <TableRow key={leave.id}>
                                                <TableCell>{leave.start_date}</TableCell>
                                                <TableCell>{leave.end_date}</TableCell>
                                                <TableCell>{leave.purpose}</TableCell>
                                                <TableCell>{leave.days_requested}</TableCell>
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
            </div>

            <div className="w-full grid mt-6">
                {/* Pending Leave Requests Section */}
                <div className='w-full'>
                    <Card>
                        <CardContent>
                            <h2 className='text-xl font-bold my-4'>Pending Leave Requests</h2>
                            {pendingRequests.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Start Date</TableHead>
                                            <TableHead>End Date</TableHead>
                                            <TableHead>Purpose</TableHead>
                                            <TableHead>Days Requested</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {pendingRequests.map((request) => (
                                            <TableRow key={request.id}>
                                                <TableCell>{request.start_date}</TableCell>
                                                <TableCell>{request.end_date}</TableCell>
                                                <TableCell>{request.purpose}</TableCell>
                                                <TableCell>{request.days_requested}</TableCell>
                                                <TableCell>{request.status}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <p className="text-muted-foreground">No pending leave requests.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default EmployeePage;
