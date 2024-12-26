import { useEffect, useState } from 'react';
import { returnEmployees } from '@/pages/api/utils/endpoints';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import Link from 'next/link';

export default function EmployeesListTable() {
    const [employees, setEmployees] = useState<{ employee_id: string; name: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const data = await returnEmployees(); // Fetch data from API
                setEmployees(data); // Set the fetched employees
            } catch (err) {
                console.error(err);
                setError('Failed to load employees');
            } finally {
                setLoading(false); // Stop loading spinner
            }
        };

        fetchEmployees();
    }, []);

    if (loading) return <div>Loading employees...</div>;
    if (error) return <div>{error}</div>;

    return (
        <Table className="container mx-auto px-12">
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {employees.map((employee) => (
                    <TableRow key={employee.employee_id}>
                        <TableCell>
                            <Link href={`/employee/${employee.employee_id}`}>
                                {employee.name}
                            </Link>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}