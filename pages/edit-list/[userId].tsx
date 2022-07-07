import { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { IUserData } from '../../models';
import { ChangeEvent, FormEvent, useState } from 'react';

interface Props {
  data: IUserData;
}

const EditList: NextPage<Props> = (props: Props) => {
  const { data } = props;
  const [userData, setUserData] = useState<IUserData>(data);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validateForm(userData)) {
      fetch('/api/user-data', {
        method: 'PUT',
        body: JSON.stringify(userData),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  };

  const validateForm = (formData: IUserData) => {
    if (
      formData.email &&
      formData.email.length > 3 &&
      formData.idea1 &&
      formData.idea1.length > 0 &&
      formData.idea2 &&
      formData.idea1.length > 0 &&
      formData.idea3 &&
      formData.idea1.length > 0
    ) {
      return true;
    }
    return false;
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="user-name">
          First Name
          <input required type="text" value={props.data.name} disabled />
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
