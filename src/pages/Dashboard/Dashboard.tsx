import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Users, Mail, Building, MapPin, BarChart3 } from "lucide-react";
import { DashboardService } from "../../services/dashboardService";

interface ILead {
  name: string;
  id: string;
}

interface ICount {
  count: number;
}

interface IIndustry {
  industry_name: string;
  count: number;
}

interface ILocation {
  location: string;
  count: number;
}

interface ICompany {
  company_name: string;
  count: number;
}

interface ISubject {
  _id: string;
  count: number;
}

interface IDashboardData {
  leads: {
    total_leads: ICount[];
    leads: ILead[];
    industry_outreach: IIndustry[];
    location_outreach: ILocation[];
    companies_reached: ICompany[];
  };
  emails: {
    total_emails: ICount[];
    subject_outreach: ISubject[];
  };
  Total_users: number;
}

/* 🔹 Modern Card */
const Card = ({ icon, title, value }: any) => (
  <div className="group bg-white/70 backdrop-blur-lg border border-gray-200 p-5 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex items-center gap-4">
    <div className="p-3 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 text-white shadow-md group-hover:scale-110 transition">
      {icon}
    </div>

    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-2xl font-bold text-gray-800">{value}</h2>
    </div>
  </div>
);

/* 🔹 Section Wrapper (UPDATED) */
const Section = ({ title, children }: any) => (
  <div className="bg-white/70 backdrop-blur-lg border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition h-[320px] flex flex-col">
    {/* Header */}
    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-between shrink-0">
      {title}
    </h2>

    {/* Scrollable Content */}
    <div className="space-y-3 overflow-y-auto pr-1 flex-1">{children}</div>
  </div>
);

/* 🔹 List Item */
const Item = ({ label, icon }: any) => (
  <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition">
    <div className="flex items-center gap-3 text-gray-700">
      {icon && <span className="text-gray-400">{icon}</span>}
      <span className="text-sm font-medium">{label}</span>
    </div>

    <span className="text-xs text-gray-400">•</span>
  </div>
);

/* 🔹 Empty State */
const Empty = () => (
  <div className="text-center py-6 text-gray-400 text-sm">
    No data available
  </div>
);

const Dashboard = () => {
  const service = new DashboardService();
  const [data, setData] = useState<IDashboardData | null>(null);

  const fetchDashboardData = async () => {
    try {
      const response = await service.getDasboardData();
      setData(response);
    } catch (error: any) {
      toast.error("API failed");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const totalLeads = data?.leads.total_leads?.[0]?.count || 0;
  const totalEmails = data?.emails.total_emails?.[0]?.count || 0;
  const totalUsers = data?.Total_users || 0;

  return (
    <div className="h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6 overflow-y-auto">
      {/* 🔥 Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm">
          Welcome back — here’s what’s happening today 🚀
        </p>
      </div>

      {/* 🔥 Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <Card
          icon={<Users size={22} />}
          title="Total Users"
          value={totalUsers}
        />
        <Card
          icon={<BarChart3 size={22} />}
          title="Total Leads"
          value={totalLeads}
        />
        <Card
          icon={<Mail size={22} />}
          title="Total Emails"
          value={totalEmails}
        />
      </div>

      {/* 🔥 Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
        {/* 🧑 Leads */}
        <Section title="Leads">
          {data?.leads.leads.length ? (
            data.leads.leads.map((lead) => (
              <>
                <Item key={lead.id} label={lead.name} />
              </>
            ))
          ) : (
            <Empty />
          )}
        </Section>

        {/* 🏢 Companies */}
        <Section title="Companies Reached">
          {data?.leads.companies_reached.length ? (
            data.leads.companies_reached.map((c, i) => (
              <Item
                key={i}
                label={`${c.company_name} (${c.count})`}
                icon={<Building size={16} />}
              />
            ))
          ) : (
            <Empty />
          )}
        </Section>

        {/* 📍 Locations */}
        <Section title="Locations">
          {data?.leads.location_outreach.length ? (
            data.leads.location_outreach.map((loc, i) => (
              <Item
                key={i}
                label={`${loc.location} (${loc.count})`}
                icon={<MapPin size={16} />}
              />
            ))
          ) : (
            <Empty />
          )}
        </Section>

        {/* 📧 Email Subjects */}
        <Section title="Email Subjects">
          {data?.emails.subject_outreach.length ? (
            data.emails.subject_outreach.map((sub, i) => (
              <Item key={i} label={`${sub._id} (${sub.count})`} />
            ))
          ) : (
            <Empty />
          )}
        </Section>
      </div>
    </div>
  );
};

export default Dashboard;
