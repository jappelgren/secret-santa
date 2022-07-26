import { NextComponentType } from 'next';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import { MsgResponse, UserData } from '../../models';
import Modal from '../Styled/Modal/Modal';
import Button from '../Styled/Button/Button';

const Login: NextComponentType = () => {
  const router = useRouter();

  const [inputValue, setInputValue] = useState('');
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await fetch(`/api/user-data/get-by-name/${inputValue}`);
    const user = await res.json();

    if (res && UserData.safeParse(user).success) {
      setInputValue('');
      setShowError(false);
      router.push(`/edit-list/${user.id}`);
    } else if (res && MsgResponse.safeParse(user).success) {
      setError(
        `No one name ${inputValue} is participating in this gift exchange.  If you feel this is an error contact the administrator.`
      );
      setShowError(true);
    } else {
      setError(
        `No users have been added to the gift exchange yet.  Check back later or contact the administrator.`
      );
      setShowError(true);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center h-96">
      <Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
        wow
        <Button onClickProp={() => setModalOpen(false)}> Close </Button>
      </Modal>
      <button onClick={() => setModalOpen(true)}>Open Modal</button>
      <form
        className="flex flex-col items-center justify-center"
        onSubmit={(e: FormEvent<HTMLFormElement>) => handleSubmit(e)}
      >
        <p>Login to enter or edit your list.</p>
        <label htmlFor="">
          First Name
          <input
            type="text"
            className="ring"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </label>
        <button type="submit">Login</button>
      </form>
      {showError && (
        <p className="c text-red-600 text-center text-xs">{error}</p>
      )}
    </div>
  );
};

export default Login;
