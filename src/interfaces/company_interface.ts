
export interface Company {
  id: string;
  name: string;
  domain: string;
  industry: string;
  employeeCount: string;
  revenue: string;
  location: string;
  founded: number;
  description: string;
  logoUrl?: string;
  technologies: string[];
  companyEmail?: string;
  companyPhone?: string;
  linkedinUrl?: string;
  contacts: CompanyContact[];
}
export interface CompanyContact {
  id: string;
  name: string;
  title: string;
  email: string;
  phone?: string;
  relevance: number;
}
export interface Company {
  id: string;
  name: string;
  domain: string;
  industry: string;
  employeeCount: string;
  revenue: string;
  location: string;
  founded: number;
  description: string;
  technologies: string[]; 
  companyEmail: string;
  companyPhone: string;
  linkedinUrl: string;
  contacts: CompanyContact[]; 
}
export interface CompanyAPIResponse {
  id: string;
  company_name: string;
  domain: string | null;
  company_email: string | null;
  description: string | null;
  employees_count: string | number | null;
  revenue: string | null;
  city: string | null;
  country: string | null;
  founded: string | number | null;
  keywords: string[] | string; 
  links: string[] | string;
  contact: string | null;
}