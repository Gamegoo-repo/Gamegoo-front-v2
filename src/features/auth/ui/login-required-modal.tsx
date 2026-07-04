import { createPortal } from 'react-dom';

import PrecautionIcon from '@/shared/assets/icons/precaution.svg?react';

import { useLoginRequiredModalStore } from '../model/login-required-modal-store';

function LoginRequiredModal() {
  const { isOpen, closeModal } = useLoginRequiredModalStore();
  const modalRoot = document.getElementById('modal-root') || document.body;

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/62">
      <div className="absolute bottom-[28px] w-[90%] overflow-hidden mobile:w-[640px]">
        <div className="mb-2 flex flex-col items-center justify-center rounded-[14px] bg-white px-0 py-5 text-center text-base font-bold mobile:mb-3 mobile:rounded-[18px] mobile:text-lg">
          <div className="h-12 w-12 mobile:mb-4 mobile:h-[72px] mobile:w-[72px]">
            <PrecautionIcon className="h-full w-full" />
          </div>
          <p className="m-0 text-gray-900">로그인이 필요한 서비스입니다.</p>
        </div>
        <button
          type="button"
          className="hover:bg-gray-50 w-full cursor-pointer rounded-[14px] bg-white py-3 text-center text-base font-bold text-gray-900 mobile:rounded-[18px] mobile:py-4 mobile:text-lg"
          onClick={closeModal}
        >
          확인
        </button>
      </div>
    </div>,
    modalRoot
  );
}

export default LoginRequiredModal;
