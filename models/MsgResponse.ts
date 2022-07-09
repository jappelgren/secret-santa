import { z } from 'zod';

export const MsgResponse = z.object({
  msg: z.string(),
});

export type MsgResponseType = z.infer<typeof MsgResponse>;
