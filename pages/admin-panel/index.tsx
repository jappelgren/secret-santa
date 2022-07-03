import { NextPage } from 'next';
import UserTable from '@/components/UserTable/UserTable';

const AdminPanel: NextPage = () => {
  return (
    <div>
      <h1 className='text-semibold text-2xl'>Admin Options</h1>
      <UserTable />
    </div>
  );
};

export default AdminPanel;
