import { Users, UserCheck, Mail } from "lucide-react";
import { useEffect, useState } from "react";

import { DashboardService } from "../../services/dashboardService";

interface IOrgUserCount {
  total_users: number;
  org_name?: string;
}

interface IOrgAdminCount {
  total_admins: number;
  org_name?: string;
}

interface IEmailCount {
  total_emails: number;
  user_name: string;
}

interface IDashboardData {
  user_stats: {
    org_user_count: IOrgUserCount[];
    org_admin_count: IOrgAdminCount[];
  };
  email_stats: {
    email_count: IEmailCount[];
  };
}

const SuperAdminDashboard = () => {
  const [data, setData] = useState<IDashboardData>();
  const service = new DashboardService();

  const fetchSuperAdminData = async () => {
    const response = await service.getSuperAdminMetrics();
    setData(response);
    console.log("response", response);
  };

  useEffect(() => {
    fetchSuperAdminData();
  }, []);
  return (
    <div className="h-screen bg-gray-100 p-6 overflow-y-auto ">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* User Stats */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Users</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data?.user_stats?.org_user_count.map((org, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              <div className="flex items-center space-x-3">
                <Users className="w-6 h-6 text-blue-500" />
                <span className="text-gray-500 text-sm">{org.org_name}</span>
              </div>
              <div className="mt-2 text-2xl font-bold">{org.total_users}</div>
              <div className="text-gray-400 text-sm">Total Users</div>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Stats */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Admins</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data?.user_stats?.org_admin_count.map((org, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              <div className="flex items-center space-x-3">
                <UserCheck className="w-6 h-6 text-green-500" />
                <span className="text-gray-500 text-sm">{org.org_name}</span>
              </div>
              <div className="mt-2 text-2xl font-bold">{org.total_admins}</div>
              <div className="text-gray-400 text-sm">Total Admins</div>
            </div>
          ))}
        </div>
      </div>

      {/* Email Stats */}
      <div className="mt-8 mb-16">
        <h2 className="text-xl font-semibold mb-4">Email Activity</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data?.email_stats?.email_count.map((user, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              <div className="flex items-center space-x-3">
                <Mail className="w-6 h-6 text-purple-500" />
                <span className="text-gray-500 text-sm">{user.user_name}</span>
              </div>
              <div className="mt-2 text-2xl font-bold">{user.total_emails}</div>
              <div className="text-gray-400 text-sm">Total Emails Sent</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
