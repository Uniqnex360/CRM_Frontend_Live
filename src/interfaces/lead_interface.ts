export interface Lead{
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
  added_to_favourites:boolean
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
}
export interface LeadData {
  id: string;
  type: 'person' | 'company';
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
  id: string;
  firstName: string;
  lastName: string;
  name: string; 
  title: string;
  company: string;
  email: string;
  emailStatus: 'verified' | 'unverified' | 'likely';
  phone: string;
  location: string;
  industry: string;
  keywords: string[];
  added_to_favourites: boolean;
}