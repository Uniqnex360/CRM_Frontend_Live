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