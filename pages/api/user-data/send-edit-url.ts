import { NextApiRequest, NextApiResponse } from 'next';
import { MsgResponseType } from '../../../models';
import * as utils from '../../../utils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MsgResponseType>
) {
  try {
    switch (req.method) {
      case 'POST':
        const url = `${process.env.BASE_URL}/edit-list/${req.body.id}`;
        const response = await utils.sendEditUrl(req.body, url);

        if (response.MessageId) {
          res
            .status(200)
            .send({ msg: `Email successfully sent to ${req.body.email}` });
        } else {
          res.status(500).send({
            msg: `An error occurred while sending email to user. Response from AWS: ${JSON.stringify(
              response
            )}`,
          });
        }
        break;
      default:
        res.send({
          msg: `This endpoint does not support ${req.method} requests.`,
        });
        break;
    }
  } catch (error) {
    const e = error as Error;
    res.status(500).send({
      msg: `An error occurred while emailing user their list edit link. ${error} ${e.stack}`,
    });
  }
}
