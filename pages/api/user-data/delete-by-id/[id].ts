import type { NextApiRequest, NextApiResponse } from 'next';
import { MsgResponseType, RequestMethod } from '../../../../models';
import Redis from 'ioredis';
import { authorized } from '../../../../utils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MsgResponseType>
) {
  const requestMethod = req.method;
  const id = typeof req.query.id === 'string' ? req.query.id : req.query.id[0];

  const isAuthorized = await authorized(req, res);
  if (!isAuthorized) return;

  switch (requestMethod) {
    case RequestMethod.DELETE:
      try {
        const userResponse: MsgResponseType = await deleteUserById(id);
        res.send(userResponse);
        break;
      } catch (error) {
        res.status(500).send({
          msg: `An error occurred while deleting user data. ${error}`,
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

const deleteUserById = async (id: string): Promise<MsgResponseType> => {
  const redisUrl: string = process.env.REDIS_URL || '';
  if (redisUrl === '')
    throw new Error('REDIS_URL variable not set in environment.');
  const redis = new Redis(redisUrl);

  const delResult = await redis.del(`id:${id}`);

  const result =
    delResult > 0
      ? { msg: `User with id: ${id} deleted successfully` }
      : { msg: 'Requested user not found in "database".' };
  return result;
};
