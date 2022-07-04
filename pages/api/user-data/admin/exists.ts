import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import { IAdminData, MsgResponse } from '../../../../models';
import path from 'path';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ exists: boolean } | MsgResponse>
) {
  const direRelativeToPublicFolder = 'models/adminData';
  const adminDataDir = path.resolve('./public', direRelativeToPublicFolder);

  const userHex: any = fs.existsSync(`${adminDataDir}/admin.json`)
    ? fs.readFileSync(`${adminDataDir}/admin.json`)
    : '';
  const user: IAdminData = userHex ? JSON.parse(userHex) : '';
  try {
    if (user && user.id && user.password && user.userName) {
      res.status(200).send({ exists: true });
    } else {
      res.status(200).send({ exists: false });
    }
  } catch (error) {
    res.status(500).send({
      msg: `An error occurred while checking if admin data exists in "database", ${JSON.stringify(
        error
      )}`,
    });
  }
}
