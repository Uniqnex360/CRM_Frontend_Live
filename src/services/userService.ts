import { api } from "../lib/api";
import { IAdminUserCU, IUnassignedUserListResponse } from "../interfaces/user";

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

  // admin users
  async getUsersForAdmin() {
    const response = await api.get("/user/view/");
    return response;
  }

  async createUser(userData: Partial<IAdminUserCU>) {
    const result = await api.post("/user/create-admin/", userData);
    return result;
  }

  async changeUserRole(user_id: string) {
    const result = await api.put(`/user/promote-admin/${user_id}`, {});
    return result;
  }
}
