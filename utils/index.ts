import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { MsgResponseType } from '../models';

export const authorized = async (
  req: NextApiRequest,
  res: NextApiResponse<MsgResponseType>
) => {
  const token = await getToken({ req });
  if (!token) {
    res
      .status(403)
      .send({ msg: "You don't have permission to access this endpoint" });
    return false;
  }
  return true;
};
