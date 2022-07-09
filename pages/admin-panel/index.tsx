import { GetServerSideProps, NextPage } from 'next';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import UserTable from '../../components/UserTable/UserTable';
import AddUserForm from '../../components/AddUserForm/AddUserForm';
import { UserDataType } from '../../models';
import { useEffect, useState } from 'react';

const AdminPanel: NextPage = () => {
  const [rerender, setRerender] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserDataType[]>([]);

  const getAllUsers = async () => {
    try {
      const res = await fetch(`/api/user-data`);
      const userDataJson: UserDataType[] = await res.json();
      console.log(userDataJson);
      setUserData(userDataJson);
    } catch (error) {
      console.log(error);
    }
  };

  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/admin-login');
    },
  });
  const router = useRouter();

  useEffect(() => {
    getAllUsers();
  }, [rerender]);

  if (status === 'loading') {
    return <>Loading</>;
  }
  console.log(rerender);
  return (
    <div>
      <h1 className="text-semibold text-2xl">Admin Options</h1>
      <AddUserForm
        allUsers={userData}
        rerenderParent={setRerender}
        rerenderState={rerender}
      />
      <UserTable userData={userData} />
      <button onClick={() => signOut()}>Log Out</button>
    </div>
  );
};

export default AdminPanel;
