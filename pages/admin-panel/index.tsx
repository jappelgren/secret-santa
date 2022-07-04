import { GetServerSideProps, NextPage } from 'next';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import UserTable from '../../components/UserTable/UserTable';
import { IUserData } from '../../models';

interface Props {
  userData: IUserData[];
}

const AdminPanel: NextPage<Props> = (props) => {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/admin-login');
    },
  });
  const router = useRouter();

  if (status === 'loading') {
    return <>Loading</>;
  }

  return (
    <div>
      <h1 className="text-semibold text-2xl">Admin Options</h1>
      <UserTable userData={props.userData} />
      <button onClick={() => signOut()}>Log Out</button>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch(`${process.env.BASE_URL}/api/user-data`);
  const userData = await res.json();
  return { props: { userData } };
};

export default AdminPanel;
