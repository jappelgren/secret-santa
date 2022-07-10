import type { NextApiRequest, NextApiResponse } from 'next';
import {
  UserDataType,
  RequestMethod,
  MsgResponseType,
  UserData,
} from '../../models';
import Redis from 'ioredis';
import { v4 } from 'uuid';
import { getToken } from 'next-auth/jwt';
import { authorized } from '../../utils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserDataType[] | MsgResponseType>
) {
  const requestMethod = req.method;

  switch (requestMethod) {
    case RequestMethod.GET:
      try {
        const getResult: UserDataType[] = await getUserData();
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
        const body: UserDataType = req.body;
        const recordedData: UserDataType | MsgResponseType = await editUserData(
          body
        );
        if (recordedData && UserData.safeParse(recordedData).success) {
          res.status(200).send({
            msg: `List updated successfully.`,
          });
          break;
        }
        console.error(recordedData);
        res.status(500).send({
          msg: 'An error occurred while updating list.  Please try again.',
        });
        break;
      } catch (error) {
        res.status(500).send({
          msg: `An error occurred while writing user data. ${error}`,
        });
        break;
      }
    case RequestMethod.POST:
      const isAuthorized = await authorized(req, res);
      if (!isAuthorized) return;
      
      try {
        const body: UserDataType = req.body;
        const recordedData = await addUserData(body);
        res.status(201).send({
          msg: `User: ${body.name} successfully added to gift exchange.`,
        });
        break;
      } catch (error) {
        res.status(500).send({
          msg: `An error occurred while creating new user. ${error}`,
        });
      }
    default:
      res.status(501).send({
        msg: `Endpoint does not support ${requestMethod} request method.`,
      });
      break;
  }
}

const getUserData = async (): Promise<UserDataType[]> => {
  const redisUrl: string = process.env.REDIS_URL || '';
  if (redisUrl === '')
    throw new Error('REDIS_URL variable not set in environment.');

  const redis = new Redis(redisUrl);

  // Retrieves all hashes stored in Redis.
  const allHashes = await redis.scan(0, 'TYPE', 'hash');
  let allUsers = [] as UserDataType[];

  if (allHashes.length > 0) {
    for (const hash of allHashes[1]) {
      const redisRes = (await redis.hgetall(hash)) as unknown as UserDataType;
      allUsers.push(redisRes);
    }
  }

  return allUsers;
};

const editUserData = async (userData: UserDataType) => {
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

const addUserData = async (userData: UserDataType) => {
  try {
    const { name } = userData;
    const id = v4();

    const newUser = {
      name,
      id,
    };

    const redisUrl: string = process.env.REDIS_URL || '';
    if (redisUrl === '')
      throw new Error('REDIS_URL variable not set in environment.');

    const redis = new Redis(redisUrl);
    const result = await redis.hmset(`id:${id}`, newUser);

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
