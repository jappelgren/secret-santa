import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import {
  MsgResponseType,
  UserDataAllRequiredType,
  UserDataType,
  UserDataAllRequired,
  UserData,
} from '../models';
import Redis from 'ioredis';
import AWS from 'aws-sdk';

const capitalizeString = (str: string): string => {
  return str.charAt(0).toLocaleUpperCase() + str.slice(1);
};

export const authorized = async (
  req: NextApiRequest,
  res: NextApiResponse<MsgResponseType>
) => {
  const token = await getToken({ req });
  if (!token) {
    res
      .status(403)
      .send({ msg: "You don't have permission to access this endpoint" });
    return false;
  }
  return true;
};

export const getUserData = async (): Promise<UserDataType[]> => {
  const redisUrl: string = process.env.REDIS_URL || '';
  if (redisUrl === '')
    throw new Error('REDIS_URL variable not set in environment.');

  const redis = new Redis(redisUrl);

  // Retrieves all hashes stored in Redis.
  const allHashes = await redis.scan(0, 'TYPE', 'hash');
  let allUsers = [] as UserDataType[];

  if (allHashes.length > 0) {
    for (const hash of allHashes[1]) {
      const redisRes = (await redis.hgetall(hash)) as unknown as UserDataType;
      allUsers.push(redisRes);
    }
  }

  return allUsers;
};

const randomNumber = (max: number, min: number = 0): number => {
  return Math.floor(Math.random() * (max - min)) + min;
};

export const assignPairs = (allUsers: UserDataType[]): any => {
  const givers: UserDataType[] = Array.from(allUsers);
  const receivers: UserDataType[] = Array.from(allUsers);

  const pickedReceivers: UserDataType[] = [];

  const result = givers.map((giver: UserDataType, i: number) => {
    const availableReceivers = receivers.filter(
      (receiver: UserDataType) =>
        receiver.name !== giver.name && !pickedReceivers.includes(receiver)
    );

    if (
      availableReceivers.length === 2 &&
      availableReceivers.includes(givers[i + 1])
    ) {
      pickedReceivers.push(givers[i + 1]);
      return { ...giver, gettingGiftFor: givers[i + 1].name };
    } else {
      const randomIndex = randomNumber(availableReceivers.length);
      pickedReceivers.push(availableReceivers[randomIndex]);
      return { ...giver, gettingGiftFor: availableReceivers[randomIndex].name };
    }
  });

  return result;
};

export const sendAssignedPairsEmails = (
  giver: UserDataAllRequiredType,
  recipient: UserDataAllRequiredType
) => {
  const SES_CONFIG = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-2',
  };
  const AWS_SES = new AWS.SES(SES_CONFIG);

  let template: string;
  if (
    UserDataAllRequired.safeParse(giver).success &&
    UserDataAllRequired.safeParse(recipient).success
  ) {
    template = assignedPairsEmailTemplate(
      giver.name,
      recipient.name as string,
      [
        recipient.idea1 as string,
        recipient.idea2 as string,
        recipient.idea3 as string,
      ]
    ) as string;
  } else {
    throw new Error(
      `An error occurred while creating email template. Something is probably missing from one of these objects.
      Recipient: ${JSON.stringify(recipient)}
      Giver: ${JSON.stringify(giver)}`
    );
  }

  let params = {
    Source: 'santa-gabe@justinappelgren.io',
    Destination: {
      ToAddresses: [giver.email],
    },
    ReplyToAddresses: [],
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: template,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `What's up ${giver.name}`,
      },
    },
  };
  return AWS_SES.sendEmail(params).promise();
};

export const sendEditUrl = (user: UserDataType, editUrl: string) => {
  const SES_CONFIG = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-2',
  };
  const AWS_SES = new AWS.SES(SES_CONFIG);

  if(!user.email) {
    throw new Error('User object does not contain email address.')
  }

  let template: string;
  if (UserData.safeParse(user).success) {
    template = userEditLinkEmailTemplate(user, editUrl);
  } else {
    throw new Error(`An error occurred while sending edit list link to user ${user.name}.`)
  }

  let params = {
    Source: 'santa-gabe@justinappelgren.io',
    Destination: {
      ToAddresses: [user.email],
    },
    ReplyToAddresses: [],
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: template,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `Secret Santa List Edit Link Within`,
      },
    },
  };
  return AWS_SES.sendEmail(params).promise();
};

const assignedPairsEmailTemplate = (
  giver: string,
  recipient: string,
  recipientList: string[]
): string => {
  const template = `
  <!DOCTYPE html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Happy Holigabes</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <div>
      <img
        src="https://santa-gabe.s3.us-east-2.amazonaws.com/holigabe_wreath.png"
        alt="A picture of a tragic looking french bulldog head sticking out of a christmas wreath."
        style="width: 33.3333%;  display: block; margin-left: auto; margin-right: auto; width: 40%;"
      />
    </div>
    <div>
      <h1 style="font-size: x-large; text-align: center; font-family: 'Pacifico', cursive;">Happy Holigabes From the Secret Santa Bot</h1>
      <p>Hi ${capitalizeString(giver)},</p>
      <p>Thanks for taking part in the mandatory ${new Date().getFullYear()} Secret Santa Gift Exchange.  </P>
      <p>Great news!</p>
      <p>All participants have finished filling out their gift ideas and we have selected the person for whom you will be getting a gift.  That person is: 
      <h2>${capitalizeString(recipient)}</h2></p> 
      <p>${capitalizeString(
        recipient
      )} has come up with the following ideas:</p>
      <ul>
        ${recipientList.map((item) => `<li>${item}</li>`).join('\n')}
      </ul>
      <p>Please buy ${capitalizeString(
        recipient
      )} one of these items or something of your own choosing.</p>
      <p>See you on Christmas.</p>
      <p>Love,</p>
      <p style="font-size: x-large; text-align: left; font-family: 'Pacifico', cursive;">Santa Gabe</p>
    </div>
  </body>
</html>
  `;
  return template;
};

const userEditLinkEmailTemplate = (user: UserDataType, editUrl: string): string => {
  const template = `
  <!DOCTYPE html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Happy Holigabes</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <div>
      <img
        src="https://santa-gabe.s3.us-east-2.amazonaws.com/holigabe_wreath.png"
        alt="A picture of a tragic looking french bulldog head sticking out of a christmas wreath."
        style="width: 33.3333%;  display: block; margin-left: auto; margin-right: auto; width: 40%;"
      />
    </div>
    <div>
      <h1 style="font-size: x-large; text-align: center; font-family: 'Pacifico', cursive;">Happy Holigabes From the Secret Santa Bot</h1>
      <p>Hi ${capitalizeString(user.name)},</p>
      <p>Here is a <a href=${editUrl}>link</a> to edit your list. If you did not request this email, someone is trying to sneak a peak at your list.</p>
      
      <p>If you for some reason receive a bunch of these emails please inform the admin of your gift exchange.</p>
      
      <p>Love,</p>
      <p style="font-size: x-large; text-align: left; font-family: 'Pacifico', cursive;">Santa Gabe</p>
    </div>
  </body>
</html>
  `;
  return template;
};
