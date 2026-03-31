export interface IUser {
  id: string;
  name: string;
  email: string;
  role: string | null;
}

export interface IUnassignedUserListResponse {
  total: number;
  page: number;
  size: number;
  data: IUser[];
}

export interface IAdminUserCU {
  id?: string;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
}

