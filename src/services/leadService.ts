import { api, API_BASE_URL } from "../lib/api.ts";
import { Lead } from "../interfaces/lead_interface";

// Type for API response
interface LeadAPIResponse {
  items: Lead[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// Your LeadService class
export class LeadService {
  async getLeads(
    searchQuery: string,
    filters: any,
    page: number,
    sort_by?: string | null,
    sort_order?: string,
  ): Promise<LeadAPIResponse> {
    const params: Record<string, string> = {};
    if (searchQuery) params.keyword = searchQuery;
    if (filters?.title) params.title = filters.title;
    if (filters?.industry) params.industry = filters.industry;
    if (filters?.company) params.company = filters.company;
    if (filters?.location) params.location = filters.location;
    if(filters?.name) params.name = filters.name;
    if (sort_by) params.sort_by= sort_by;
    if (sort_order) params.sort_order = sort_order;

    // Fetch raw data from API
    const rawData = (await api.get(
      `/leads/read_leads?page=${page}&keyword=${searchQuery}`,
      params,
    )) as LeadAPIResponse;

    if (!rawData?.items) {
      return {
        items: [],
        total: 0,
        page,
        size: 0,
        pages: 0,
      };
    }

    // Map each raw item to Lead interface
    const mappedItems: Lead[] = rawData.items.map((item) => {
      const nameParts = (item.name || "").split(" ");
      const firstName = nameParts[0] || "N/A";
      const lastName = nameParts.slice(1).join(" ") || "";

      const location = [item.city, item.country].filter(Boolean).join(", ");
      const phone = item.primary_number || item.hq_no || "--";
      const emailStatus = item.email_id ? "verified" : "unverified";
      return {
        id: item._id,
        firstName,
        lastName,
        name: item.name || "NA",
        title: item.title,
        company: item?.company_name ? item.company_name : "--",
        email: item.email_id || "",
        emailStatus,
        phone,
        location,
        industry: item.industry || item.vertical || "--",
        keywords: item.site_search || [],
        added_to_favourites: item.added_to_favourites || false,
        domain: item.domain,
        company_linkedin_source: item.company_linkedin_source,
        source: item.source,
        personal_linkedin_source: item.personal_linkedin_source,
        city: item.city,
        state: item.state,
        country: item.country,
        address: item.address,
        company_id: item.company_id
      } as Lead;
    });

    return {
      ...rawData,
      items: mappedItems,
    };
  }

  async toggleFavorite(leadId: string, currentState: boolean) {
    const body = { added_to_favourites: !currentState };
    const data = await api.patch(`/leads/leads_status/${leadId}`, body);
    return data;
  }

  async updateLead(id: string, data: Partial<Lead>) {
    const response = await api.put(`/leads/update_leads/${id}`, data);
    return response;
  }

  async uploadLeads(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const data = await api.postForm("/leads/create_leads", formData);
    return data;
  }

  async exportLeads(body?: any) {
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${API_BASE_URL}/export/leads/excel`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) throw new Error("Export failed");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "leads_export.xlsx";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  // async createLeads(leadData: Partial<Lead>) {
  //   try {
  //     const token = localStorage.getItem("access_token");
  //     const formData = new FormData();
  //     formData.append("lead", JSON.stringify(leadData));

  //     const response = (await api.post("/leads/create_leads/", formdata=formDta))

  //     if (!response.ok) {
  //       const errorText = await response.text();
  //       throw new Error(`Lead creation failed: ${errorText}`);
  //     }

  //     const result = await response.json();
  //     return result;
  //   } catch (error) {
  //     return error;
  //   }
  // }
  async createLeads(leadData: Partial<Lead>) {
    const formData = new FormData();
    formData.append("lead", JSON.stringify(leadData));
    const result = await api.postForm("/leads/create_leads/", formData);
    return result;
  }
}
