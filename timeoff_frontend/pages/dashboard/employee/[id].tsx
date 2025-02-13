/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from '@/components/ui/table';
import { returnEmployee, getLeaveHistory, fetchEmployeeLeaveLogs, fetchPendingLeaveRequests, approveLeaveRequest, fetchAttendanceRecords } from '@/pages/api/utils/endpoints';
import { PDFDownloadLink } from '@react-pdf/renderer';
import LeaveLogsPDF from '@/components/LeaveLogsPDF';
import { Button } from '@/components/ui/button';
import AttendanceTable from '@/components/attendance-table';
import ClockInOutButton from '@/components/clocking-button';
import AttendanceReportsPDF from '@/components/AttendanceRecordsPDF';

interface Employee {
    id: string;
    employee_id: string;
    email: string;
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
    const [leaveLogs, setLeaveLogs] = useState<any[]>([]);
    const [attendanceLogs, setAttendanceLogs] = useState<any[]>([]);
    const [leaveFetched, setLeaveFetched] = useState(false);
    const [attendanceFetched, setAttendanceFetched] = useState(false);

    useEffect(() => {
        if (id) {
            const fetchEmployeeData = async () => {
                try {
                    const [empData, leaveData, pendingData] = await Promise.all([
                        returnEmployee(id as string),
                        getLeaveHistory(id as string),
                        fetchPendingLeaveRequests(id as string),
                    ]);
                    setEmployee(empData);
                    setLeaveHistory(leaveData);
                    setPendingRequests(pendingData);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };

            fetchEmployeeData();
        }
    }, [id]);

    const handleFetchLeaveLogs = async () => {
        if (leaveFetched) return; // Prevent refetching
        setLoading(true);
        try {
            const data = await fetchEmployeeLeaveLogs(employee!.employee_id);
            if (data.length === 0) {
                alert("No leave logs available for this employee.");
                return;
            }
            setLeaveLogs(data);
            setLeaveFetched(true);
        } catch (error) {
            console.error("Error fetching leave logs:", error);
            alert("Failed to fetch leave logs.");
        }
        setLoading(false);
    };

    const handleFetchAttendanceLogs = async () => {
        if (attendanceFetched) return;
        setLoading(true);
        try {
            const data = await fetchAttendanceRecords(employee!.employee_id);
            if (data.length === 0) {
                alert("No attendance logs available for this employee.");
                return;
            }
            setAttendanceLogs(data);
            setAttendanceFetched(true);
        } catch (error) {
            console.error("Error fetching attendance logs:", error);
            alert("Failed to fetch attendance logs.");
        }
        setLoading(false);
    };

    const handleApprove = async (leaveId: string) => {
        try {
            await approveLeaveRequest(Number(leaveId), "approve");
            setPendingRequests(pendingRequests.filter(request => request.id !== leaveId));
            alert('Leave request approved.');
        } catch (error) {
            console.error('Error approving leave request:', error);
            alert('Failed to approve leave request.');
        }
    };

    const handleDeny = async (leaveId: string) => {
        try {
            await approveLeaveRequest(Number(leaveId), "deny");
            setPendingRequests(pendingRequests.filter(request => request.id !== leaveId));
            alert('Leave request denied.');
        } catch (error) {
            console.error('Error denying leave request:', error);
            alert('Failed to deny leave request.');
        }
    };

    if (!employee) return <div>Loading...</div>;

    return (
        <div className='flex container mx-auto px-4 md:px-20 py-5 flex-col items-center'>
            <div className='flex w-full flex-col md:flex-row'>
                <div className='w-full md:w-1/2'>
                    <Card className='p-6 mb-6'>
                        <CardContent>
                            <h1 className='text-2xl font-bold mb-4'>Employee Details</h1>
                            <p className='mb-2'><strong>Name:</strong> {employee.name}</p>
                            <p className='mb-2'><strong>ID:</strong> {employee.employee_id}</p>
                            <p className='mb-2'><strong>Email:</strong> {employee.email}</p>
                            <p className='mb-2'><strong>Role:</strong> {employee.role}</p>  
                            <p className='mb-2'><strong>Leave Days Taken:</strong> {leaveHistory.reduce((total, leave) => total + leave.days_requested, 0)}</p>
                            <ClockInOutButton employee_id={employee.employee_id} />
                        </CardContent>
                    </Card>
                </div>
                {/** Logs download buttons for employee */}
                <div className='w-full md:mx-3 md:w-1/2 flex flex-col gap-5'>
                    <Card className='p-5'>
                        <CardContent>
                            <h2 className='text-lg font-bold mb-2'>Download Logs</h2>
                            <p className='text-muted-foreground mb-3'>Click on the buttons to fetch and download logs for {employee.name}</p>
                            <div className="flex flex-col gap-3">
                                {/* Leave Logs Section */}
                                <div className={`flex items-center w-full ${leaveFetched ? "justify-middle" : "justify-start"}`}>
                                    <Button onClick={handleFetchLeaveLogs} className="md:w-1/3" disabled={leaveFetched || loading}>
                                        {loading ? "Fetching..." : leaveFetched ? "Fetched" : "Fetch Leave Logs"}
                                    </Button>
                                    {leaveFetched && (
                                        <PDFDownloadLink
                                            document={<LeaveLogsPDF logs={leaveLogs} employeeName={employee.name} />}
                                            fileName={`leave-logs-${employee.name}.pdf`}
                                            className="bg-green-500 text-white md:w-1/3 mx-4 px-4 py-2 rounded"
                                        >
                                            Download Leave Logs
                                        </PDFDownloadLink>
                                    )}
                                </div>

                                {/* Attendance Logs Section */}
                                <div className={`flex items-center w-full ${attendanceFetched ? "justify-middle" : "justify-start"}`}>
                                    <Button onClick={handleFetchAttendanceLogs} className="md:w-1/3" disabled={attendanceFetched || loading}>
                                        {loading ? "Fetching..." : attendanceFetched ? "Fetched" : "Fetch Attendance Logs"}
                                    </Button>
                                    {attendanceFetched && (
                                        <PDFDownloadLink
                                            document={<AttendanceReportsPDF logs={attendanceLogs} employeeName={employee.name} />}
                                            fileName={`attendance-reports-${employee.name}.pdf`}
                                            className="bg-green-500 text-white md:w-1/3 mx-4 px-4 py-2 rounded"
                                        >
                                            Download Attendance Report
                                        </PDFDownloadLink>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
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
