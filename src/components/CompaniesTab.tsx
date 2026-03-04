import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Download,
  MapPin,
  Users,
  DollarSign,
  TrendingUp,
  ExternalLink,
  Mail,
  Phone,
  Linkedin,
  Upload,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import toast from "react-hot-toast";
import { CompanyService } from "../services/companyService";
import { Company } from "../interfaces/company_interface";
import AppPagination from "./common/AppPaginatin";
const companyService = new CompanyService();

export default function CompaniesTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [expandedCompanies, setExpandedCompanies] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [filters, setFilters] = useState({
    industry: "",
    employeeCount: "",
    revenue: "",
    location: "",
  });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const size = 50;

  const toggleCompany = (id: string) => {
    setSelectedCompanies((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id],
    );
  };

  const toggleExpanded = (id: string) => {
    setExpandedCompanies((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id],
    );
  };
  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const data = await companyService.getCompanies(searchQuery, filters, page);
      setCompanies(data?.items || []);
      setTotal(data?.total)
    } catch (error) {
      console.error("Failed to fetch companies", error);
      toast.error("Failed to load companies");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchCompanies();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, filters, page]);

  const handleExport = async () => {
    try {
      toast.success("Starting export...");
      await companyService.exportCompany();
    } catch (error) {
      console.error(error);
      toast.error("Export failed");
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
      await companyService.uploadCompanies(file);
      setShowUploadModal(false);
      fetchCompanies();
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("Upload failed,Please check  the file format");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Search Companies
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Discover and analyze target companies with key contacts
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Upload className="w-4 h-4" />
          Upload Companies
        </button>
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Upload Companies
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Upload a CSV or Excel file with your company data. The file should
              include columns for company name, domain, industry, etc.
            </p>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <label className="cursor-pointer">
                <span className="text-blue-600 hover:text-blue-700 font-medium">
                  Choose a file
                </span>
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-slate-500 mt-2">
                CSV, XLS, or XLSX up to 10MB
              </p>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
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
              placeholder="Search by company name, domain, or industry..."
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
              placeholder="Industry"
              value={filters.industry}
              onChange={(e) =>
                setFilters({ ...filters, industry: e.target.value })
              }
              className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <input
              type="text"
              placeholder="Employee Count"
              value={filters.employeeCount}
              onChange={(e) =>
                setFilters({ ...filters, employeeCount: e.target.value })
              }
              className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <input
              type="text"
              placeholder="Revenue"
              value={filters.revenue}
              onChange={(e) =>
                setFilters({ ...filters, revenue: e.target.value })
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
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">
                {companies.length}
              </span>{" "}
              companies
            </p>
            {selectedCompanies.length > 0 && (
              <p className="text-sm text-blue-600 font-medium">
                {selectedCompanies.length} selected
              </p>
            )}
          </div>
          
          <div className="flex gap-2">
            <div className="">
              <AppPagination
              total={total}
              page={page}
              size={size}
              onPageChange={setPage}
            />

            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
        {loading && (
          <div className="p-12 text-center text-slate-500">
            Loading companies...
          </div>
        )}
        <div className="space-y-4 max-h-[450px] overflow-y-auto">
          {!loading &&
            companies.map((company) => {
              const isExpanded = expandedCompanies.includes(company.id);
              return (
                <div
                  key={company.id}
                  className="border border-slate-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-4">
                    <input
                      type="checkbox"
                      checked={selectedCompanies.includes(company.id)}
                      onChange={() => toggleCompany(company.id)}
                      className="rounded border-slate-300 mt-1"
                    />

                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                      {company.name.substring(0, 2).toUpperCase()}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">
                            {company.name}
                          </h3>
                          <div className="flex items-center gap-3 mt-1">
                            <a
                              href={`https://${company.domain}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                            >
                              {company.domain}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                            {company.linkedinUrl && (
                              <a
                                href={company.linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700"
                                title="Company LinkedIn"
                              >
                                <Linkedin className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                          {company.industry}
                        </span>
                      </div>

                      <p className="text-sm text-slate-600 mb-3">
                        {company.description}
                      </p>

                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-700">
                            {company.employeeCount} employees
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-700">
                            {company.revenue} revenue
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-700">
                            {company.location}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-700">
                            Founded {company.founded}
                          </span>
                        </div>
                        {company.companyEmail && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-slate-400" />
                            <a
                              href={`mailto:${company.companyEmail}`}
                              className="text-sm text-blue-600 hover:text-blue-700"
                            >
                              {company.companyEmail}
                            </a>
                          </div>
                        )}
                        {company.companyPhone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-slate-400" />
                            <a
                              href={`tel:${company.companyPhone}`}
                              className="text-sm text-slate-700"
                            >
                              {company.companyPhone}
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {company.technologies.map((tech, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-md border border-slate-200"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => toggleExpanded(company.id)}
                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="w-4 h-4" />
                            Hide {company.contacts?.length || 0} contacts
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4" />
                            Show {company.contacts?.length || 0} contacts
                          </>
                        )}
                      </button>

                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-slate-200">
                          <h4 className="text-sm font-semibold text-slate-900 mb-3">
                            Key Contacts
                          </h4>
                          <div className="space-y-3">
                            {company.contacts && company.contacts.length > 0 ? (
                              company.contacts.map((contact) => (
                                <div
                                  key={contact.id}
                                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-sm font-semibold">
                                      {contact.name
                                        ? contact.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")
                                            .slice(0, 2)
                                        : "U"}
                                    </div>
                                    <div>
                                      <p className="font-medium text-slate-900">
                                        {contact.name || "Unknown Name"}
                                      </p>
                                      <p className="text-xs text-slate-600">
                                        {contact.title || "No Title"}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-4">
                                    <div className="text-right">
                                      <div className="flex items-center gap-2 text-sm">
                                        <Mail className="w-3 h-3 text-slate-400" />
                                        <a
                                          href={`mailto:${contact.email}`}
                                          className="text-blue-600 hover:text-blue-700"
                                        >
                                          {contact.email || "No Email"}
                                        </a>
                                      </div>
                                      {contact.phone && (
                                        <div className="flex items-center gap-2 text-xs text-slate-600 mt-1 justify-end">
                                          <Phone className="w-3 h-3 text-slate-400" />
                                          {contact.phone}
                                        </div>
                                      )}
                                    </div>

                                    <div className="flex flex-col items-end">
                                      <span className="text-xs font-medium text-green-600">
                                        {contact.relevance || 0}%
                                      </span>
                                      <span className="text-[10px] text-slate-500 uppercase">
                                        match
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-6 bg-slate-50 rounded-lg text-slate-500 text-sm">
                                No contacts found for this company.
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
