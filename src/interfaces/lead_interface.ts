export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  company: string;
  companyDomain?: string;
  location: string;
  city?: string;
  state?: string;
  country?: string;
  email: string;
  emailStatus: "verified" | "unverified" | "likely";
  added_to_favourites: boolean;
  phone?: string;
  mobilePhone?: string;
  directPhone?: string;
  linkedinUrl?: string;
  department: string;
  seniority: string;
  industry?: string;
  keywords?: string[];
  photoUrl?: string;
  companySize?: string;
  revenue?: string;
  company_id?: string
}
export interface LeadData {
  id: string;
  type: "person" | "company";
  name: string;
  email?: string;
  phone?: string;
  title?: string;
  company?: string;
  industry?: string;
  location?: string;
  keywords?: string[];
  completeness: number;
  lastUpdated: string;
}
export interface LeadAPIResponse {
  id: string;
  name: string;
  title: string;
  email_id: string;
  company_id: string;
  source: string;
  hq_no: string;
  direct_no: string;
  vertical: string;
  city: string;
  country: string;
  site_search: string[];
  added_to_favourites: boolean;
}

export interface Lead {
  _id: string;
  firstName: string;
  lastName: string;
  name: string;
  title: string;
  company: string;
  email_id: string;
  company_name?: string;
  domain?: string;
  url?: string;
  source?: string;
  source_link?: string;
  company_linkedin_source?: string;
  personal_linkedin_source?: string;
  month?: string | null;
  date?: string | null;
  primary_number?: string | null;
  hq_no?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  geo?: string | null;
  founding_year?: string | null;
  gross_revenue?: string | null;
  employee_size?: string | null;
  amazon_existing?: string | null;
  vertical?: string | null;
  sub_category?: string | null;
  product_count?: string | null;
  cms?: string | null;
  industry?: string | null;
  emailStatus: "verified" | "unverified" | "likely";
  phone?: string;
  location?: string;
  keywords?: string[];
  added_to_favourites: boolean;
}
