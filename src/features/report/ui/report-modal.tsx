import axios from 'axios';
import { useState } from 'react';
import type { ApiErrorResponse } from '@/shared/api';
import {
  isReportErrorCode,
  REPORT_ERROR_MESSAGES,
} from '@/shared/config/error-message/report-error';
import { toast } from '@/shared/lib/toast';
import { cn } from '@/shared/lib/utils';
import CloseButton from '@/shared/ui/button/close-button';
import { Checkbox } from '@/shared/ui/checkbox/Checkbox';
import Modal from '@/shared/ui/modal/modal';
import useSubmitReport from '../api/use-submit-report';
import { reportPathToNumber } from '../lib/report-path-mapper';
import { useReportModalStore } from '../model/use-report-modal-store';

const REPORT_REASONS = [
  {
    id: 1,
    type: 'SPAM', // 또는 code, value
    label: '스팸 홍보/ 도배글', // UI 표시용
  },
  {
    id: 2,
    type: 'ILLEGAL_CONTENT',
    label: '불법 정보 포함',
  },
  {
    id: 3,
    type: 'HARASSMENT',
    label: '성희롱 발언',
  },
  {
    id: 4,
    type: 'HATE_SPEECH',
    label: '욕설/ 혐오/ 차별적 표현',
  },
  {
    id: 5,
    type: 'PRIVACY_VIOLATION',
    label: '개인 정보 노출',
  },
  {
    id: 6,
    type: 'OFFENSIVE',
    label: '불쾌한 표현',
  },
] as const;

type ReportFormState = {
  selectedReasons: Set<number>;
  details: string;
};

const INITIAL_FORM_STATE: ReportFormState = {
  selectedReasons: new Set(),
  details: '',
} as const;

export default function ReportModal() {
  const { closeModal, selectedPostId, userId, path } = useReportModalStore();
  const reportSubmitMutate = useSubmitReport();
  const [formState, setFormState] = useState<ReportFormState>(INITIAL_FORM_STATE);

  const handleReasonToggle = (reasonId: number) => {
    setFormState((prev) => {
      const newReasons = new Set(prev.selectedReasons);
      if (newReasons.has(reasonId)) {
        newReasons.delete(reasonId);
      } else {
        newReasons.add(reasonId);
      }
      return { ...prev, selectedReasons: newReasons };
    });
  };
  return (
    <Modal
      isOpen={path !== undefined}
      onClose={closeModal}
      className="w-full bg-white mobile:w-[494px] mobile:px-8 mobile:py-8"
      isBackdropClosable={false}
      hasCloseButton={false}
    >
      <section className="flex flex-col gap-2 mobile:gap-5">
        <header className="flex items-center justify-between">
          <h2 className="inline-block text-lg font-bold text-gray-800 mobile:text-xl">
            유저 신고하기
          </h2>
          <CloseButton
            onClose={() => {
              setFormState(INITIAL_FORM_STATE);
              closeModal();
            }}
          />
        </header>
        <form
          className="flex flex-col gap-5 text-gray-800 mobile:gap-[30px]"
          onSubmit={(e) => {
            e.preventDefault();
            if (!userId || !path) {
              console.log(`path: ${path}`);
              console.log(`userId: ${userId}`);
              setFormState(INITIAL_FORM_STATE);
              return;
            }

            reportSubmitMutate.mutate(
              {
                targetUserId: userId,
                reportRequest: {
                  pathCode: reportPathToNumber(path),
                  reportCodeList: [...formState.selectedReasons],
                  contents: formState.details,
                  boardId: selectedPostId,
                },
              },
              {
                onSuccess: () => {
                  closeModal();
                  setFormState(INITIAL_FORM_STATE);
                  toast.confirm('신고가 제출되었습니다.');
                },
                onError: (error: Error) => {
                  if (!error) return;

                  if (!axios.isAxiosError<ApiErrorResponse>(error) || !error.response) {
                    toast.error('타입 에러가 발생했습니다.');
                    return;
                  }

                  closeModal();
                  setFormState(INITIAL_FORM_STATE);

                  const errorCode = error.response.data.code || '';

                  if (isReportErrorCode(errorCode)) {
                    toast.error(REPORT_ERROR_MESSAGES[errorCode]);
                  } else {
                    toast.error('신고 제출에 실패했습니다. 다시 시도해주세요.');
                  }
                },
              }
            );
          }}
        >
          <fieldset className="flex w-full flex-col gap-1.5 mobile:gap-4">
            <legend className="mb-1 text-[17px] font-semibold mobile:mb-2 mobile:text-lg">
              신고 사유
            </legend>

            {REPORT_REASONS.map((reportType) => {
              return (
                <div
                  key={reportType.id}
                  className="flex items-center gap-2 text-base text-gray-800 mobile:text-lg"
                >
                  <Checkbox
                    className="h-[16px] w-[16px] mobile:h-[21px] mobile:w-[21px]"
                    id={reportType.type}
                    isChecked={formState.selectedReasons.has(reportType.id)}
                    onCheckedChange={() => {
                      handleReasonToggle(reportType.id);
                    }}
                  />
                  <label htmlFor={reportType.type} className="cursor-pointer select-none">
                    {reportType.label}
                  </label>
                </div>
              );
            })}
          </fieldset>

          <div className="group flex flex-col gap-2">
            <p className="text-[17px] font-semibold mobile:text-lg">상세 내용</p>

            <textarea
              className={cn(
                'rounded-10 h-[134px] w-full resize-none border-1 border-gray-400 px-2.5 py-2 text-xs text-gray-700 transition-colors duration-150 focus:border-violet-400 focus:outline-none mobile:text-lg'
                // contentError && "focus:border-red-500",
              )}
              maxLength={80}
              placeholder="내용을 입력하세요. (선택)"
              value={formState.details}
              onChange={(e) => {
                setFormState((prev) => {
                  return { ...prev, details: e.target.value };
                });
              }}
            />
          </div>

          <button
            type="submit"
            disabled={!formState.selectedReasons.size}
            className="primary-btn w-full py-[18px] disabled:bg-gray-400"
          >
            신고하기
          </button>
        </form>
      </section>
    </Modal>
  );
}
