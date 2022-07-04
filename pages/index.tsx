import type { NextPage } from 'next';
import Login from '../components/Login/Login';
import { GetServerSideProps } from 'next';
import AdminRegister from '../components/AdminRegister/AdminRegister';

interface Props {
  data: {
    exists: boolean;
  };
}

const Home: NextPage<Props> = (props) => {
  const adminExists = props.data.exists;
  return <>{adminExists ? <Login /> : <AdminRegister />}</>;
};
export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await fetch(`${process.env.BASE_URL}/api/user-data/admin/exists`);
  const data = await res.json();
  return {
    props: { data },
  };
};
