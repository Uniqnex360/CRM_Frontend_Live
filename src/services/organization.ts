import { api } from "../lib/api";
import { IOrganization, IOrganizationCU } from "../interfaces/organization";

export class OrganizationService {
  // list api for organization list
  async getOrganization(search: string): Promise<IOrganization[]> {
    const listData = (await api.get(
      "/admin/organizations/",
    )) as IOrganization[];
    return listData;
  }

  async createOrganization(orgData: Partial<IOrganizationCU>) {
    const result = await api.post("/admin/create-organization/", orgData);
    return result;
  }
}
