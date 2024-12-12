import EmployeesListTable from "@/components/employees-table";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
      <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">
        <span>Total Employees: 100</span>
      </div>
      <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">
        <span>People on Leave: 5</span>
      </div>
      <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">
        <span>Total Leave Days Taken: 200</span>
      </div>
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-4">
      <h2 className="text-lg font-bold mb-4">Employees List</h2>
      <EmployeesListTable />
      </div>
    </div>
  );
}
