import { api } from "../lib/api";
import { IUnassignedUserListResponse } from "../interfaces/user";

export class UserService {
  // list api for organization list
  async getUnassingedUsers(
    search: string,
  ): Promise<IUnassignedUserListResponse> {
    const listData = (await api.get(
      "/admin/unassigned/",
    )) as IUnassignedUserListResponse;
    return listData;
  }

  // assing organization to user
  async assignUserOrganization(user_id: string, body: any): Promise<any> {
    const response = await api.put(`/admin/assign-company/${user_id}/`, body);
    return response.data;
  }
}
