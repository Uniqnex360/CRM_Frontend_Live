export interface CompanyContact {
  id: string;
  name: string;
  title: string;
  email_id: string;
  primary_number?: string;
  relevance: number;
  personal_linkedin_source?: string;
}
export interface Company {
  id: string;
  name: string;
  domain_url: string;
  industry: string;
  employeeCount: string;
  revenue: string;
  location: string;
  founded: number;
  country: string;
  amazon_existing: boolean;
  description: string;
  technologies: string[];
  companyEmail: string;
  companyPhone: string;
  linkedinUrl: string;
  leads: CompanyContact[];
  added_to_favourites: boolean;
  is_active: boolean;
}
export interface CompanyResponse {
  _id: string;
  company_name: string;
  domain_url: string | null;
  industry: string | null;
  company_linkedin_source: string | null;
  company_email: string | null;
  description: string | null;
  employee_size: string | number | null;
  gross_revenue: string | null;
  city: string | null;
  country: string | null;
  amazon_existing?: boolean;
  founding_year: string | null;
  keywords: string[] | string;
  links: string[] | string;
  contact: string | null;
  added_to_favourites: boolean;
  is_active: boolean;
  leads: CompanyContact[];
}

export interface CompanyAPIResponse {
  items: CompanyResponse[];
  page: number;
  total: number;
  size: number;
}

export type CompanyCreateUpdate = {
  id?: string;
  company_name: string;
  domain_url: string;
  company_linkedin_source: string;
  employee_size: string;
  country: string;
  amazon_existing: boolean;
  gross_revenue: string;
  industry: string;
  founding_year: string;
};
