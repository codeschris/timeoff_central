/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from '@/components/ui/table';
import { returnEmployee, getLeaveHistory, fetchEmployeeLeaveLogs, fetchPendingLeaveRequests, approveLeaveRequest } from '@/pages/api/utils/endpoints';
import { PDFDownloadLink } from '@react-pdf/renderer';
import LeaveLogsPDF from '@/components/LeaveLogsPDF';
import { Button } from '@/components/ui/button';
import AttendanceTable from '@/components/attendance-table';
import ClockInOutButton from '@/components/clocking-button';

interface Employee {
    id: string;
    employee_id: string;
    name: string;
    role: string;
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
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState<any[]>([]);

    const handleFetchLogs = async (employee_id: string) => {
        setLoading(true);
        try {
            const data = await fetchEmployeeLeaveLogs(employee_id);
            if (data.length === 0) {
                alert("No leave logs available for this employee.");
                setLoading(false);
                return;
            }
            setLogs(data);
        } catch (error) {
            console.error("Error fetching logs:", error);
            alert("Failed to fetch leave logs.");
        }
        setLoading(false);
    };

    const handleApprove = async (id: string) => {
        try {
            await approveLeaveRequest(Number(id), "approve"); // Convert id to number
            setPendingRequests(pendingRequests.filter(request => request.id !== id));
            alert('Leave request approved.');
        } catch (error) {
            console.error('Error approving leave request:', error);
            alert('Failed to approve leave request.');
        }
    };
    
    const handleDeny = async (id: string) => {
        try {
            await approveLeaveRequest(Number(id), "deny"); // Convert id to number
            setPendingRequests(pendingRequests.filter(request => request.id !== id));
            alert('Leave request denied.');
        } catch (error) {
            console.error('Error denying leave request:', error);
            alert('Failed to deny leave request.');
        }
    };

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
            <div className='flex w-full flex-col md:flex-row'>
                <div className='w-full md:w-1/2'>
                    <Card className='p-6 mb-6'>
                        <CardContent>
                            <h1 className='text-2xl font-bold mb-4'>Employee Details</h1>
                            <p className='mb-2'><strong>Name:</strong> {employee.name}</p>
                            <p className='mb-2'><strong>ID:</strong> {employee.employee_id}</p>
                            <p className='mb-2'><strong>Role:</strong> {employee.role}</p>  
                            <p className='mb-2'><strong>Leave Days Taken:</strong> {leaveHistory.reduce((total, leave) => total + leave.days_requested, 0)}</p>
                            <ClockInOutButton employee_id={employee.employee_id} />
                        </CardContent>
                    </Card>
                </div>
                <div className='w-full md:w-1/2 p-5'>
                    <h2 className='text-lg font-bold'>Leave Logs</h2>
                    <p className='text-md text-muted-foreground mb-5'>Download the employee&apos;s approved leave logs using the button below</p>
                    <Button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={() => handleFetchLogs(employee.employee_id)}
                        disabled={loading}
                    >
                        {loading ? "Fetching..." : "Fetch Leave Logs"}
                    </Button>

                    {logs.length > 0 && (
                        <PDFDownloadLink
                            document={<LeaveLogsPDF logs={logs} employeeName={employee.name} />}
                            fileName={`leave-logs-${employee.name}.pdf`}
                            className="bg-green-500 text-white px-4 py-2 rounded ml-2"
                        >
                            Download Logs
                        </PDFDownloadLink>
                    )}
                </div>
            </div>

            <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
                {/* Pending Leave Requests Section */}
                <div>
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
                                            <TableHead>Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {pendingRequests.map((leave) => (
                                            <TableRow key={leave.id}>
                                                <TableCell>{leave.start_date}</TableCell>
                                                <TableCell>{leave.end_date}</TableCell>
                                                <TableCell>{leave.purpose}</TableCell>
                                                <TableCell>{leave.days_requested}</TableCell>
                                                <TableCell>
                                                    <button
                                                        className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                                                        onClick={() => handleApprove(leave.id)}
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        className="bg-red-500 text-white px-3 py-1 rounded"
                                                        onClick={() => handleDeny(leave.id)}
                                                    >
                                                        Deny
                                                    </button>
                                                </TableCell>
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

                {/* Leave History Section */}
                <div>
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

                {/* Attendance Record Section */}
                <AttendanceTable/>
            </div>
        </div>
    );
};

export default EmployeePage;
