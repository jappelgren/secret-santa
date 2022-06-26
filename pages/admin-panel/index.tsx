import { NextPage } from 'next';
import UserTable from '../../components/UserTable/UserTable';

const AdminPanel: NextPage = () => {
  return (
    <div>
      <h1>ADMIN</h1>
      <UserTable />
    </div>
  );
};

export default AdminPanel;
