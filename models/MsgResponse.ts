import { z } from "zod";

// export type MsgResponse = {
//     msg: string;
//   };

  export const MsgResponse = z.object({
    msg: z.string()
  })

export type IMsgResponse = z.infer<typeof MsgResponse>