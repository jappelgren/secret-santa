import { FormEvent, useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [userData, setUserData] = useState([{}]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res: any = await axios.get('/api/user-data');
    setUserData(res.data);
  };
  return (
    <form
      className="flex flex-col items-center justify-center h-96"
      onSubmit={(e: FormEvent<HTMLFormElement>) => handleSubmit(e)}
    >
      <p>Login to enter or edit your list.</p>
      <label htmlFor="">First Name</label>
      <input type="text" className="bor ring" />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
