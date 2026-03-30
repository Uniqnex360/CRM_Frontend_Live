import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

import {
  Search,
  Building2,
  Users,
  List,
  Send,
  BarChart3,
  Settings,
  Sparkles,
  LogOut,
  icons,
  User,
} from "lucide-react";

import OrganizationPage from "./pages/Organization/Organization";
import UserPage from "./pages/User/UserPage";
import SearchTab from "./components/SearchTab";
import CompaniesTab from "./components/CompaniesTab";
import ListsTab from "./components/ListsTab";
import SequencesTab from "./components/SequencesTab";
import AnalyticsTab from "./components/AnalyticsTab";
import SettingsTab from "./components/SettingsTab";
import LeadEnrichmentTab from "./components/LeadEnrichmentTab";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

type Tab =
  | "organization"
  | "user"
  | "search"
  | "companies"
  | "lists"
  | "enrichment"
  | "sequences"
  | "analytics"
  | "settings";

function DashboardLayout() {
  const [activeTab, setActiveTab] = useState<Tab>("search");
  const { user, logout } = useAuth();

  let tabs = [
    { id: "search" as Tab, label: "Leads", icon: Search },
    { id: "companies" as Tab, label: "Companies", icon: Building2 },
    { id: "lists" as Tab, label: "Lists", icon: List },
    { id: "enrichment" as Tab, label: "Lead Enrichment", icon: Sparkles },
    { id: "sequences" as Tab, label: "Sequences", icon: Send },
    { id: "analytics" as Tab, label: "Analytics", icon: BarChart3 },
    { id: "settings" as Tab, label: "Settings", icon: Settings },
  ];

  if (user?.role === "super_admin") {
    tabs = [
      { id: "organization" as Tab, label: "Organization", icon: Users },
      { id: "user" as Tab, label: "Users", icon: User },
      ...tabs,
    ];
  }

  const renderContent = () => {
    switch (activeTab) {
      case "organization":
        return <OrganizationPage />;
      case "user":
        return <UserPage />;
      case "search":
        return <SearchTab />;
      case "companies":
        return <CompaniesTab />;
      case "lists":
        return <ListsTab />;
      case "enrichment":
        return <LeadEnrichmentTab />;
      case "sequences":
        return <SequencesTab />;
      case "analytics":
        return <AnalyticsTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return <SearchTab />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50">
      {/* parent div for flex */}
      <div className="h-screen flex flex-col overflow-hidden">
        {/* header */}
        <header className="border-b border-slate-200 sticky top-0">
          <div className="mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">
                    SalesIntel
                  </h1>
                  <p className="text-xs text-slate-500">
                    B2B Sales Intelligence Platform
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right hidden md:block">
                  <p className="text-xs text-slate-500">Logged in as</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {user?.name || user?.email || "User"}
                  </p>
                </div>
                <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 text-sm text-slate-600 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>
        <div className="flex flex-1">
          {/* side bar */}
          <div className="w-[16%] h-full border-r ">
            <nav className="p-4 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                    ${
                      activeTab === tab.id
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-700 hover:bg-slate-50"
                    }
                  `}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
          {/* content */}
          <div className="flex-1 h-full">
            <main className="flex-1 flex flex-col overflow-hidden min-h-0">
              {renderContent()}
            </main>
          </div>
        </div>
      </div>

      {/* <div className="flex">
        <aside className="w-64 bg-white border-r border-slate-200 h-[calc(100vh-73px)] fixed top-[73px] left-0 overflow-y-auto">
          <nav className="p-4 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                    ${
                      activeTab === tab.id
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-700 hover:bg-slate-50"
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 p-6 ml-64">{renderContent()}</main>
      </div> */}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
              padding: "16px",
              borderRadius: "8px",
            },
          }}
        />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
