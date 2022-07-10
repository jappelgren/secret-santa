import bcrypt from 'bcrypt';
import Redis from 'ioredis';
import { NextApiRequest, NextApiResponse } from 'next';
import { v4 } from 'uuid';
import { AdminDataType } from '../../../../models';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    let adminData: AdminDataType = req.body;

    const redisUrl: string = process.env.REDIS_URL || '';
    if (redisUrl === '')
      throw new Error('REDIS_URL variable not set in environment.');

    const redis = new Redis(redisUrl);

    // Check if an admin already exists, if so we will not create another.
    const redisRes = await redis.get('admin');
    const admin: AdminDataType =
      redisRes && redisRes?.length > 0 ? JSON.parse(redisRes) : {};

    if (admin && admin.id && admin.password && admin.userName) {
      res
        .status(500)
        .send({
          msg: 'One admin already exists. There cannot be more than one admin at a time.',
        });
      return;
    }

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
  } catch (error) {
    res.status(500).send({
      msg: `An error occurred while creating admin user, ${error}`,
    });
  }
}
