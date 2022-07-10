import { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import {
  MsgResponseType,
  UserDataAllRequired,
  UserDataType,
} from '../../models';
import { ChangeEvent, FormEvent, useState } from 'react';
import { z } from 'zod';

interface Props {
  data: UserDataType;
}

const EditList: NextPage<Props> = (props: Props) => {
  const { data } = props;
  const [userData, setUserData] = useState<UserDataType>(data);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setErrorMessage('');
    setSuccessMessage('');

    const validation = UserDataAllRequired.safeParse(userData);

    try {
      if (validation.success) {
        const res: Response = await fetch('/api/user-data', {
          method: 'PUT',
          body: JSON.stringify(userData),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const responseMsg: MsgResponseType = await res.json();
        if (res.ok) {
          setSuccessMessage(responseMsg.msg);
          return;
        }
        setErrorMessage(responseMsg.msg);
      }
      setErrorMessage(
        'All fields must be filled out with.  Email must be an actual real email.'
      );
    } catch (error: any) {
      setErrorMessage(error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="user-name">
          First Name
          <input
            className="capitalize"
            required
            type="text"
            value={props.data.name}
            disabled
          />
        </label>
        <label htmlFor="user-name">
          Email
          <input
            required
            type="text"
            value={userData.email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setUserData({ ...userData, email: e.target.value })
            }
          />
        </label>
        <label htmlFor="user-name">
          First Idea
          <input
            required
            type="text"
            value={userData.idea1}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setUserData({ ...userData, idea1: e.target.value })
            }
          />
        </label>
        <label htmlFor="user-name">
          Second Idea
          <input
            required
            type="text"
            value={userData.idea2}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setUserData({ ...userData, idea2: e.target.value })
            }
          />
        </label>
        <label htmlFor="user-name">
          Third Idea
          <input
            required
            type="text"
            value={userData.idea3}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setUserData({ ...userData, idea3: e.target.value })
            }
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      <p>{errorMessage ? errorMessage : successMessage}</p>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { userId } = context.query;
  const res = await fetch(
    `${process.env.BASE_URL}/api/user-data/get-by-id/${userId}`
  );
  const data = await res.json();
  return {
    props: { data },
  };
};

export default EditList;
