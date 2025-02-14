/**
 * Handle types appropriately
 */

import EmployeesListTable from "@/components/employees-table";
import { useEffect, useState } from "react";
import { returnEmployees, getRecentActivities } from "@/pages/api/utils/endpoints";
import withAuth from "@/components/context/HOC/withAuth";

interface Activity {
  user: string;
  days_requested: number;
  purpose: string;
  created_at: string;
}

const Dashboard = () =>  {
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);

  useEffect(() => {
    async function fetchData() {
      // Fetch total employees
      const employees = await returnEmployees();
      setTotalEmployees(employees.length);

      // Fetch recent activities
      const activities = await getRecentActivities();
      setRecentActivities(activities);
    }

    fetchData();
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
          <span className="font-extrabold text-xl md:text-3xl">Total Leave Days Requested</span>
          <span className="self-end text-lg md:text-3xl font-bold">
            {recentActivities.reduce((total, activity) => total + activity.days_requested, 0)}
          </span>
        </div>
      </div>
      <div className="grid auto-rows-min gap-4 grid-cols-1 md:grid-cols-2">
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-4">
          <h2 className="text-lg font-bold mb-4">Employees List</h2>
          <EmployeesListTable />
        </div>
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-4">
          <h2 className="text-lg font-bold mb-4">Recent Activity</h2>
          <div>
            {recentActivities.length > 0 ? (
              <ul className="list-disc list-inside">
                {recentActivities.map((activity, index) => (
                  <li key={index} className="mb-2">
                    <strong>{activity.user}</strong> requested leave for{" "}
                    <strong>{activity.days_requested} days</strong> (
                    {activity.purpose}) on{" "}
                    {new Date(activity.created_at).toLocaleDateString()}.
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No recent activity to show.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(Dashboard);
