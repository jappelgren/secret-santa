import { Header } from './Header/Header';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: DashboardLayoutProps) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};
export default Layout;
