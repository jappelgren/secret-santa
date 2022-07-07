export interface IUserData {
  id: string;
  name: string;
  email: string | undefined;
  idea1: string | undefined;
  idea2: string | undefined;
  idea3: string | undefined;
}

export interface IAdminData {
  id: string;
  userName: string;
  password: string;
}
