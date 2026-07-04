import { useQueryClient } from '@tanstack/react-query';
import { createPortal } from 'react-dom';

import TrashIcon from '@/shared/assets/icons/trash.svg?react';

import { boardKeys } from '../api/query-keys';
import { usePostDeletedAlertModalState } from '../model/post-deleted-alert-modal-store';

function PostDeletedAlertModal() {
  const { isOpen, closeModal } = usePostDeletedAlertModalState();
  const modalRoot = document.getElementById('modal-root') || document.body;
  const queryClient = useQueryClient();

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/62">
      <div className="absolute bottom-[28px] w-[90%] overflow-hidden mobile:w-[640px]">
        <div className="mb-2 flex flex-col items-center justify-center rounded-[14px] bg-white px-0 py-5 text-center text-base font-bold mobile:mb-3 mobile:rounded-[18px] mobile:text-lg">
          <div className="h-12 w-12 mobile:mb-4 mobile:h-[72px] mobile:w-[72px]">
            <TrashIcon className="h-full w-full" />
          </div>
          <p className="m-0 text-gray-900">해당 글은 삭제된 글입니다.</p>
        </div>
        <button
          type="button"
          className="hover:bg-gray-50 w-full cursor-pointer rounded-[14px] bg-white py-3 text-center text-base font-bold text-gray-900 mobile:rounded-[18px] mobile:py-4 mobile:text-lg"
          onClick={() => {
            queryClient.invalidateQueries({ queryKey: boardKeys.all });
            closeModal();
          }}
        >
          확인
        </button>
      </div>
    </div>,
    modalRoot
  );
}

export default PostDeletedAlertModal;
