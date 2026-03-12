import React, { useState } from "react";
import { useForm } from "react-hook-form";
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
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Edit,
} from "lucide-react";
import { LeadService } from "../services/leadService";
import toast from "react-hot-toast";
import { Lead } from "../interfaces/lead_interface";
import { useEffect } from "react";
import Drawer from "./common/Drawer";
import AppPagination from "./common/AppPaginatin";
import AppFormInput from "./common/AppFormInput";
import AppModal from "./common/AppModel";
import { ListService } from "../services/listService";
import { ListResponse, ListAPIResponse } from "../services/listService";
import { MultiSelectObjects } from "./common/MultiSelectObjects";

const leadService = new LeadService();
const listService = new ListService();

export default function SearchTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [showFilters, setShowFilters] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cudloading, setCUDLoading] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    title: "",
    company: "",
    location: "",
    industry: "",
  });
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: "asc" | "desc";
  }>({
    key: null,
    direction: "asc",
  });
  const [isUpdate, setIsUpdate] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [size, setSize] = useState(20);
  const [selectAllResults, setSelectAllResults] = useState(false);
  const [addListModal, setAddListModal] = useState(false);
  const [listGroups, setListGroups] = useState<ListResponse[]>([]);
  const [selectedListGroups, setSelectedListGroups] = useState<
    {
      id: string;
      value: string;
    }[]
  >([]);

  useEffect(() => {
    if (selectAllResults) {
      setSelectedLeads((prev) => {
        const unique = new Set([...prev, ...leads.map((l) => l.id)]);
        return Array.from(unique);
      });
    } else {
      setSelectedLeads([]);
    }
  }, [selectAllResults, page, leads]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchLeads();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, filters, page, sortConfig]);

  useEffect(() => {
    fetchListGroup();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const data = await leadService.getLeads(
        searchQuery,
        filters,
        page,
        sortConfig.key,
        sortConfig.direction,
      );
      setLeads(data?.items);
      setTotal(data?.total);
      setSize(data?.size);
    } catch (error) {
      console.error("Failed to fetch status", error);
      toast.error("Failed to fetch status");
    } finally {
      setLoading(false);
    }
  };

  const fetchListGroup = async () => {
    try {
      const data: ListAPIResponse = await listService.getList();
      setListGroups(data?.data);
    } catch (error: any) {
      console.log(error);
    }
    return {};
  };

  const toggleLeadSelection = (id: string) => {
    if (!id) return;

    setSelectedLeads((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    if (selectedLeads.length === leads.length && leads.length > 0) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(leads.map((l) => l.id));
    }
  };

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown size={14} />;
    }

    return sortConfig.direction === "asc" ? (
      <ArrowUp size={14} />
    ) : (
      <ArrowDown size={14} />
    );
  };

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
      const responseData = await leadService.uploadLeads(file);
      // Check response for errors
      const response = responseData?.data;
      if (response.failed && response.failed > 0) {
        // If there are failed rows, show error toast
        const errorMessages = response.errors
          .map((e: any) => `Row ${e.row_number}: ${e.error}`)
          .join("\n");

        toast.error(`Some leads failed to upload:\n${errorMessages}`, {
          duration: 5000,
        });
      } else if (response.inserted && response.inserted > 0) {
        // Success toast
        toast.success(
          `Successfully uploaded ${response.inserted} lead${response.inserted > 1 ? "s" : ""}`,
        );
      } else {
        // Handle case where nothing was inserted
        toast("No leads were uploaded", { icon: "⚠️" });
      }
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
      setExporting(true);
      if (selectAllResults) {
        const payload = {
          filters: {
            keyword: searchQuery || null,
            name: filters.name || null,
            title: filters.title || null,
            company: filters.title || null,
            industry: filters.industry || null,
            location: filters.industry || null,
          },
        };
        console.log("payload", payload);
        await leadService.exportLeads(payload);
      } else if (selectedLeads.length > 0) {
        const payload = {
          lead_ids: selectedLeads,
        };
        console.log("payload", payload);
        await leadService.exportLeads(payload);
      } else {
        console.log("payload");
        await leadService.exportLeads();
      }
    } catch (error) {
      toast.error("Failed to export");
    } finally {
      setExporting(false);
      setSelectAllResults(false);
    }
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

  const { register, handleSubmit, reset, formState } = useForm<Lead>({
    mode: "onSubmit", // ensures validation runs only on submit
  });

  const onSubmit = async (data) => {
    try {
      setCUDLoading(true);
      if (!isUpdate) {
        const response = await leadService.createLeads(data);
        if (response.status === 200) {
          clearForm();
          setCreateModal(false);
          toast.success("Lead Created Successfully!");
        } else {
          toast.error(response?.data?.detail || "Lead creation Faied");
        }
      } else {
        if (!data?.id) {
          throw new Error("Id not found");
        }
        const response = await leadService.updateLead(data.id, data);
        if (response?.detail) {
          toast.error(response.data?.detail);
        } else {
          toast.success("Lead updated successfully");
          setCreateModal(false);
          setIsUpdate(false);
          fetchLeads();
        }
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setCUDLoading(false);
    }
  };

  const clearForm = () => {
    reset({
      id: undefined,
      name: "",
      email_id: "",
      industry: "",
      company_name: "",
      domain: "",
      url: "",
      company_linkedin_source: "",
      source: "",
      personal_linkedin_source: "",
      phone: "",
      location: "",
      city: "",
      state: "",
      country: "",
      address: "",
    });
  };

  const handleEdit = async (data: any) => {
    setIsUpdate(true);
    reset({
      id: data?.id,
      company_id: data?.company_id,
      name: data.name,
      email_id: data.email,
      industry: data.industry,
      company_name: data.company,
      domain: data.domain,
      url: data.url, //
      company_linkedin_source: data.company_linkedin_source,
      source: data.source,
      personal_linkedin_source: data.personal_linkedin_source,
      phone: data.phone,
      location: data.location,
      city: data.city,
      state: data.state,
      country: data.country,
      address: data.address,
    });
    setCreateModal(true);
  };

  const handleListGroupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCUDLoading(true);
    try {
      for (const lg of selectedListGroups) {
        if (selectAllResults) {
          const payload = {
            keyword: searchQuery || null,
            name: filters.name || null,
            title: filters.title || null,
            company: filters.company || null, // fixed, was filters.title
            industry: filters.industry || null,
            location: filters.location || null, // fixed, was filters.industry
          };
          await listService.addLeadToGroup(lg.id, payload);
        } else if (selectedLeads.length > 0) {
          const payload = {
            entity_ids: selectedLeads,
          };
          await listService.addLeadToGroup(lg.id, payload);
        } else {
          await listService.addLeadToGroup(lg.id);
        }
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      // Clear selections and close modal **after all API calls are done**
      setCUDLoading(false);
      setSelectedListGroups([]);
      setAddListModal(false);
      setSelectAllResults(false);
      setSelectedLeads([]);
    }
    toast.success("Leads were added to List Group Successfully!");
  };

  const hasActiveFilters =
    searchQuery || Object.values(filters).some((value) => value !== "");

  return (
    <>
      <div className="space-y-2 flex flex-col h-[calc(100vh - 10%)]">
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

        <div className="p-2 flex flex-col flex-1 min-h-0">
          <div className="flex gap-4 mb-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, title, company, email, address, city, state, country, phone..."
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
            <div className="grid grid-cols-5 gap-4 mb-2 pb-2 border-b border-slate-200">
              <input
                type="text"
                placeholder="Name"
                value={filters.name}
                onChange={(e) =>
                  setFilters({ ...filters, name: e.target.value })
                }
                className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
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
                placeholder="Industry"
                value={filters.industry}
                onChange={(e) =>
                  setFilters({ ...filters, industry: e.target.value })
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
              {/* <input
              type="text"
              placeholder="Department"
              value={filters.department}
              onChange={(e) =>
                setFilters({ ...filters, department: e.target.value })
              }
              className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            /> */}
              {/* <input
              type="text"
              placeholder="Seniority"
              value={filters.seniority}
              onChange={(e) =>
                setFilters({ ...filters, seniority: e.target.value })
              }
              className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            /> */}

              {hasActiveFilters && (
                <button
                  onClick={() => {
                    setFilters({
                      title: "",
                      company: "",
                      location: "",
                      name: "",
                      industry: "",
                    });
                    setSearchQuery("");
                  }}
                  className="px-3 py-1.5 text-sm font-medium text-red-600 rounded-md text-left"
                >
                  Clear All
                </button>
              )}
              {/* <input
              type="text"
              placeholder="Keywords"
              value={filters.keywords}
              onChange={(e) =>
                setFilters({ ...filters, keywords: e.target.value })
              }
              className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            /> */}
            </div>
          )}

          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-slate-900">{total}</span>{" "}
                results
              </p>
              {(selectAllResults || selectedLeads.length > 0) && (
                <p className="text-sm text-blue-600 font-medium">
                  {selectAllResults ? total : selectedLeads.length} selected
                </p>
              )}
              {leads.length > 0 && (
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectAllResults(!selectAllResults);
                  }}
                  style={{
                    color: "#2563eb",
                    textDecoration: "underline",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  {selectAllResults ? "Clear Selection" : "Select All Results"}
                </a>
              )}
            </div>
            <div className="flex gap-4 items-center">
              {leads.length > 0 && (
                <>
                  {/* handle here pagination */}
                  <AppPagination
                    total={total}
                    page={page}
                    size={size}
                    onPageChange={setPage}
                  />
                  {(selectAllResults || selectedLeads.length > 0) && (
                    <button
                      onClick={() => {
                        setAddListModal(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add to List
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setCreateModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Lead
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                    <Mail className="w-4 h-4" />
                    Add to Sequence
                  </button>
                </>
              )}
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

          {/* Table section */}
          <div className="border border-slate-200 rounded-lg overflow-hidden flex flex-col flex-1 min-h-0 mb-5">
            <div className="flex-1 max-h-[410px] overflow-y-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={
                          selectAllResults ||
                          (selectedLeads.length === leads.length &&
                            leads.length > 0)
                        }
                        onChange={toggleAll}
                        className="rounded border-slate-300 cursor-pointer"
                      />
                    </th>
                    {/* <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Name
                  </th> */}
                    <th
                      onClick={() => handleSort("name")}
                      className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        Name
                        {getSortIcon("name")}
                      </div>
                    </th>
                    {/* <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Title
                  </th> */}
                    <th
                      onClick={() => handleSort("title")}
                      className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        Title
                        {getSortIcon("title")}
                      </div>
                    </th>
                    {/* <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Company
                  </th> */}
                    <th
                      onClick={() => handleSort("company")}
                      className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        Company
                        {getSortIcon("company")}
                      </div>
                    </th>
                    {/* <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Industry
                  </th> */}
                    <th
                      onClick={() => handleSort("industry")}
                      className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        Industry
                        {getSortIcon("industry")}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("location")}
                      className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        Location
                        {getSortIcon("location")}
                      </div>
                    </th>
                    {/* <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Location
                  </th> */}
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
                  {loading ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="text-center py-6 text-slate-500"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : leads.length === 0 ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="text-center py-6 text-slate-500"
                      >
                        No leads found
                      </td>
                    </tr>
                  ) : (
                    leads.map((contact) => (
                      <tr
                        key={contact.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedLeads.includes(contact.id)}
                            onChange={() => toggleLeadSelection(contact.id)}
                            className="rounded border-slate-300 cursor-pointer"
                          />
                        </td>
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
                              {contact.title || "--"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            {contact.company}
                            {/* <div>
                            <p className="text-sm text-slate-700">
                              {contact.company_name}
                            </p>
                            {contact.company_name && (
                              <p className="text-xs text-slate-500">
                                {contact.company_name}
                              </p>
                            )}
                          </div> */}
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
                            {contact.keywords
                              ?.slice(0, 2)
                              .map((keyword, index) => (
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
                              onClick={() => {
                                handleToggleFavorite(
                                  contact.id,
                                  contact.added_to_favourites,
                                );
                              }}
                              className={`p-1.5 rounded-md transition-colors ${contact.added_to_favourites ? "text-yellow-900 bg-yellow-300" : "text-slate-400 hover:bg-slate-100"}`}
                            >
                              <Star className="w-4 h-4 text-slate-400" />
                            </button>
                            <button
                              className="p-2 hover:bg-slate-100 rounded-lg"
                              title="Edit list"
                              onClick={() => {
                                handleEdit({
                                  ...contact,
                                });
                              }}
                            >
                              <Edit className="w-4 h-4 text-slate-600" />
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <Drawer
          title={isUpdate ? "Update Lead" : "Create Lead"}
          isOpen={createModal}
          onClose={() => {
            (setCreateModal(false), clearForm(), setIsUpdate(false));
          }}
        >
          <div className="p-4 w-full h-fit bg-white rounded shadow-md">
            <div className="p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Row 1: Name + Email */}
                <div className="flex gap-4">
                  <AppFormInput<Lead>
                    label="Name"
                    name="name"
                    placeholder="Full Name"
                    register={register}
                    rules={{ required: "Name is required" }}
                    error={formState.errors.name}
                    formState={formState}
                  />
                  <AppFormInput<Lead>
                    label="Email"
                    name="email_id"
                    placeholder="Email"
                    register={register}
                    rules={{
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+\.\S+$/,
                        message: "Invalid email format",
                      },
                    }}
                    error={formState.errors.email_id}
                    formState={formState}
                  />
                </div>

                {/* Row 2: Industry + Company Name */}
                <div className="flex gap-4">
                  <AppFormInput<Lead>
                    label="Industry"
                    name="industry"
                    placeholder="Industry"
                    register={register}
                    error={formState.errors.industry}
                    formState={formState}
                  />
                  <AppFormInput<Lead>
                    label="Company Name"
                    name="company_name"
                    placeholder="Company Name"
                    rules={{ required: "Company Name is required" }}
                    register={register}
                    error={formState.errors.company_name}
                    formState={formState}
                  />
                </div>

                {/* Row 3: Domain + URL */}
                <div className="flex gap-4">
                  <AppFormInput<Lead>
                    label="Domain"
                    name="domain"
                    placeholder="Domain"
                    register={register}
                    error={formState.errors.domain}
                    formState={formState}
                  />
                  <AppFormInput<Lead>
                    label="Website URL"
                    name="url"
                    placeholder="URL"
                    register={register}
                    error={formState.errors.url}
                    formState={formState}
                  />
                </div>

                {/* Row 4: Linkedin + Source */}
                <div className="flex gap-4">
                  <AppFormInput<Lead>
                    label="Company LinkedIn URL"
                    name="company_linkedin_source"
                    placeholder=""
                    register={register}
                    error={formState.errors.company_linkedin_source}
                    formState={formState}
                  />
                  <AppFormInput<Lead>
                    label="Source"
                    name="source"
                    placeholder="LinkedIn"
                    register={register}
                    error={formState.errors.source}
                    formState={formState}
                  />
                </div>

                {/* Row 5: Additional optional fields */}
                {/* Row 4:Personal LinkedIn  + Phone Number */}
                <div className="flex gap-4">
                  <AppFormInput<Lead>
                    label="Personal LinkedIn"
                    name="personal_linkedin_source"
                    placeholder="LinkedIn URL"
                    register={register}
                    error={formState.errors.personal_linkedin_source}
                    formState={formState}
                  />
                  <AppFormInput<Lead>
                    label="Phone"
                    name="phone"
                    placeholder="Phone Number"
                    register={register}
                    error={formState.errors.phone}
                    formState={formState}
                  />
                </div>
                {/* Row 5: City */}
                <div className="flex gap-4">
                  <AppFormInput<Lead>
                    label="City"
                    name="city"
                    placeholder="City"
                    register={register}
                    error={formState.errors.city}
                    formState={formState}
                  />
                  <AppFormInput<Lead>
                    label="State"
                    name="state"
                    placeholder="State"
                    register={register}
                    error={formState.errors.state}
                    formState={formState}
                  />
                </div>
                <div className="flex gap-4">
                  <AppFormInput<Lead>
                    label="Country"
                    name="country"
                    placeholder="Country"
                    register={register}
                    error={formState.errors.country}
                    formState={formState}
                  />
                  <div></div>
                </div>
                <AppFormInput<Lead>
                  type="textarea"
                  label="Address"
                  name="address"
                  placeholder="Address"
                  register={register}
                  error={formState.errors.address}
                  formState={formState}
                />

                {/* Submit */}
                <button
                  type="submit"
                  disabled={cudloading}
                  className={`w-full py-2 px-4 rounded text-white ${
                    cudloading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  {cudloading
                    ? isUpdate
                      ? "Updating..."
                      : "Creating..."
                    : isUpdate
                      ? "Update Lead"
                      : "Create Lead"}
                </button>
              </form>
            </div>
          </div>
        </Drawer>
      </div>
      <AppModal
        title={`Add ${selectAllResults ? total : selectedLeads.length} leads to list
            group`}
        isOpen={addListModal}
        onClose={() => setAddListModal(false)}
      >
        <div className="flex flex-col items-center justify-center h-[30vh]">
          <form onSubmit={handleListGroupSubmit} className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Select List Groups
            </label>
            <MultiSelectObjects
              options={listGroups.map((l) => {
                return {
                  id: l.id,
                  value: l.list_name,
                };
              })}
              value={selectedListGroups}
              onChange={setSelectedListGroups}
              placeholder="Choose list groups..."
              searchable
              selectAllLabel="Select All List Groups"
            />
            <button
              type="submit"
              className={`mt-38 px-4 py-2 rounded text-center text-white ${
                cudloading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={cudloading} // disables the button when submitting
            >
              {cudloading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </AppModal>
    </>
  );
}
