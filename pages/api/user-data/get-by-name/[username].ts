import type { NextApiRequest, NextApiResponse } from 'next';
import { IUserData, IMsgResponse, RequestMethod, UserData } from '../../../../models';
import Redis from 'ioredis';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IUserData | IMsgResponse>
) {
  const requestMethod = req.method;
  const userName =
    typeof req.query.username === 'string'
      ? req.query.username
      : req.query.username[0];

  switch (requestMethod) {
    case RequestMethod.GET:
      try {
        const userResponse: IUserData | IMsgResponse = await getUserByName(
          userName
        );
        if (userResponse && typeof userResponse !== undefined) {
          res.send(userResponse);
        }
        break;
      } catch (error) {
        res.status(500).send({
          msg: `An error occurred while reading user data. ${error}`,
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

const getUserByName = async (
  name: string
): Promise<IUserData | IMsgResponse> => {
  const redisUrl: string = process.env.REDIS_URL || '';
  if (redisUrl === '')
    throw new Error('REDIS_URL variable not set in environment.');

  const redis = new Redis(redisUrl);

  // Retrieves all hashes stored in Redis.
  const allHashes = await redis.scan(0, 'TYPE', 'hash');
  let requestedUser = {} as IUserData;

  // I hate this loop.  It would be extremely inefficient if a ton of users were in the same gift exchange.
  // Or at the very least eat up all of my free Redis requests.
  for (const hash of allHashes[1]) {
    const redisRes = (await redis.hgetall(hash)) as unknown as IUserData;
    if (redisRes.name.toLocaleLowerCase() === name.toLocaleLowerCase()) {
      requestedUser = redisRes;
      break;
    }
  }

  const result = UserData.safeParse(requestedUser).success
    ? requestedUser
    : { msg: 'Requested user not found in "database".' };
    
  return result;
};
