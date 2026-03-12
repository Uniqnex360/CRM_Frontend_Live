import { api } from "../lib/api";

export type ListResponse = {
  id: string;
  owner_id?: string;
  list_name: string;
  type?: "companies" | "lead";
  description: string;
  no_of_records?: number;
  contactCount?: number;
  created_at: string;
  updated_at: string;
};

export type ListAPIResponse = {
  total: number;
  page: number;
  data: ListResponse[];
};

export class ListService {
  async getList(): Promise<ListAPIResponse> {
    // list api
    const rawData = (await api.get(`/list/view_lists`)) as ListResponse[];
    //for now we are mimiking the pagination response
    return {
      page: 0,
      total: 0,
      data: rawData,
    };
  }

  //create api
  async createList(listData: Partial<ListResponse>) {
    const result = await api.post("/list/create_list/", listData);
    return result;
  }

  //update api
  async updateList(id: string, listData: Partial<ListResponse>) {
    const result = await api.put(`/list/${id}/`, listData)
    return result
  }

  //delete api
  async deleteList(id: string) {
    const result = await api.delete(`/list/${id}/`)
    return result
  }

  // add lead to list group
  async addLeadToGroup(id: string, payload?:any) {
    const result = await api.post(`/list/${id}/add_members/`, payload)
    return result;
  }
}
