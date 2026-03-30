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

}
