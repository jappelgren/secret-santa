import { z } from 'zod';

export const UserData = z.object({
  id: z.string(),
  name: z.string(),
  email: z.optional(z.string().email()),
  idea1: z.optional(z.string()),
  idea2: z.optional(z.string()),
  idea3: z.optional(z.string()),
});

export type UserDataType = z.infer<typeof UserData>;

export const UserDataAllRequired = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email().min(3),
  idea1: z.string().min(3),
  idea2: z.string().min(3),
  idea3: z.string().min(3),
});

export const AdminData = z.object({
  id: z.string(),
  userName: z.string(),
  password: z.string(),
});

export type AdminDataType = z.infer<typeof AdminData>;
