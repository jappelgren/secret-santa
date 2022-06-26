// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  name: string;
  randomNumber: number;
  requestBody: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const randomNumber = Math.floor(Math.random() * 100);
  const requestBody = req.body
  res.status(200).json({ name: 'John Doe', randomNumber, requestBody });
}
