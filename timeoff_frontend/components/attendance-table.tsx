import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fetchAttendanceRecords } from "@/pages/api/utils/endpoints";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface AttendanceRecord {
    date: string;
    clock_in: string | null;
    clock_out: string | null;
}

export default function AttendanceRecord() {
    const router = useRouter();
    const { id } = router.query;
    const [records, setRecords] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id){
            const fetchRecords = async () => {
                setLoading(true);
                try {
                    const data = await fetchAttendanceRecords(id as string);
                    setRecords(data);
                } catch (error) {
                    console.error("Error fetching attendance records:", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchRecords();
        }
    }, [id]);

    return (
        <div className="col-span-1 md:col-span-2">
            <Card className="shadow-md">
                <CardContent>
                    <h2 className="text-xl font-bold mx-4 my-4">Attendance Record</h2>
                    
                    {loading ? (
                        <p>Loading...</p>
                    ) : records.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Clock In</TableHead>
                                    <TableHead>Clock Out</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {records.map((record, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{record.date}</TableCell>
                                        <TableCell>{record.clock_in || "N/A"}</TableCell>
                                        <TableCell>{record.clock_out || "N/A"}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <p className="text-muted-foreground">No attendance records found.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
