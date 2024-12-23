import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { searchUser, returnEmployees } from '../utils/api';

interface Employee {
    employee_id: number;
    name: string;
}

export default function SearchEmployees() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
    const [allEmployees, setAllEmployees] = useState<Employee[]>([]);

    useEffect(() => {
        const fetchAllEmployees = async () => {
            const employees = await returnEmployees();
            setAllEmployees(employees);
        };

        fetchAllEmployees();
    }, []);

    useEffect(() => {
        const fetchEmployees = async () => {
            if (searchTerm) {
                const results = await searchUser(searchTerm);
                setFilteredEmployees(results);
            } else {
                setFilteredEmployees(allEmployees);
            }
        };

        fetchEmployees();
    }, [searchTerm, allEmployees]);

    return (
        <div className='w-3/4 mx-auto'>
            <h1 className='text-left font-extrabold text-lg my-4'>Search Employees</h1>
            <Input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: '20px', width: '100%' }}
            />
            <h1 className='text-left font-extrabold text-lg'>Search Results</h1>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredEmployees.map(employee => (
                        <TableRow 
                            key={employee.employee_id} 
                            onClick={() => window.location.href = `/employee/${employee.employee_id}`}
                            style={{ cursor: 'pointer' }}
                        >
                            <TableCell>{employee.name}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};