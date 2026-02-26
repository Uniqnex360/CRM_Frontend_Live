import { api, API_BASE_URL } from "../lib/api";
import { Company } from '../interfaces/company_interface';

export class CompanyService {
  
  async exportCompany() {
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${API_BASE_URL}/export/company/excel`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Export failed: ${response.statusText}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "companies_export.xlsx";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  }

  async uploadCompanies(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const data = await api.postForm("/company/create_company", formData);
    return data;
  }
  async updateCompany(id: string, data: Partial<Company>) {
  return await api.put(`/company/update_company/${id}`, data);
}

  async getCompanies(searchQuery: string, filters: any) {
    const params: Record<string, string> = {};
    
    if (searchQuery) {
      params.keyword = searchQuery;
    }
    if (filters.industry) {
      params.vertical = filters.industry;
    }
    if (filters.employeeCount) {
        params.employees_count = filters.employeeCount;
    }
    if (filters.revenue) {
        params.revenue = filters.revenue;
    }

    const data = await api.get("/company/read_company", params);
    console.log('dataaa',data)
    return data as Company[];
  }
}

export const companyService = new CompanyService();