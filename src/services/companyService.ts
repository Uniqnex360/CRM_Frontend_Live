import { api, API_BASE_URL } from "../lib/api";
import {
  Company,
  CompanyResponse,
  CompanyAPIResponse,
  CompanyCreateUpdate,
} from "../interfaces/company_interface";

export class CompanyService {
  private cleanArray(input: string[] | string | null): string[] {
    if (!input) return [];
    if (Array.isArray(input)) {
      if (
        input.length > 0 &&
        typeof input[0] === "string" &&
        input[0].startsWith("[")
      ) {
        try {
          return JSON.parse(input[0]);
        } catch (e) {
          return input;
        }
      }
      return input;
    }
    return [];
  }
  private findLinkedIn(links: string[]): string {
    const cleanLinks = this.cleanArray(links);
    return (
      cleanLinks.find((link) => link.toLowerCase().includes("linkedin")) || ""
    );
  }
  async exportCompany(data?: any) {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${API_BASE_URL}/export/company/excel`, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
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

  async getCompanies(
    searchQuery: string,
    filters: any,
    page: number,
  ): Promise<CompanyAPIResponse> {
    const params: Record<string, string> = {};

    if (searchQuery) params.keyword = searchQuery;
    if (filters.industry) params.vertical = filters.industry;
    if (filters.revenue) params.revenue = filters.revenue;
    if (filters.employeeCount) params.employee_count = filters.employeeCount;
    if (filters.location) params.location = filters.location;

    const rawData = (await api.get(
      `/company/read_company?page=${page}`,
      params,
    )) as CompanyAPIResponse;

    const mappedItems: CompanyResponse[] = rawData.items.map((item) => {
      const location = [item.city, item.country].filter(Boolean).join(", ");
      const foundedYear =
        item.founding_year != null
          ? String(item.founding_year).split(".")[0]
          : null;
      const technologies = this.cleanArray(item.keywords);
      // const linkedinUrl = this.findLinkedIn(this.cleanArray(item.links));

      return {
        id: item._id,
        name: item.company_name,
        domain_url: item.domain_url || "",
        industry: item.industry || "--",
        employeeCount: String(item.employee_size || ""),
        revenue: String(item.gross_revenue || ""),
        country: [item.city, item.country].filter(Boolean).join(", "),
        location,
        amazon_existing: item.amazon_existing,
        founded: foundedYear,
        description: item.description || "",
        technologies,
        companyEmail: item.company_email || "",
        companyPhone: item.contact || "",
        linkedinUrl: item.company_linkedin_source || "",
        is_active: item.is_active,
        added_to_favourites: item.added_to_favourites,
        leads: item.leads,
      };
    });
    console.log(mappedItems)
    return {
      ...rawData,
      items: mappedItems,
    };
  }

  async createCompany(data: Partial<CompanyCreateUpdate>) {
    const formData = new FormData();
    formData.append("company", JSON.stringify(data));
    const result = await api.postForm("/company/create_company/", formData);
    return result;
  }

  async updateCompany(id: string, data: Partial<CompanyCreateUpdate>) {
    const result = await api.put(`/company/update_company/${id}/`, data);
    return result;
  }

  async handlePatch(id: string, data: any) {
    const result = api.patch(`/company/company_status/${id}`, data);
    return result;
  }
}

export const companyService = new CompanyService();
