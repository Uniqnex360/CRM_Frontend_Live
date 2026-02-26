import { api } from "../lib/api.ts";
import { Lead } from "../interfaces/lead_interface";
export class LeadService {
  async getLeads(searchQuery: string, filters: any): Promise<Lead[]> {
    const params: Record<string, string> = {};
    if (searchQuery) params.keyword = searchQuery;
    if (filters.industry) params.vertical = filters.industry;

    const rawData = await api.get("/leads/read_leads", params) as LeadAPIResponse[];

    return rawData.map((item) => {
      
      const nameParts = (item.name || "").split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const location = [item.city, item.country].filter(Boolean).join(", ");

      const phone = item.direct_no || item.hq_no || "";

      const emailStatus = item.email_id ? "verified" : "unverified";

      return {
        id: item.id,
        firstName,
        lastName,
        name: item.name,
        title: item.title || "Unknown Title",
        
        company: "Company " + item.company_id.slice(-4), 
        
        email: item.email_id || "",
        emailStatus,
        phone,
        location,
        industry: item.vertical || "General",
        keywords: item.site_search || [],
        added_to_favourites: item.added_to_favourites
      };
    });
  }
  async toggleFavorite(leadId: string, currentState: boolean) {
    const body = { added_to_favourites: !currentState };
    const data = await api.patch(`/leads/leads_status/${leadId}`, body);
    return data;
  }
  async updateLead(id:string,data:Partial<Lead>)
  {
    const response=await api.put(`/leads/update_leads/${id}`,data)
    return response


  }
  async uploadLeads(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const data = await api.postForm("/leads/create_leads", formData);
    return data;
  }
  async exportLeads() {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${api}/export/leads/excel`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
}
