import type { NextApiRequest, NextApiResponse } from 'next';
import { IUserData, MsgResponse, RequestMethod } from '@/models';
import { getUserData } from '@/pages/api/user-data';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<IUserData | MsgResponse>
) {
  const requestMethod = req.method;
  const userName =
    typeof req.query.username === 'string'
      ? req.query.username
      : req.query.username[0];

  switch (requestMethod) {
    case RequestMethod.GET:
      try {
        const userResponse: IUserData | MsgResponse = getUserById(userName);
        if (userResponse && typeof userResponse !== undefined) {
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
      res.status(501).send({
        msg: `Endpoint does not support ${requestMethod} request method.`,
      });
      break;
  }
}

const getUserById = (userName: string): IUserData | MsgResponse => {
  const allJsonFiles: IUserData[] = getUserData();
  const requestedUser: IUserData | undefined = allJsonFiles.find(
    (user: IUserData) =>
      user.name.toLocaleLowerCase() === userName.toLocaleLowerCase()
  );
  const result = requestedUser
    ? requestedUser
    : { msg: 'Requested user not found in "database".' };
  return result;
};
