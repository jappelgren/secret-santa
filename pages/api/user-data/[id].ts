import type { NextApiRequest, NextApiResponse } from 'next';
import { UserDataType, MsgResponse, RequestMethod } from '../../../models';
import * as fs from 'fs';
import { getUserData } from '../user-data';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserDataType | MsgResponse>
) {
  const requestMethod = req.method;
  const id = typeof req.query.id === 'string' ? req.query.id : req.query.id[0];

  switch (requestMethod) {
    case RequestMethod.GET:
      try {
        const userResponse: UserDataType | MsgResponse = getUserById(id);
        if(userResponse && typeof userResponse !== undefined) {
          res.send(userResponse);
        }
        break;
      } catch (error) {
        res.status(500).send({
          msg: `An error occurred while reading user data. Error: ${JSON.stringify(
            error
          )}`,
        });
        break;
      }
    default:
      res.status(501).send({ msg: 'What' });
      break;
  }
}

const getUserById = (id: string): UserDataType | MsgResponse => {
  const allJsonFiles: UserDataType[] = getUserData();
  const requestedUser: UserDataType | undefined = allJsonFiles.find((user: UserDataType) => user.id === id);
  const result = requestedUser ? requestedUser : {msg: 'Requested user id not found in "database".'}
  return result;
}