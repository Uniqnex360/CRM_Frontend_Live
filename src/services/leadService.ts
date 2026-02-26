import { api } from "../lib/api.ts";
import { Lead } from "../interfaces/lead_interface";
export class LeadService {
  async getLeads(searchQuery: string, filters: any) {
    const params: Record<string, string> = {};
    if (searchQuery) {
      params.keyword = searchQuery;
    }
    if (filters.industry) {
      params.vertical = filters.industry;
    }
    const data = await api.get("/leads/read_leads", params);
    return data as Lead[];
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
