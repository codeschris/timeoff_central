import { useEffect, useState } from 'react';
import { returnEmployees } from '@/pages/api/utils/endpoints';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import Link from 'next/link';

type Employee = {
    employee_id: string;
    name: string;
};

export default function EmployeesListTable() {
    const [employees, setEmployees] = useState<{ employee_id: string; name: string }[]>([]);
    const [filteredEmployees, setFilteredEmployees] = useState<{ employee_id: string; name: string }[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const data = await returnEmployees();
                const sortedData: Employee[] = data.sort((a: Employee, b: Employee) => a.name.localeCompare(b.name));
                setEmployees(sortedData);
                setFilteredEmployees(sortedData);
            } catch (err) {
                console.error(err);
            }
        };

        fetchEmployees();
    }, []);

    // Filter employees based on search term
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredEmployees(employees);
        } else {
            const filtered = employees.filter(emp =>
                emp.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredEmployees(filtered);
        }
    }, [searchTerm, employees]);

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mx-3 mb-4">
                <h2 className="text-lg font-bold">Employees List</h2>
                <Input
                    type="text"
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-1/3 bg-white p-2 border rounded-md shadow-sm"
                />
            </div>
            <div className="max-h-[68vh] overflow-auto w-full">
                <Table className="w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredEmployees.length > 0 ? (
                            filteredEmployees.map((employee) => (
                                <TableRow key={employee.employee_id}>
                                    <TableCell>
                                        <Link href={`/dashboard/employee/${employee.employee_id}`}>
                                            {employee.name}
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={1} className="text-center text-gray-500">
                                    No employees found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}