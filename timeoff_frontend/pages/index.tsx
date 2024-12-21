import EmployeesListTable from "@/components/employees-table";
import { useEffect, useState } from "react";
import { returnEmployees } from "./utils/api";

export default function Home() {
  const [totalEmployees, setTotalEmployees] = useState(0);

useEffect(() => {
  async function fetchTotalEmployees() {
    const response = await returnEmployees();
    setTotalEmployees(response.length);
  }
  fetchTotalEmployees();
}, []);
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 grid-cols-2 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50 flex flex-col justify-between p-2 md:p-4">
          <span className="font-extrabold text-xl md:text-3xl">Total Employees</span>
          <span className="self-end text-lg md:text-3xl font-bold">{totalEmployees}</span>
        </div>
        <div className="aspect-video rounded-xl bg-muted/50 flex flex-col justify-between p-2 md:p-4">
          <span className="font-extrabold text-xl md:text-3xl">People on leave</span>
          <span className="self-end text-lg md:text-3xl font-bold">5</span>
        </div>
        <div className="aspect-video rounded-xl bg-muted/50 flex flex-col justify-between p-2 md:p-4">
          <span className="font-extrabold text-xl md:text-3xl">Total Leave Days Taken</span>
          <span className="self-end text-lg md:text-3xl font-bold">100</span>
        </div>
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-4">
        <h2 className="text-lg font-bold mb-4">Employees List</h2>
        <EmployeesListTable />
      </div>
    </div>
  );
}
