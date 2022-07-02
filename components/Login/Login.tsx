import { FormEvent, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import * as TypeChecks from '../../utils';
import { useRouter } from 'next/router';

const Login = () => {
  const router = useRouter();

  const [inputValue, setInputValue] = useState('');
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res: AxiosResponse = await axios.get(
      `/api/user-data/get-by-name/${inputValue}`
    );

    if (res && TypeChecks.isUserData(res.data)) {
      setInputValue('');
      setShowError(false);
      router.push(`/edit-list/${res.data.id}`);
    } else if (res && TypeChecks.isMsgResponse(res.data)) {
      setError(
        `No one name ${inputValue} is participating in this gift exchange.  If you feel this is an error contact the administrator.`
      );
      setShowError(true);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center h-96">
      <form
        className="flex flex-col items-center justify-center"
        onSubmit={(e: FormEvent<HTMLFormElement>) => handleSubmit(e)}
      >
        <p>Login to enter or edit your list.</p>
        <label htmlFor="">First Name</label>
        <input
          type="text"
          className="ring"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      {showError && (
        <p className="c text-red-600 text-center text-xs">{error}</p>
      )}
    </div>
  );
};

export default Login;
