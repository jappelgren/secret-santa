import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';

const AdminRegister: NextPage = () => {
  const initialState = {
    userName: '',
    password: '',
  };
  const router = useRouter();

  const [adminForm, setAdminForm] = useState(initialState);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [disabledSubmit, setDisabledSubmit] = useState(true);

  const invalidForm = () => {
    if (adminForm.userName.length > 0 && adminForm.password.length > 0) {
      adminForm.password === confirmPassword
        ? setDisabledSubmit(false)
        : setDisabledSubmit(true);
      return;
    }
    return setDisabledSubmit(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (disabledSubmit) {
      return;
    }
    const res = await fetch(`/api/user-data/admin/register`, {
      method: 'POST',
      body: JSON.stringify(adminForm),
    });

    if (res.ok) {
      router.push('/admin-panel');
    } else {
      alert(
        'An error occurred while communicating with server.  Please try again.'
      );
    }
  };

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>, key: string) => {
    setAdminForm({ ...adminForm, [key]: e.target.value });
  };

  useEffect(() => {
    invalidForm();
  }, [adminForm, confirmPassword]);

  return (
    <>
      <p>
        {' '}
        Hey, you're the first person to visit this page which means you're the
        admin, whether you like it or not. Register below to get started
      </p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="">Username</label>
        <input
          type="text"
          value={adminForm.userName}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleFormChange(e, 'userName')
          }
          required
        />
        <label htmlFor="">Password</label>
        <input
          type="password"
          value={adminForm.password}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleFormChange(e, 'password')
          }
          required
        />
        <label htmlFor="">Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setConfirmPassword(e.target.value)
          }
          required
        />
        <button type="submit" disabled={disabledSubmit}>
          Submit
        </button>
      </form>
    </>
  );
};
export default AdminRegister;
