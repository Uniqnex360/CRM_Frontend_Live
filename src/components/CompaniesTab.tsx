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
  Loader2,
  Plus,
  Edit,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

import { CompanyService } from "../services/companyService";
import { Company, CompanyCreateUpdate } from "../interfaces/company_interface";
import Drawer from "./common/Drawer";
import AppPagination from "./common/AppPaginatin";
import AppFormInput from "./common/AppFormInput";

const companyService = new CompanyService();

export default function CompaniesTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [exporting, setExporting] = useState(false);
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
  // pagination states
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [size, setSize] = useState(0);
  // create or update states
  const [cuModal, setCUModal] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [cudLoading, setCUDLoading] = useState(false);
  // extra features
  const [selectedAllResults, SetSelectedAllResults] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchCompanies();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, filters, page]);

  useEffect(() => {
    if (selectedAllResults) {
      setSelectedCompanies((prev) => {
        const unique = new Set([...prev, ...companies.map((c) => c.id)]);
        return Array.from(unique);
      });
    } else {
      setSelectedCompanies([]);
    }
  }, [selectedAllResults, page, companies]);

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
      const data = await companyService.getCompanies(
        searchQuery,
        filters,
        page,
      );
      setCompanies(data?.items || []);
      setTotal(data?.total);
      setSize(data?.size);
    } catch (error) {
      console.error("Failed to fetch companies", error);
      toast.error("Failed to load companies");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      if (selectedAllResults) {
        const payload = {
          filters: {
            keyword: searchQuery || null,
            vertical: filters.industry || null,
            employee_count: filters.employeeCount || null,
            revenue: filters.revenue || null,
            location: filters.location || null,
          },
        };
        console.log("all filter export");
        await companyService.exportCompany(payload);
      } else if (selectedCompanies.length > 0) {
        const payload = {
          company_ids: selectedCompanies,
        };
        await companyService.exportCompany(payload);
      } else {
        await companyService.exportCompany();
      }
    } catch {
      toast.error("Failed to export");
    } finally {
      setExporting(false);
      SetSelectedAllResults(false);
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

  const hasActiveFilters =
    searchQuery || Object.values(filters).some((value) => value !== "");

  //create
  const { register, handleSubmit, reset, formState } =
    useForm<CompanyCreateUpdate>({
      mode: "onSubmit", // ensures validation runs only on submit
    });

  const clearForm = () => {
    reset({
      id: undefined,
      company_name: "",
      domain_url: "",
      company_linkedin_source: "",
      employee_size: "",
      country: "",
      amazon_existing: undefined,
      gross_revenue: "",
      industry: "",
      founding_year: "",
    });
  };

  const onSubmit = async (data: CompanyCreateUpdate) => {
    try {
      setCUDLoading(true);
      if (!isUpdate) {
        const response = await companyService.createCompany(data);
        clearForm();
        setCUModal(false);
        toast.success("Company Created Successfully");
        fetchCompanies();
      } else {
        if (!data?.id) {
          throw new Error("ID is required");
        }
        const response = await companyService.updateCompany(data.id, data);
        if (response?.detail) {
          toast.error(response.data?.detail);
        } else {
          toast.success("Company updated successfully");
          setCUModal(false);
          setIsUpdate(false);
          fetchCompanies();
        }
      }
    } catch (error: any) {
      toast.error(error);
    } finally {
      setCUDLoading(false);
    }
  };

  // update -> handle edit
  const handleEdit = (data: CompanyCreateUpdate) => {
    setIsUpdate(true);
    reset({
      ...data,
      amazon_existing: String(data.amazon_existing) as any,
    });
    setCUModal(true);
  };

  // toggle -> activate <=> deactivate
  const handleActivateDeactivate = async (data: Partial<Company>) => {
    const newStatus = !data?.is_active;

    const response = await companyService.handlePatch(data.id, {
      is_active: newStatus,
    });

    if (response) {
      toast.success(
        newStatus
          ? "Company activated successfully"
          : "Company deactivated successfully",
      );
    }
    fetchCompanies();
  };

  return (
    <>
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
                Upload a CSV or Excel file with your company data. The file
                should include columns for company name, domain, industry, etc.
              </p>
              {/* <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center
              ">
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
              </div> */}
              <label className="block border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition">
                <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />

                <span className="text-blue-600 hover:text-blue-700 font-medium">
                  Choose a file
                </span>

                <p className="text-xs text-slate-500 mt-2">
                  CSV, XLS, or XLSX up to 10MB
                </p>

                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
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

        <div className="bg-white rounded-lg border border-slate-200 p-2">
          <div className="flex gap-2 mb-3">
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
            <div className="grid grid-cols-4 gap-4 mb-2 pb-2 border-b border-slate-200">
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
          {hasActiveFilters && (
            <button
              onClick={() => {
                setFilters({
                  industry: "",
                  employeeCount: "",
                  revenue: "",
                  location: "",
                });
                setSearchQuery("");
              }}
              className="px-3 py-1.5 text-sm font-medium text-red-600 rounded-md text-left"
            >
              Clear All
            </button>
          )}

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-slate-900">{total}</span>{" "}
                companies
              </p>
              {selectedCompanies.length > 0 && (
                <>
                  <p className="text-sm text-blue-600 font-medium">
                    {selectedAllResults ? total : selectedCompanies.length}{" "}
                    selected
                  </p>
                  {!selectedAllResults && (
                    <button
                      onClick={() => {
                        setSelectedCompanies([]);
                        SetSelectedAllResults(false);
                      }}
                      className="px-3 py-1.5 text-sm font-medium text-red-600 rounded-md text-left"
                    >
                      Clear Selection
                    </button>
                  )}
                </>
              )}
              {companies.length > 0 && (
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    SetSelectedAllResults(!selectedAllResults);
                  }}
                  style={{
                    color: "#2563eb",
                    textDecoration: "underline",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  {selectedAllResults
                    ? "Clear Selection"
                    : "Select All Results"}
                </a>
              )}
            </div>

            <div className="flex gap-2 items-center">
              <div className="">
                <AppPagination
                  total={total}
                  page={page}
                  size={size}
                  onPageChange={setPage}
                />
              </div>
              <button
                onClick={() => {
                  setCUModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Company
              </button>
              <button
                onClick={handleExport}
                disabled={exporting}
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm disabled:opacity-60"
              >
                {exporting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                {exporting ? "Exporting..." : "Export"}
              </button>
            </div>
          </div>
          {loading && (
            <div className="p-12 text-center text-slate-500">
              Loading companies...
            </div>
          )}
          <div className="space-y-4 max-h-[410px] overflow-y-auto">
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
                                href={`https://${company.domain_url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                              >
                                {company.domain_url}
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
                              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                {company.industry}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <button
                              className="p-2 hover:bg-slate-100 rounded-lg"
                              title="Edit list"
                              onClick={() => {
                                handleEdit({
                                  id: company.id,
                                  company_name: company.name,
                                  domain_url: company.domain_url,
                                  company_linkedin_source:
                                    company.linkedinUrl || "",
                                  employee_size: company.employeeCount || "",
                                  country: company.country || "",
                                  amazon_existing:
                                    company.amazon_existing || false,
                                  gross_revenue: company.revenue || "",
                                  industry: company.industry || "",
                                  founding_year: company.founded || "",
                                });
                              }}
                            >
                              <Edit className="w-4 h-4 text-slate-600" />
                            </button>

                            <button
                              onClick={() => handleActivateDeactivate(company)}
                              className="p-2 hover:bg-gray-50 rounded-lg"
                              title={
                                company.is_active ? "Deactivate" : "Activate"
                              }
                            >
                              {company.is_active ? (
                                <ToggleRight className="w-6 h-6 text-green-600" />
                              ) : (
                                <ToggleLeft className="w-6 h-6 text-red-400" />
                              )}
                            </button>
                          </div>
                        </div>

                        <p className="text-sm text-slate-600 mb-3">
                          {company.description}
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-700">
                              {company.employeeCount}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-700">
                              {company.revenue}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-700">
                              {company.country}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-700">
                              {company.founded
                                ? `Founded ${company.founded}`
                                : "--"}
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
                          <div className="flex gap-2">
                            {company?.keywords &&
                              company.keywords.map((k, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-md border border-slate-200"
                                >
                                  {k}
                                </span>
                              ))}
                          </div>
                          {/* <div className="flex gap-2">
                            <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-md border border-slate-200">
                              React JS
                            </span>
                            <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-md border border-slate-200">
                              React JS
                            </span>
                          </div> */}
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
                              Hide {company.leads?.length || 0} contacts
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4" />
                              Show {company.leads?.length || 0} contacts
                            </>
                          )}
                        </button>

                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-slate-200">
                            <h4 className="text-sm font-semibold text-slate-900 mb-3">
                              Key Contacts
                            </h4>
                            <div className="space-y-3">
                              {company.leads && company.leads.length > 0 ? (
                                company.leads.map((lead) => (
                                  <div
                                    key={lead.id}
                                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-sm font-semibold">
                                        {lead.name
                                          ? lead.name
                                              .split(" ")
                                              .map((n) => n[0])
                                              .join("")
                                              .slice(0, 2)
                                          : "U"}
                                      </div>
                                      <div>
                                        <p className="font-medium text-slate-900">
                                          {lead.name || "--"}
                                        </p>
                                        <p className="text-xs text-slate-600">
                                          {lead.title || "--"}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                      <div className="text-right">
                                        <div className="flex items-center gap-2 text-sm">
                                          <Mail className="w-3 h-3 text-slate-400" />
                                          <a
                                            href={`mailto:${lead.email_id}`}
                                            className="text-blue-600 hover:text-blue-700"
                                          >
                                            {lead.email_id || "--"}
                                          </a>
                                        </div>
                                        {lead.primary_number && (
                                          <div className="flex items-center gap-2 text-xs text-slate-600 mt-1 justify-end">
                                            <Phone className="w-3 h-3 text-slate-400" />
                                            {lead.primary_number}
                                          </div>
                                        )}
                                      </div>

                                      <div className="flex flex-col items-end">
                                        <span className="text-xs font-medium text-green-600">
                                          {lead.relevance || 0}%
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
      {/* CREATE Company MODAL */}
      <Drawer
        title={isUpdate ? "Update Company" : "Create Company"}
        isOpen={cuModal}
        onClose={() => {
          clearForm();
          setCUModal(false);
          setIsUpdate(false);
        }}
      >
        <div className="p-4 w-full h-full bg-white rounded shadow-md">
          <div className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Company Info */}
              <div className="grid grid-cols-2 gap-4">
                <AppFormInput<CompanyCreateUpdate>
                  label="Company Name"
                  name="company_name"
                  register={register}
                  rules={{ required: "Company name is required" }}
                  error={formState.errors.company_name}
                  formState={formState}
                />

                <AppFormInput<CompanyCreateUpdate>
                  label="Website URL"
                  name="domain_url"
                  register={register}
                  rules={{
                    pattern: {
                      value: /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/,
                      message: "Please enter a valid URL",
                    },
                  }}
                  error={formState.errors.domain_url}
                  formState={formState}
                />
              </div>

              {/* LinkedIn + Employee */}
              <div className="grid grid-cols-2 gap-4">
                <AppFormInput<CompanyCreateUpdate>
                  label="LinkedIn Company Page"
                  name="company_linkedin_source"
                  register={register}
                  rules={{
                    pattern: {
                      value: /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/,
                      message: "Please enter a valid URL",
                    },
                  }}
                  error={formState.errors.company_linkedin_source}
                  formState={formState}
                />

                <AppFormInput<CompanyCreateUpdate>
                  label="Employee Count"
                  name="employee_size"
                  register={register}
                  placeholder="51–200"
                  error={formState.errors.employee_size}
                  formState={formState}
                />
              </div>

              {/* Amazon + Revenue */}
              <div className="grid grid-cols-2 gap-4 items-center">
                <AppFormInput<CompanyCreateUpdate>
                  label="Amazon Presence"
                  name="amazon_existing"
                  type="radio"
                  register={register}
                  options={[
                    { id: "true", value: "Yes" },
                    { id: "false", value: "No" },
                  ]}
                  error={formState.errors.amazon_existing}
                  formState={formState}
                />

                <AppFormInput<CompanyCreateUpdate>
                  label="Annual Revenue"
                  name="gross_revenue"
                  register={register}
                  placeholder="$10M – $50M"
                  error={formState.errors.gross_revenue}
                  formState={formState}
                />
              </div>

              {/* Industry + Founded */}
              <div className="grid grid-cols-2 gap-4">
                <AppFormInput<CompanyCreateUpdate>
                  label="Industry"
                  name="industry"
                  register={register}
                  error={formState.errors.industry}
                  formState={formState}
                />

                <AppFormInput<CompanyCreateUpdate>
                  label="Year Founded"
                  name="founding_year"
                  register={register}
                  placeholder="2015"
                  error={formState.errors.founding_year}
                  formState={formState}
                />
              </div>

              {/* Country */}
              <div className="grid grid-cols-2 gap-4">
                <AppFormInput<CompanyCreateUpdate>
                  label="Headquarters Country"
                  name="country"
                  placeholder="USA"
                  register={register}
                  error={formState.errors.country}
                  formState={formState}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={cudLoading}
                className={`w-full py-2 px-4 rounded text-white ${
                  cudLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {cudLoading
                  ? isUpdate
                    ? "Updating..."
                    : "Creating..."
                  : isUpdate
                    ? "Update Company"
                    : "Create Company"}
              </button>
            </form>
          </div>
        </div>
      </Drawer>
    </>
  );
}
