import { NextApiRequest, NextApiResponse } from 'next';
import { MsgResponseType, UserDataClass, UserDataType } from '../../../models';
import { assignPairs, getUserData, sendEmail } from '../../../utils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MsgResponseType>
) {
  try {
    switch (req.method) {
      case 'GET':
        const allUsers = await getUserData();
        const allUsersHaveSubmitted = new Set(
          allUsers.map((user: UserDataType) => {
            const tempUser = new UserDataClass(
              user.id,
              user.name,
              user.email,
              user.idea1,
              user.idea2,
              user.idea3,
              user.gettingGiftFor
            );
            return tempUser.giftIdeasComplete();
          })
        );
        if (
          allUsersHaveSubmitted.size === 2 ||
          allUsersHaveSubmitted.has(false)
        ) {
          res.send({
            msg: `Not all users have submitted their lists yet.`,
          });
          return;
        }

        const assignedPairs = assignPairs(allUsers);
        sendEmail('justinappelgren@gmail.com', 'Justy Baby')
        res.send({
          msg: `All users have submitted their lists and have been assigned random recipients.`,
        });
        break;
      default:
        res.send({
          msg: `Endpoint does not support ${req.method} request method.`,
        });
        break;
    }
  } catch (error) {
    res.send({
      msg: `An error occurred while checking all user's list status ${error}`,
    });
  }
}
