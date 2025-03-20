import EmployeesListTable from "@/components/employees-table";
import { useEffect, useState } from "react";
import { returnEmployees, getRecentActivities } from "@/pages/api/utils/endpoints";
import withAuth from "@/components/context/HOC/withAuth";
import { User, Users, Calendar } from "lucide-react";

interface Activity {
  user: string;
  employee_id: string;
  days_requested: number;
  purpose: string;
  status: string;
  created_at: string;
}

const Dashboard = () => {
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
    <div className="text-black mt-6 flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 grid-cols-1 md:grid-cols-3">
        <div className="rounded-xl shadow-md hover:transition-all hover:shadow-sm bg-white/70 flex items-center p-4 h-24">
          <div className="rounded-full bg-yellow-300 p-2 mr-4">
            <Users className="text-black" />
          </div>
          <div>
            <span className="font-extrabold text-lg md:text-xl block">Total Employees</span>
            <span className="text-md md:text-xl font-bold">{totalEmployees}</span>
          </div>
        </div>
        <div className="rounded-xl shadow-md hover:transition-all hover:shadow-sm bg-white/70 flex items-center p-4 h-24">
          <div className="rounded-full bg-yellow-300 p-2 mr-4">
            <User className="text-black" />
          </div>
          <div>
            <span className="font-extrabold text-lg md:text-xl block">People on leave</span>
            <span className="text-md md:text-xl font-bold">
              {recentActivities.filter(activity => activity.purpose.toLowerCase().includes("leave")).length}
            </span>
          </div>
        </div>
        <div className="rounded-xl shadow-md hover:transition-all hover:shadow-sm bg-white/70 flex items-center p-4 h-24">
          <div className="rounded-full bg-yellow-300 p-2 mr-4">
            <Calendar className="text-black" />
          </div>
          <div>
            <span className="font-extrabold text-lg md:text-xl block">Total Leave Days Requested</span>
            <span className="text-md md:text-xl font-bold">
              {recentActivities.reduce((total, activity) => total + activity.days_requested, 0)}
            </span>
          </div>
        </div>
      </div>
      <div className="grid auto-rows-min gap-4 grid-cols-1 md:grid-cols-2">
        <div className="min-h-[100vh] shadow-md flex-1 rounded-xl bg-white/70 md:min-h-min p-4">
          <EmployeesListTable />
        </div>
        <div className="md:h-[722px] shadow-md flex-1 rounded-xl bg-white/70 md:min-h-min p-4">
          <h2 className="text-lg font-bold mb-4">Recent Activity</h2>
          <div>
            {recentActivities.length > 0 ? (
              <ul className="list-none list-inside">
                {recentActivities.map((activity, index) => (
                  <li key={index} className="shadow-md hover:shadow-sm rounded-lg p-4 my-4">
                    <span className={`tag ${activity.status === "Approved" ? "tag-approved bg-green-600 text-white py-1 px-2 rounded-full text-sm" : "tag-pending bg-red-700 text-white py-1 px-2 rounded-full text-sm"}`}>
                      {activity.status} Request
                    </span>{" "}
                    <strong>{activity.user}</strong> has {activity.status === "Approved" ? "taken leave for" : "requested"}{" "}
                    ({activity.purpose}) on{" "}
                    {new Date(activity.created_at.replace(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/, '$2/$1/$3 $4:$5')).toLocaleDateString()}.
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
