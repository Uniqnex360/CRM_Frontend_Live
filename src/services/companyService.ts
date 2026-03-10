import { api, API_BASE_URL } from "../lib/api";
import { Company, CompanyResponse, CompanyAPIResponse } from "../interfaces/company_interface";

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

  async getCompanies(
    searchQuery: string,
    filters: any,
    page:number
  ): Promise<CompanyAPIResponse> {
    const params: Record<string, string> = {};

    if (searchQuery) params.keyword = searchQuery;
    if (filters.industry) params.vertical = filters.industry;
    if (filters.revenue) params.revenue = filters.revenue;
    if (filters.employeeCount) params.employees_count = filters.employeeCount;

    const rawData = (await api.get(
      `/company/read_company?page=${page}`,
      params,
    )) as CompanyAPIResponse;

    const mappedItems: CompanyResponse[] = rawData.items.map((item) => {
      const location = [item.city, item.country].filter(Boolean).join(", ");

      let foundedYear = 0;
      if (item.founded) {
        foundedYear = parseInt(String(item.founded).split(".")[0]);
      }

      const technologies = this.cleanArray(item.keywords);
      const linkedinUrl = this.findLinkedIn(this.cleanArray(item.links));

      return {
        id: item.id,
        name: item.company_name,
        domain: item.domain || "",
        industry: item.domain || "--",
        employeeCount: String(item.employees_count || ""),
        revenue: String(item.revenue || ""),
        location,
        founded: foundedYear,
        description: item.description || "",
        technologies,
        companyEmail: item.company_email || "",
        companyPhone: item.contact || "",
        linkedinUrl,
        contacts: [],
      };
    });

    return {
      ...rawData,
      items: mappedItems,
    };
  }
}

export const companyService = new CompanyService();
