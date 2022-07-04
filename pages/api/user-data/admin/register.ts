import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import { IAdminData } from '../../../../models';
import { v4 } from 'uuid';
import bcrypt from 'bcrypt';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  let adminData: IAdminData = req.body;

  const direRelativeToPublicFolder = 'models/adminData';
  const adminDataDir = path.resolve('./public', direRelativeToPublicFolder);

  if (typeof adminData === 'string') {
    adminData = JSON.parse(adminData);
  }

  const id = v4();
  const password = bcrypt.hashSync(adminData.password, 10);

  const preppedAdminData = {
    id,
    userName: adminData.userName,
    password,
  };

  if (!fs.existsSync(adminDataDir)) {
    fs.mkdirSync(adminDataDir);
  }
  fs.writeFileSync(
    `${adminDataDir}admin.json`,
    JSON.stringify(preppedAdminData, null, 4)
  );
  res.status(201).send({ msg: 'Admin account created successfully.' });
}
