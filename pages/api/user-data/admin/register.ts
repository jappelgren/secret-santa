import { NextApiRequest, NextApiResponse } from 'next';
import { IAdminData } from '../../../../models';
import { v4 } from 'uuid';
import bcrypt from 'bcrypt';
import Redis from 'ioredis';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  let adminData: IAdminData = req.body;

  const redisUrl: string = process.env.REDIS_URL || '';
  const redis = new Redis(redisUrl);

  if (typeof adminData === 'string') {
    adminData = JSON.parse(adminData);
  }

  const id = v4();
  const password = bcrypt.hashSync(adminData.password, 10);

  const preppedAdminData = {
    id,
    userName: adminData.userName,
    password,
  };

  redis.set('admin', JSON.stringify(preppedAdminData, null, 4));

  res.status(201).send({ msg: 'Admin account created successfully.' });
}
