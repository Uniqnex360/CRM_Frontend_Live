import React, { useState } from "react";
import {
  Search,
  Filter,
  Download,
  Plus,
  Mail,
  Linkedin,
  MapPin,
  Building2,
  Briefcase,
  Star,
  Phone,
  Tag,
  Upload,
  Loader2,
} from "lucide-react";
import { LeadService } from "../services/leadService";
import toast from "react-hot-toast";
import { Lead } from "../interfaces/lead_interface";
import { useEffect } from "react";
const leadService = new LeadService();
// interface Contact {
//   id: string;
//   firstName: string;
//   lastName: string;
//   title: string;
//   company: string;
//   companyDomain?: string;
//   location: string;
//   city?: string;
//   state?: string;
//   country?: string;
//   email: string;
//   emailStatus: "verified" | "unverified" | "likely";
//   phone?: string;
//   mobilePhone?: string;
//   directPhone?: string;
//   linkedinUrl?: string;
//   department: string;
//   seniority: string;
//   industry?: string;
//   keywords?: string[];
//   photoUrl?: string;
//   companySize?: string;
//   revenue?: string;
// }

// const mockContacts: Contact[] = [
//   {
//     id: "1",
//     firstName: "Sarah",
//     lastName: "Johnson",
//     title: "VP of Marketing",
//     company: "TechCorp Inc",
//     companyDomain: "techcorp.com",
//     location: "San Francisco, CA",
//     city: "San Francisco",
//     state: "CA",
//     country: "United States",
//     email: "sarah.johnson@techcorp.com",
//     emailStatus: "verified",
//     phone: "+1 (415) 555-0123",
//     directPhone: "+1 (415) 555-0124",
//     linkedinUrl: "https://linkedin.com/in/sarahjohnson",
//     department: "Marketing",
//     seniority: "VP",
//     industry: "Software",
//     keywords: ["B2B Marketing", "SaaS", "Growth"],
//     companySize: "1,000-5,000",
//     revenue: "$100M-$500M",
//   },
//   {
//     id: "2",
//     firstName: "Michael",
//     lastName: "Chen",
//     title: "Director of Sales",
//     company: "InnovateHub",
//     companyDomain: "innovatehub.com",
//     location: "New York, NY",
//     city: "New York",
//     state: "NY",
//     country: "United States",
//     email: "michael.chen@innovatehub.com",
//     emailStatus: "verified",
//     phone: "+1 (212) 555-0189",
//     mobilePhone: "+1 (917) 555-0190",
//     linkedinUrl: "https://linkedin.com/in/michaelchen",
//     department: "Sales",
//     seniority: "Director",
//     industry: "Technology",
//     keywords: ["Enterprise Sales", "SaaS", "B2B"],
//     companySize: "500-1,000",
//     revenue: "$50M-$100M",
//   },
//   {
//     id: "3",
//     firstName: "Emily",
//     lastName: "Rodriguez",
//     title: "Chief Technology Officer",
//     company: "DataSphere",
//     companyDomain: "datasphere.io",
//     location: "Austin, TX",
//     city: "Austin",
//     state: "TX",
//     country: "United States",
//     email: "e.rodriguez@datasphere.io",
//     emailStatus: "likely",
//     phone: "+1 (512) 555-0189",
//     directPhone: "+1 (512) 555-0190",
//     linkedinUrl: "https://linkedin.com/in/emilyrodriguez",
//     department: "Engineering",
//     seniority: "C-Level",
//     industry: "Data Analytics",
//     keywords: ["AI", "Machine Learning", "Big Data"],
//     companySize: "200-500",
//     revenue: "$20M-$50M",
//   },
//   {
//     id: "4",
//     firstName: "David",
//     lastName: "Kim",
//     title: "Head of Product",
//     company: "CloudNine Systems",
//     companyDomain: "cloudnine.com",
//     location: "Seattle, WA",
//     city: "Seattle",
//     state: "WA",
//     country: "United States",
//     email: "david.kim@cloudnine.com",
//     emailStatus: "verified",
//     phone: "+1 (206) 555-0145",
//     mobilePhone: "+1 (425) 555-0146",
//     linkedinUrl: "https://linkedin.com/in/davidkim",
//     department: "Product",
//     seniority: "VP",
//     industry: "Cloud Computing",
//     keywords: ["Product Management", "Cloud", "DevOps"],
//     companySize: "1,000-5,000",
//     revenue: "$200M-$500M",
//   },
//   {
//     id: "5",
//     firstName: "Jennifer",
//     lastName: "Martinez",
//     title: "Senior Sales Manager",
//     company: "Enterprise Solutions Co",
//     companyDomain: "enterprisesolutions.com",
//     location: "Boston, MA",
//     city: "Boston",
//     state: "MA",
//     country: "United States",
//     email: "j.martinez@enterprisesolutions.com",
//     emailStatus: "likely",
//     phone: "+1 (617) 555-0178",
//     linkedinUrl: "https://linkedin.com/in/jennifermartinez",
//     department: "Sales",
//     seniority: "Manager",
//     industry: "Business Services",
//     keywords: ["Enterprise Sales", "Account Management", "B2B"],
//     companySize: "5,000-10,000",
//     revenue: "$500M-$1B",
//   },
// ];

export default function SearchTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [showFilters, setShowFilters] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    title: "",
    company: "",
    location: "",
    department: "",
    seniority: "",
    industry: "",
    keywords: "",
  });

  // const filteredContacts = mockContacts.filter((contact) => {
  //   const matchesSearch =
  //     searchQuery === "" ||
  //     `${contact.firstName} ${contact.lastName} ${contact.title} ${contact.company} ${contact.email} ${contact.phone || ""}`
  //       .toLowerCase()
  //       .includes(searchQuery.toLowerCase());

  //   const matchesTitle =
  //     !filters.title ||
  //     contact.title.toLowerCase().includes(filters.title.toLowerCase());
  //   const matchesCompany =
  //     !filters.company ||
  //     contact.company.toLowerCase().includes(filters.company.toLowerCase());
  //   const matchesLocation =
  //     !filters.location ||
  //     contact.location.toLowerCase().includes(filters.location.toLowerCase());
  //   const matchesDepartment =
  //     !filters.department ||
  //     contact.department
  //       .toLowerCase()
  //       .includes(filters.department.toLowerCase());
  //   const matchesSeniority =
  //     !filters.seniority ||
  //     contact.seniority.toLowerCase().includes(filters.seniority.toLowerCase());
  //   const matchesIndustry =
  //     !filters.industry ||
  //     (contact.industry &&
  //       contact.industry
  //         .toLowerCase()
  //         .includes(filters.industry.toLowerCase()));
  //   const matchesKeywords =
  //     !filters.keywords ||
  //     (contact.keywords &&
  //       contact.keywords.some((k) =>
  //         k.toLowerCase().includes(filters.keywords.toLowerCase()),
  //       ));

  //   return (
  //     matchesSearch &&
  //     matchesTitle &&
  //     matchesCompany &&
  //     matchesLocation &&
  //     matchesDepartment &&
  //     matchesSeniority &&
  //     matchesIndustry &&
  //     matchesKeywords
  //   );
  // });

  // const toggleContact = (id: string) => {
  //   setSelectedContacts((prev) =>
  //     prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id],
  //   );
  // };

  const toggleAll = () => {
  if (selectedLeads.length === leads.length && leads.length > 0) {
    setSelectedLeads([]);
  } else {
    setSelectedLeads(leads.map(l => l.id));
  }
};
  const fetchLeads = async () => {
    setLoading(true);
    try {
      const data = await leadService.getLeads(searchQuery, filters);
      setLeads(data);
    } catch (error) {
      console.error("Failed to fetch status", error);
      toast.error("Failed to fetch status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchLeads();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, filters]);

  const handleToggleFavorite = async (id: string, currentStatus: boolean) => {
    try {
      setLeads((prev) =>
        prev.map((l) =>
          l.id === id ? { ...l, added_to_favourites: !currentStatus } : l,
        ),
      );

      await leadService.toggleFavorite(id, currentStatus);
    } catch (error) {
      console.error("Error toggling favourite", error);
      toast.error("Failed to  add to favourites");
      fetchLeads();
    }
  };
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast.error("No file selected");
      return;
    }
    const fileName = file.name.toLowerCase();
    const isValidFile =
      fileName.endsWith(".xlsx") ||
      fileName.endsWith(".xls") ||
      fileName.endsWith(".csv");

    if (!isValidFile) {
      toast.error("File format should be Excel (.xlsx, .xls) or CSV");
      return;
    }
    setIsUploading(true);
    if (file) {
      setLoading(true);
    }
    try {
      await leadService.uploadLeads(file);
      setShowUploadModal(false);
      fetchLeads();
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("Upload failed,Please check  the file format");
    } finally {
      setIsUploading(false);
    }
  };
  const handleExport = async () => {
    try {
      await leadService.exportLeads();
    } catch (error) {
      toast.error("Failed to export");
      console.log("Failed to export",error);
    }
  };
  const toggleLeadSelection = (id: string) => {
    setSelectedLeads((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id],
    );
  };

  const getEmailStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-700 border-green-200";
      case "likely":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  // const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     console.log('Uploading file:', file.name);
  //     setShowUploadModal(false);
  //   }
  // };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Search Leads</h2>
          <p className="text-sm text-slate-600 mt-1">
            Find and connect with decision makers at your target accounts
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Upload className="w-4 h-4" />
          Upload Leads
        </button>
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Upload Leads
            </h3>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:bg-slate-50 transition-colors">
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-3" />
                  <p className="text-sm text-slate-600">Processing file...</p>
                </div>
              ) : (
                <>
                  <Upload className="w-10 h-10 text-blue-500 mx-auto mb-3" />
                  <label className="cursor-pointer block">
                    <span className="text-blue-600 hover:text-blue-700 font-medium">
                      Click to upload
                    </span>
                    <input
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-slate-400 mt-2">
                    CSV, XLS supported
                  </p>
                </>
              )}
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowUploadModal(false)}
                disabled={isUploading}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, title, company, email, or phone..."
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-4 gap-4 mb-6 pb-6 border-b border-slate-200">
            <input
              type="text"
              placeholder="Title"
              value={filters.title}
              onChange={(e) =>
                setFilters({ ...filters, title: e.target.value })
              }
              className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <input
              type="text"
              placeholder="Company"
              value={filters.company}
              onChange={(e) =>
                setFilters({ ...filters, company: e.target.value })
              }
              className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <input
              type="text"
              placeholder="Location"
              value={filters.location}
              onChange={(e) =>
                setFilters({ ...filters, location: e.target.value })
              }
              className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <input
              type="text"
              placeholder="Department"
              value={filters.department}
              onChange={(e) =>
                setFilters({ ...filters, department: e.target.value })
              }
              className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <input
              type="text"
              placeholder="Seniority"
              value={filters.seniority}
              onChange={(e) =>
                setFilters({ ...filters, seniority: e.target.value })
              }
              className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <input
              type="text"
              placeholder="Industry"
              value={filters.industry}
              onChange={(e) =>
                setFilters({ ...filters, industry: e.target.value })
              }
              className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <input
              type="text"
              placeholder="Keywords"
              value={filters.keywords}
              onChange={(e) =>
                setFilters({ ...filters, keywords: e.target.value })
              }
              className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">
                {leads.length}
              </span>{" "}
              results
            </p>
            {leads.length > 0 && (
              <p className="text-sm text-blue-600 font-medium">
                {leads.length} selected
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {leads.length > 0 && (
              <>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  <Plus className="w-4 h-4" />
                  Add to List
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                  <Mail className="w-4 h-4" />
                  Add to Sequence
                </button>
              </>
            )}
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
    type="checkbox"
    checked={selectedLeads.length === leads.length && leads.length > 0}
    onChange={toggleAll}
    className="rounded border-slate-300"
  />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Industry
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Keywords
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {leads.map((contact) => (
                  <tr
                    key={contact.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedLeads.includes(contact.id)}
                        onChange={() => toggleLeadSelection(contact.id)}
                        className="rounded border-slate-300"
                      />
                    </td>
                    {/* <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedContacts.includes(contact.id)}
                        onChange={() => toggleContact(contact.id)}
                        className="rounded border-slate-300"
                      />
                    </td> */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                          {contact.firstName[0]}
                          {contact.lastName[0]}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">
                            {contact.firstName} {contact.lastName}
                          </p>
                          <p className="text-xs text-slate-500">
                            {contact.seniority}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span className="text-sm text-slate-700">
                          {contact.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-slate-700">
                            {contact.company}
                          </p>
                          {contact.companyDomain && (
                            <p className="text-xs text-slate-500">
                              {contact.companyDomain}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {contact.industry && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                          {contact.industry}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span className="text-sm text-slate-600">
                          {contact.location}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <p className="text-xs text-slate-700">
                            {contact.email}
                          </p>
                        </div>
                        {contact.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3 text-slate-400 flex-shrink-0" />
                            <p className="text-xs text-slate-700">
                              {contact.phone}
                            </p>
                          </div>
                        )}
                        <span
                          className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full border ${getEmailStatusColor(contact.emailStatus)}`}
                        >
                          {contact.emailStatus}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {contact.keywords?.slice(0, 2).map((keyword, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-md"
                          >
                            <Tag className="w-3 h-3" />
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleToggleFavorite(
                              contact.id,
                              contact.added_to_favourites,
                            )
                          }
                          className={`p-1.5 rounded-md transition-colors ${contact.added_to_favourites ? "text-yellow-500 bg-yellow-50" : "text-slate-400 hover:bg-slate-100"}`}
                        >
                          <Star className="w-4 h-4 text-slate-400" />
                        </button>
                        {contact.linkedinUrl && (
                          <a
                            href={contact.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View LinkedIn"
                          >
                            <Linkedin className="w-4 h-4 text-blue-600" />
                          </a>
                        )}
                        <button
                          className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                          title="Send email"
                        >
                          <Mail className="w-4 h-4 text-green-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
