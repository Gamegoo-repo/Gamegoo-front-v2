import { useEffect, useRef, useState } from 'react'
import type { OtherProfileResponse } from '@/shared/api'
import { useSocketSend } from '@/shared/api/socket'
import { socketManager } from '@/shared/api/socket'
import { useAuthUser } from '@/shared/providers'
import type { UseMatchFunnelReturn } from '../../../hooks'
import MatchHeader from '../../match-header'
import MatchStartProfile from '../match-start-step/match-start-profile'

const MATCHING_COMPLETE_TIME = 10 // 10초

interface MatchCompleteStepProps {
  funnel: UseMatchFunnelReturn
}

function MatchCompleteStep({ funnel }: MatchCompleteStepProps) {
  const [timeLeft, setTimeLeft] = useState(MATCHING_COMPLETE_TIME)
  const { send } = useSocketSend()
  const { authUser } = useAuthUser()
  const matchComplete = funnel.context.matchComplete
  const role = matchComplete?.role
  const matchingUuid = matchComplete?.matchingUuid
  const mainTimerRef = useRef<NodeJS.Timeout | null>(null)
  const secondaryTimerRef = useRef<NodeJS.Timeout | null>(null)
  const finalTimerRef = useRef<NodeJS.Timeout | null>(null)
  const didSendSuccessReceiverRef = useRef(false)
  const didSendSuccessFinalRef = useRef(false)

  // 공통 클린업
  const clearAllTimers = () => {
    if (mainTimerRef.current) clearInterval(mainTimerRef.current)
    if (secondaryTimerRef.current) clearTimeout(secondaryTimerRef.current)
    if (finalTimerRef.current) clearTimeout(finalTimerRef.current)
  }

  useEffect(() => {
    // 10초 카운트다운
    mainTimerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(mainTimerRef.current!)
          // Receiver: 타임아웃 시 성공 응답 전송
          if (role === 'receiver' && matchingUuid) {
            console.log(
              '⏰ [V2-Complete] Receiver 타임아웃 - matching-success-receiver 전송:',
              {
                senderMatchingUuid: matchingUuid
              }
            )
            if (!didSendSuccessReceiverRef.current) {
              didSendSuccessReceiverRef.current = true
              socketManager.send('matching-success-receiver', {
                senderMatchingUuid: matchingUuid
              })
            } else {
              console.warn(
                '⚠️ [V2-Complete] 중복 matching-success-receiver 차단'
              )
            }
            // 5초 대기 후 실패 처리
            secondaryTimerRef.current = setTimeout(() => {
              console.log(
                '⏰ [V2-Complete] Receiver 5초 타임아웃 - matching-fail 전송'
              )
              socketManager.send('matching-fail')
            }, 5000)
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Sender: 서버에서 성공 알림 수신 시 최종 성공 전송 후 3초 타이머
    const handleMatchingSuccessSender = () => {
      console.log(
        '✅ [V2-Complete] matching-success-sender 수신 - matching-success-final 전송'
      )
      if (!didSendSuccessFinalRef.current) {
        didSendSuccessFinalRef.current = true
        socketManager.send('matching-success-final')
      } else {
        console.warn('⚠️ [V2-Complete] 중복 matching-success-final 차단')
      }
      finalTimerRef.current = setTimeout(() => {
        console.log('⏰ [V2-Complete] Sender 3초 타임아웃 - matching-fail 전송')
        socketManager.send('matching-fail')
      }, 3000)
    }

    const handleMatchingSuccess = (res: any) => {
      console.log('🎉 [V2-Complete] matching-success 수신:', res)
      clearAllTimers()
      // 중복 전송 방지 키 해제 (새 매칭 허용)
      const currentUserId =
        (authUser as any)?.memberId ?? (authUser as any)?.id ?? 'unknown'
      const requestDedupKey = `matching-request-sent:${currentUserId}`
      sessionStorage.removeItem(requestDedupKey)
      // 채팅 전환 로직을 여기에서 처리 가능
    }

    const handleMatchingFail = () => {
      console.log('❌ [V2-Complete] matching-fail 수신 - 프로필로 복귀')
      clearAllTimers()
      // 중복 전송 방지 키 해제 (새 매칭 허용)
      const currentUserId =
        (authUser as any)?.memberId ?? (authUser as any)?.id ?? 'unknown'
      const requestDedupKey = `matching-request-sent:${currentUserId}`
      sessionStorage.removeItem(requestDedupKey)
      funnel.toStep('profile')
    }

    if (role === 'sender') {
      socketManager.on('matching-success-sender', handleMatchingSuccessSender)
    }
    socketManager.on('matching-success', handleMatchingSuccess)
    socketManager.on('matching-fail', handleMatchingFail)
    // 백업: raw 소켓에도 등록
    if (socketManager.socketInstance?.socket) {
      const socket = socketManager.socketInstance.socket
      if (role === 'sender') {
        socket.on('matching-success-sender', handleMatchingSuccessSender)
      }
      socket.on('matching-success', handleMatchingSuccess)
      socket.on('matching-fail', handleMatchingFail)
    }

    return () => {
      if (role === 'sender') {
        socketManager.off(
          'matching-success-sender',
          handleMatchingSuccessSender
        )
        if (socketManager.socketInstance?.socket) {
          const socket = socketManager.socketInstance.socket
          socket.off('matching-success-sender', handleMatchingSuccessSender)
        }
      }
      socketManager.off('matching-success', handleMatchingSuccess)
      socketManager.off('matching-fail', handleMatchingFail)
      if (socketManager.socketInstance?.socket) {
        const socket = socketManager.socketInstance.socket
        socket.off('matching-success', handleMatchingSuccess)
        socket.off('matching-fail', handleMatchingFail)
      }
      clearAllTimers()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, matchingUuid])

  return (
    <>
      <MatchHeader
        step="match-complete"
        title="매칭 완료"
        onBack={() => funnel.toStep('match-start')}
      />
      <div className="flex justify-center p-10 items-center h-fit gap-[59px] max-[1300px]:flex-col max-[1300px]:gap-[40px]">
        <MatchStartProfile user={authUser} />
        <MatchStartProfile
          user={matchComplete?.opponent as Partial<OtherProfileResponse>}
          opponent
        />
      </div>
    </>
  )
}

export default MatchCompleteStep
