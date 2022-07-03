import { NextPage } from 'next';
import { useRouter } from 'next/router';

const EditList: NextPage = () => {
  const router = useRouter();

  const { userId } = router.query;
  return <>{userId}</>;
};

export default EditList;
