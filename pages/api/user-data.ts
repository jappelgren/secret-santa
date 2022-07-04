import type { NextApiRequest, NextApiResponse } from 'next';
import { IUserData, RequestMethod, MsgResponse } from '../../models';
import * as fs from 'fs';
import path from 'path';

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
  const direRelativeToPublicFolder = 'models/userData';
  const userDataDir = path.resolve('./public', direRelativeToPublicFolder);

  const allJsonFiles: string[] = fs.readdirSync(userDataDir);
  if (allJsonFiles && allJsonFiles.length < 1) {
    return [];
  }
  console.log(allJsonFiles);
  const jsonArr: IUserData[] = allJsonFiles.map((data) => {
    const jsonHex: any = fs.readFileSync(`${userDataDir}/${data}`);
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
  return Math.floor(Math.random() * 23);
};
