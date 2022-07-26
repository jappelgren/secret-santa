import { NextPage } from 'next';

interface Props {
  modalOpen: boolean;
  setModalOpen: Function;
  children: React.ReactNode | React.ReactNode[];
}

const Modal: NextPage<Props> = (props) => {
  const { modalOpen, setModalOpen, children } = props;

  return modalOpen ? (
    <>
      <div
        id="modal"
        className="opacity-40 bg-gray-500"
        onClick={() => setModalOpen(false)}
      ></div>
      <div className="w-3/4 h-1/3 xl:w-1/4 bg-cyan-100 z-20 opacity-100 absolute top-1/4">
        {children}
      </div>
    </>
  ) : (
    <></>
  );
};
export default Modal;
