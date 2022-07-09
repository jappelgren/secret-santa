import type { NextApiRequest, NextApiResponse } from 'next';
import { IUserData, RequestMethod, IMsgResponse } from '../../models';
import Redis from 'ioredis';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IUserData[] | IMsgResponse>
) {
  const requestMethod = req.method;

  switch (requestMethod) {
    case RequestMethod.GET:
      try {
        const getResult: IUserData[] = await getUserData();
        res.send(getResult);
        break;
      } catch (error) {
        res.status(500).send({
          msg: `An error occurred while reading user data. Error: ${JSON.stringify(
            error
          )}`,
        });
        break;
      }
    case RequestMethod.PUT:
      try {
        const body: IUserData = req.body;
        const recordedData = await editUserData(body);
        res.status(201).send({
          msg: `User data successfully recorded. userData: ${JSON.stringify(
            recordedData
          )}`,
        });
        break;
      } catch (error) {
        res.status(500).send({
          msg: `An error occurred while writing user data. ${error}`,
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

const getUserData = async (): Promise<IUserData[]> => {
  const redisUrl: string = process.env.REDIS_URL || '';
  if (redisUrl === '')
    throw new Error('REDIS_URL variable not set in environment.');

  const redis = new Redis(redisUrl);

  // Retrieves all hashes stored in Redis.
  const allHashes = await redis.scan(0, 'TYPE', 'hash');
  let allUsers = [] as IUserData[];

  if (allHashes.length > 0) {
    for (const hash of allHashes[1]) {
      const redisRes = (await redis.hgetall(hash)) as unknown as IUserData;
      allUsers.push(redisRes);
    }
  }

  return allUsers;
};

const editUserData = async (userData: IUserData) => {
  try {
    const { id, name, email, idea1, idea2, idea3 } = userData;
    if (!name || !email || !idea1 || !idea2 || !idea3) {
      throw new Error(
        `Request body does not contain all required fields.
       Request body must have all of the following keys: 'name', 'email', 'idea1', 'idea2', and 'idea3'.`.replace(
          /\n\s{6}/,
          ''
        )
      );
    }

    const redisUrl: string = process.env.REDIS_URL || '';
    if (redisUrl === '')
      throw new Error('REDIS_URL variable not set in environment.');
  
    const redis = new Redis(redisUrl);
    const result = await redis.hmset(`id:${id}`, userData);

    if (result === 'OK') {
      return userData;
    }
    return { msg: `An error occurred while updating user data in database.` };
  } catch (error) {
    return {
      msg: `An error occurred while updating user data in database. ${error}`,
    };
  }
};

const createUser = () => {
  try {
  } catch (error) {}
};
