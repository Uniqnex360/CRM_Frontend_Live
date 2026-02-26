
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
