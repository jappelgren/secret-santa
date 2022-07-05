import { NextApiRequest, NextApiResponse } from 'next';
import { IAdminData, MsgResponse } from '../../../../models';
import Redis from 'ioredis';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ exists: boolean } | MsgResponse>
) {
  try {
    const redisUrl: string = process.env.REDIS_URL || '';
    const redis = new Redis(redisUrl);
    const redisRes = await redis.get('admin');
    const admin: IAdminData = redisRes && redisRes?.length > 0 ? JSON.parse(redisRes) : {}

    if (admin && admin!.id && admin!.password && admin!.userName) {
      res.status(200).send({ exists: true });
    } else {
      res.status(200).send({ exists: false });
    }
  } catch (error) {
    res.status(500).send({
      msg: `An error occurred while checking if admin data exists in database, ${JSON.stringify(
        error
      )}`,
    });
  }
}
