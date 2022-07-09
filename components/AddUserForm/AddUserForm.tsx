import { NextPage } from 'next';
import { FormEvent, ChangeEvent, useState } from 'react';
import { UserDataType } from '../../models';

interface Props {
  allUsers: UserDataType[];
  rerenderParent: Function;
  rerenderState: boolean;
}

const AddUserForm: NextPage<Props> = (props: Props) => {
  const { allUsers } = props;
  const allUsernames = allUsers.map((user) => user.name.toLocaleLowerCase());

  const [userInput, setUserInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const userExists = () => {
    return allUsernames.includes(userInput.toLocaleLowerCase());
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userExists()) {
      setErrorMessage(
        `A user with the name ${userInput} already is added to this gift exchange.`
      );
      return;
    }
    setErrorMessage('');
    const res = await fetch('/api/user-data', {
      method: 'POST',
      body: JSON.stringify({ name: userInput }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const msg = await res.json();
    if (res.ok) {
      setSuccessMessage(msg.msg);
      props.rerenderParent(!props.rerenderState);
      return;
    }
    setErrorMessage(msg.msg);
    props.rerenderParent(!props.rerenderState);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="new-user-name-input">
          Name
          <input
            id="new-user-name-input"
            type="text"
            value={userInput}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setUserInput(e.target.value)
            }
          />
        </label>
        <button type="submit">Add User</button>
      </form>
      <div className="h-4 m-4">
        {errorMessage.length > 0 ? (
          <p>{errorMessage}</p>
        ) : (
          <p>{successMessage}</p>
        )}
      </div>
    </div>
  );
};

export default AddUserForm;
