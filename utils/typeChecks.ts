import { IUserData, MsgResponse } from '@/models';

export const isUserData = (x: any): x is IUserData =>
  x.id &&
  x.name &&
  (x.email || x.email === null) &&
  (x.idea1 || x.idea1 === null) &&
  (x.idea2 || x.idea2 === null) &&
  (x.idea3 || x.idea3 === null);

export const isMsgResponse = (x: any): x is MsgResponse => x.msg;
