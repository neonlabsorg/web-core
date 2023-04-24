import { SafeMessageListItemType } from '@neonlabs-devops/gnosis-neon-gateway-typescript-sdk'
import type { SafeMessageListItem, SafeMessage, SafeMessageDateLabel } from '@neonlabs-devops/gnosis-neon-gateway-typescript-sdk'

export const isSafeMessageListDateLabel = (item: SafeMessageListItem): item is SafeMessageDateLabel => {
  return item.type === SafeMessageListItemType.DATE_LABEL
}

export const isSafeMessageListItem = (item: SafeMessageListItem): item is SafeMessage => {
  return item.type === SafeMessageListItemType.MESSAGE
}
