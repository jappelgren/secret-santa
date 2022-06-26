import { NextPage } from 'next';
import UserData from '../../models/userDataClass';
import Checked from '../../public/images/checked.svg';
import Unchecked from '../../public/images/unchecked.svg';

const UserTable: NextPage = () => {
  const tempUserState: UserData[] = [
    new UserData(
      'Gord',
      'gord@gord.gordman',
      'Fortnite',
      'Batman',
      'Justin Bateman'
    ),
    new UserData(
      'Charles',
      'gord@gord.gordman',
      'Fortnite',
      'Batman',
      'Justin Bateman'
    ),
    new UserData('Chunk', null, null, null, null),
  ];
  return (
    <section className="flex justify-center items-center flex-col">
      <h2 className="">Users</h2>
      <table className="border-collapse table-auto w-2/5">
        <thead className="table-header-group">
          <tr className="background bg-green-500">
            <th className="border border-slate-700">Name</th>
            <th className="border border-slate-700">List Submitted</th>
          </tr>
        </thead>
        <tbody>
          {tempUserState.map((user: UserData, i: number) => (
            <tr key={user.name} className={`${i % 2 === 0 ? 'bg-red-50' : ''}`}>
              <td className="border border-slate-700">{user.name}</td>
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
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default UserTable;
