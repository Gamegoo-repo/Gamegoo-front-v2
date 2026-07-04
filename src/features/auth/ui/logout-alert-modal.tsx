import { useNavigate } from '@tanstack/react-router';
import { createPortal } from 'react-dom';
import PrecautionIcon from '@/shared/assets/icons/precaution.svg?react';
import { useAuth } from '@/shared/model/use-auth';
import { useLogoutAlertModalState } from '../model/logout-alert-modal-store';

function LogoutAlertModal() {
  const { isOpen, closeModal } = useLogoutAlertModalState();
  const { initializeAuth } = useAuth();
  const modalRoot = document.getElementById('modal-root') || document.body;
  const navigate = useNavigate();

  const handleClickLoginButton = () => {
    closeModal();
    initializeAuth();
    navigate({
      to: '/riot',
      replace: true,
    });
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/62">
      <div className="absolute bottom-[28px] w-[90%] overflow-hidden mobile:w-[640px]">
        <div className="mb-2 flex flex-col items-center justify-center rounded-[14px] bg-white px-0 py-5 text-center text-base font-bold mobile:mb-3 mobile:rounded-[18px] mobile:text-lg">
          <div className="h-12 w-12 mobile:mb-4 mobile:h-[72px] mobile:w-[72px]">
            <PrecautionIcon className="h-full w-full" />
          </div>
          <p className="m-0 text-gray-900">로그아웃 되었습니다. 다시 로그인 해주세요</p>
        </div>
        <button
          type="button"
          className="hover:bg-gray-50 w-full cursor-pointer rounded-[14px] bg-white py-3 text-center text-base font-bold text-gray-900 mobile:rounded-[18px] mobile:py-4 mobile:text-lg"
          onClick={handleClickLoginButton}
        >
          로그인
        </button>
      </div>
    </div>,
    modalRoot
  );
}

export default LogoutAlertModal;
