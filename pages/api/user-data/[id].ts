import type { NextApiRequest, NextApiResponse } from 'next';
import { IUserData, MsgResponse, RequestMethod } from '../../../models';
import { getUserData } from '../user-data';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<IUserData | MsgResponse>
) {
  const requestMethod = req.method;
  const id = typeof req.query.id === 'string' ? req.query.id : req.query.id[0];

  switch (requestMethod) {
    case RequestMethod.GET:
      try {
        const userResponse: IUserData | MsgResponse = getUserById(id);
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

const getUserById = (id: string): IUserData | MsgResponse => {
  const allJsonFiles: IUserData[] = getUserData();
  const requestedUser: IUserData | undefined = allJsonFiles.find((user: IUserData) => user.id === id);
  const result = requestedUser ? requestedUser : {msg: 'Requested user id not found in "database".'}
  return result;
}