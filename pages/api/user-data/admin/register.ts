import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import { IAdminData } from '../../../../models';
import { v4 } from 'uuid';
import bcrypt from 'bcrypt';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const adminData: IAdminData = req.body;
  const id = v4();
  const password = bcrypt.hashSync(adminData.password, 10);

  const preppedAdminData = {
    id,
    userName: adminData.userName,
    password,
  };

  if (!fs.existsSync('./models/adminData')) {
    fs.mkdirSync('./models/adminData');
  }
  fs.writeFileSync(
    './models/adminData/admin.json',
    JSON.stringify(preppedAdminData, null, 4)
  );
  res.status(201).send({ msg: 'Admin account created successfully.' });
}
