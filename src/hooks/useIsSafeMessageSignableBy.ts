import type { SafeMessage } from '@neonlabs-devops/gnosis-neon-gateway-typescript-sdk'

import useIsSafeOwner from '@/hooks/useIsSafeOwner'

const useIsSafeMessageSignableBy = (message: SafeMessage, walletAddress: string): boolean => {
  const isSafeOwner = useIsSafeOwner()
  return isSafeOwner && message.confirmations.every(({ owner }) => owner.value !== walletAddress)
}

export default useIsSafeMessageSignableBy
