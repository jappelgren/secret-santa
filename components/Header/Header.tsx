import { NextComponentType } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Admin from '/images/admin.svg';

export const Header: NextComponentType = () => {
  const router = useRouter();
  return (
    <header className="h-20 w-full flex flex-row justify-between p-4 items-center bg-green-600 overflow-hidden">
      <Image
        src="/images/holigabe_wreath.png"
        alt="A picture of weird looking french bulldog's head sticking out of a christmas wreath."
        width="75px"
        height="75px"
        onClick={() => router.push('/')}
      />
      <Admin onClick={() => router.push('/admin-panel')} className="fill-white" />
    </header>
  );
};
