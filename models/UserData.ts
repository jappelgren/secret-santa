import { z } from 'zod';

export const UserData = z.object({
  id: z.string(),
  name: z.string(),
  email: z.optional(z.string().email()),
  idea1: z.optional(z.string()),
  idea2: z.optional(z.string()),
  idea3: z.optional(z.string()),
  gettingGiftFor: z.optional(z.string()),
});

export type UserDataType = z.infer<typeof UserData>;

export const UserDataAllRequired = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email().min(3),
  idea1: z.string().min(3),
  idea2: z.string().min(3),
  idea3: z.string().min(3),
  gettingGiftFor: z.optional(z.string()),
});

export type UserDataAllRequiredType = z.infer<typeof UserDataAllRequired>

export const AdminData = z.object({
  id: z.string(),
  userName: z.string(),
  password: z.string(),
});

export type AdminDataType = z.infer<typeof AdminData>;

export class UserDataClass {
  id;
  name;
  email;
  idea1;
  idea2;
  idea3;
  gettingGiftFor;

  constructor(
    id: string,
    name: string,
    email: string | undefined,
    idea1: string | undefined,
    idea2: string | undefined,
    idea3: string | undefined,
    gettingGiftFor: string | undefined
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.idea1 = idea1;
    this.idea2 = idea2;
    this.idea3 = idea3;
    this.gettingGiftFor = gettingGiftFor;
  }

  giftIdeasComplete() {
    return this.idea1 && this.idea2 && this.idea3 ? true : false;
  }
}
