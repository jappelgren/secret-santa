const AdminLogin = () => {
  return (
    <section>
      <h1>Admin Login</h1>
      <form>
        <label htmlFor="admin-username-input">Username</label>
        <input type="text" name="username" id="admin-username-input" />
        <label htmlFor="admin-pass-input">Password</label>
        <input type="text" name="password" id="admin-pass-input" />
        <button>Submit</button>
        <button>Back</button>
      </form>
    </section>
  );
};

export default AdminLogin;
