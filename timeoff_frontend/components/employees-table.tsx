import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import Link from 'next/link';

const employees = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Alice Johnson' },
];

export default function EmployeesListTable() {
    return (
        <Table className="container mx-auto px-12">
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Name</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {employees.map(employee => (
                    <TableRow key={employee.id}>
                        <TableCell className="font-medium">
                            <Link href={`/employee/${employee.id}`}>
                                {employee.id}
                            </Link>
                        </TableCell>
                        <TableCell>
                            <Link href={`/employee/${employee.id}`}>
                                {employee.name}
                            </Link>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}