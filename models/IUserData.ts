import { string, z } from 'zod';

export const UserData = z.object({
  id: z.string(),
  name: z.string(),
  email: z.optional(z.string().email()),
  idea1: z.optional(z.string()),
  idea2: z.optional(z.string()),
  idea3: z.optional(z.string()),
});

export type IUserData = z.infer<typeof UserData>;

// export interface IUserData {
//   id: string;
//   name: string;
//   email: string | undefined;
//   idea1: string | undefined;
//   idea2: string | undefined;
//   idea3: string | undefined;
// }

export const AdminData = z.object({
  id: z.string(),
  userName: z.string(),
  password: z.string(),
});

export type IAdminData = z.infer<typeof AdminData>;

// export interface IAdminData {
//   id: string;
//   userName: string;
//   password: string;
// }
