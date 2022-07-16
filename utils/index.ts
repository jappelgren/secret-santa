import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { MsgResponseType, UserDataType } from '../models';
import Redis from 'ioredis';
import AWS from 'aws-sdk';

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

export const getUserData = async (): Promise<UserDataType[]> => {
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

const randomNumber = (max: number, min: number = 0): number => {
  return Math.floor(Math.random() * (max - min)) + min;
};

export const assignPairs = (allUsers: UserDataType[]): any => {
  const givers: UserDataType[] = Array.from(allUsers);
  const receivers: UserDataType[] = Array.from(allUsers);

  const pickedReceivers: UserDataType[] = [];

  const result = givers.map((giver: UserDataType, i: number) => {
    const availableReceivers = receivers.filter(
      (receiver: UserDataType) =>
        receiver.name !== giver.name && !pickedReceivers.includes(receiver)
    );

    if (availableReceivers.length === 1) return { ...giver, gettingGiftFor: availableReceivers[0].name };

    if (
      availableReceivers.length === 2 &&
      availableReceivers.includes(givers[i + 1])
    ) {
      pickedReceivers.push(givers[i + 1]);
      return { ...giver, gettingGiftFor: givers[i + 1].name };
    } else {
      const randomIndex = randomNumber(availableReceivers.length);
      pickedReceivers.push(availableReceivers[randomIndex]);
      return { ...giver, gettingGiftFor: availableReceivers[randomIndex].name };
    }
  });

  return result;
};

export const sendEmail = (recipientEmail: string, name: string) => {
  const SES_CONFIG = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-2',
  };
  const AWS_SES = new AWS.SES(SES_CONFIG);
  let params = {
    Source: 'santa-gabe@justinappelgren.io',
    Destination: {
      ToAddresses: [recipientEmail],
    },
    ReplyToAddresses: [],
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: '<div><h1>WOW</h1><p>An Email</p></div>',
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `What's up ${name}`,
      },
    },
  };
  return AWS_SES.sendEmail(params).promise();
};
