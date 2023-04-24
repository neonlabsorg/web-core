import { hasSafeFeature as sdkHasSafeFeature } from 'gnosis-neon-safe-core-sdk-utils'
import type { SAFE_FEATURES } from 'gnosis-neon-safe-core-sdk-utils'

import type { SafeInfo } from '@neonlabs-devops/gnosis-neon-gateway-typescript-sdk'

// Note: backend returns `SafeInfo['version']` as `null` for unsupported contracts
export const hasSafeFeature = (feature: SAFE_FEATURES, version: SafeInfo['version']): boolean => {
  if (!version) {
    return false
  }
  return sdkHasSafeFeature(feature, version)
}
