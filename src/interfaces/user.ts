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
