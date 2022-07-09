import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { UserDataType } from '../../models';
import Checked from '/public/images/checked.svg';
import Unchecked from '/public/images/unchecked.svg';

class UserDataClass {
  id;
  name;
  email;
  idea1;
  idea2;
  idea3;

  constructor(
    id: string,
    name: string,
    email: string | undefined,
    idea1: string | undefined,
    idea2: string | undefined,
    idea3: string | undefined
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.idea1 = idea1;
    this.idea2 = idea2;
    this.idea3 = idea3;
  }

  giftIdeasComplete() {
    return this.idea1 && this.idea2 && this.idea3;
  }
}
interface Props {
  userData: UserDataType[];
}

const UserTable: NextPage<Props> = (props) => {
  const [userData, setUserData] = useState<UserDataClass[]>([]);

  useEffect(() => {
    const userData = props.userData.map(
      (user: UserDataType) =>
        new UserDataClass(
          user.id,
          user.name,
          user.email,
          user.idea1,
          user.idea2,
          user.idea3
        )
    );
    setUserData(userData);
  }, [props]);

  return (
    <section className="flex justify-center items-center flex-col">
      {userData.length ? (
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-semibold">Users</h2>
          <table className="border-collapse table-auto w-2/5">
            <thead className="table-header-group">
              <tr className="background bg-green-500">
                <th className="border border-slate-700  pr-4 pl-4">Name</th>
                <th className="border border-slate-700 whitespace-nowrap pr-4 pl-4">
                  List Submitted
                </th>
                <th className="border border-slate-700 whitespace-nowrap pr-4 pl-4">
                  Delete User
                </th>
              </tr>
            </thead>
            <tbody>
              {userData?.map((user: UserDataClass, i: number) => (
                <tr
                  key={user.name}
                  className={`${i % 2 === 0 ? 'bg-red-50' : ''}`}
                >
                  <td className="border border-slate-700 text-center">
                    {user.name}
                  </td>
                  <td className="border border-slate-700">
                    {user.giftIdeasComplete() ? (
                      <div className="flex w-full justify-center">
                        <Checked className="w-8 fill-slate-700" />
                      </div>
                    ) : (
                      <div className="flex w-full justify-center">
                        <Unchecked className="w-8 fill-slate-700" />
                      </div>
                    )}
                  </td>
                  <td className="border border-slate-700">
                    <div className="flex w-full justify-center">
                      <button>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No Users Added Yet</p>
      )}
    </section>
  );
};

export default UserTable;
