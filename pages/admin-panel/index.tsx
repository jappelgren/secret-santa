import { NextPage } from 'next';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import UserTable from '../../components/UserTable/UserTable';

const AdminPanel: NextPage = () => {
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
      <UserTable />
      <button onClick={() => signOut()}>Log Out</button>
    </div>
  );
};

export default AdminPanel;
