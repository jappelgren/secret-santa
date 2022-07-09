import type { NextApiRequest, NextApiResponse } from 'next';
import {
  IUserData,
  IMsgResponse,
  RequestMethod,
  UserData,
} from '../../../../models';
import Redis from 'ioredis';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IUserData | IMsgResponse>
) {
  const requestMethod = req.method;
  const id = typeof req.query.id === 'string' ? req.query.id : req.query.id[0];

  switch (requestMethod) {
    case RequestMethod.GET:
      try {
        const userResponse: IUserData | IMsgResponse = await getUserById(id);

        if (userResponse && typeof userResponse !== undefined) {
          res.send(userResponse);
        }
        break;
      } catch (error) {
        res.status(500).send({
          msg: `An error occurred while reading user data. Error: ${error}`,
        });
        break;
      }
    default:
      res.status(501).send({
        msg: `Endpoint does not support ${requestMethod} request method.`,
      });
      break;
  }
}

const getUserById = async (id: string): Promise<IUserData | IMsgResponse> => {
  const redisUrl: string = process.env.REDIS_URL || '';
  if (redisUrl === '')
    throw new Error('REDIS_URL variable not set in environment.');
  const redis = new Redis(redisUrl);

  const requestedUser = (await redis.hgetall(
    `id:${id}`
  )) as unknown as IUserData;

  const result = UserData.safeParse(requestedUser).success
    ? requestedUser
    : { msg: 'Requested user not found in "database".' };
  return result;
};
