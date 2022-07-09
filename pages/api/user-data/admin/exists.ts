import { NextApiRequest, NextApiResponse } from 'next';
import { AdminDataType, MsgResponseType } from '../../../../models';
import Redis from 'ioredis';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ exists: boolean } | MsgResponseType>
) {
  try {
    const redisUrl: string = process.env.REDIS_URL || '';
    if (redisUrl === '')
      throw new Error('REDIS_URL variable not set in environment.');

    const redis = new Redis(redisUrl);
    const redisRes = await redis.get('admin');
    const admin: AdminDataType =
      redisRes && redisRes?.length > 0 ? JSON.parse(redisRes) : {};

    if (admin && admin!.id && admin!.password && admin!.userName) {
      res.status(200).send({ exists: true });
    } else {
      res.status(200).send({ exists: false });
    }
  } catch (error) {
    res.status(500).send({
      msg: `An error occurred while checking if admin data exists in database, ${error}`,
    });
  }
}
