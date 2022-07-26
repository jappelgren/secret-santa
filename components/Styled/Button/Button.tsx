import { NextPage } from 'next';

interface Props {
  children: React.ReactNode | React.ReactNode[];
  onClickProp?: any;
  buttonType?: any;
  fontSize?: string;
}

const Button: NextPage<Props> = (props) => {
  const { children, onClickProp, buttonType, fontSize } = props;
  const voidFunction = () => {
    return;
  };

  return (
    <button
      className={`w-[300px] h-[60px] border-10 bg-opacity-[84%] bg-[#E22B20] border-[4px] border-black rounded-[10px] text-white font-pacifico text-[${fontSize ? fontSize : '32px'}]`}
      onClick={onClickProp ? onClickProp : voidFunction}
      type={buttonType || 'button'}
    >
      {children}
    </button>
  );
};

export default Button;
