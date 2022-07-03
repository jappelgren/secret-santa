import type { NextApiRequest, NextApiResponse } from 'next';
import { IUserData, RequestMethod, MsgResponse } from '../../models';
import * as fs from 'fs';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<IUserData[] | MsgResponse>
) {
  const requestMethod = req.method;

  switch (requestMethod) {
    case RequestMethod.GET:
      try {
        const getResult: IUserData[] = getUserData();
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
    case RequestMethod.POST:
      try {
        const body: IUserData = req.body;
        const recordedData = postUserData(body);
        res.status(201).send({
          msg: `User data successfully recorded. userData: ${recordedData}`,
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

export const getUserData = (): IUserData[] => {
  const allJsonFiles: string[] = fs.readdirSync('./models/userData');
  if (allJsonFiles && allJsonFiles.length < 1) {
    return [];
  }
  const jsonArr: IUserData[] = allJsonFiles.map((data) => {
    const jsonHex: any = fs.readFileSync(`./models/userData/${data}`);
    return JSON.parse(jsonHex);
  });
  return jsonArr;
};

const postUserData = (userData: IUserData): number => {
  if (
    !userData.name ||
    !userData.email ||
    !userData.idea1 ||
    !userData.idea2 ||
    !userData.idea3
  ) {
    throw new Error(
      `Request body does not contain all required fields.
       Request body must have all of the following keys: 'name', 'email', 'idea1', 'idea2', and 'idea3'.`.replace(
        /\n\s{6}/,
        ''
      )
    );
  }
  console.log(userData);
  return Math.floor(Math.random() * 23);
};
