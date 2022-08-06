import { NextApiRequest, NextApiResponse } from 'next';
import {
  MsgResponseType,
  UserDataAllRequiredType,
  UserDataClass,
  UserDataType,
} from '../../../models';
import { assignPairs, getUserData, sendAssignedPairsEmails } from '../../../utils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MsgResponseType>
) {
  try {
    switch (req.method) {
      case 'POST':
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

        const assignedPairs: UserDataAllRequiredType[] = await assignPairs(
          allUsers
        );

        for (let user of assignedPairs) {
          let recipient: any = assignedPairs.find(
            (r) => r.name === user.gettingGiftFor
          );

          setTimeout(() => {
            sendAssignedPairsEmails(user, recipient);
          }, 2000);
        }

        res.send({
          msg: `All users have submitted their lists, have been assigned random recipients and have been emailed.`,
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
