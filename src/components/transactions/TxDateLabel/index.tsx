import type { DateLabel, SafeMessageDateLabel } from '@neonlabs-devops/gnosis-neon-gateway-typescript-sdk'
import type { ReactElement } from 'react'

import { formatWithSchema } from '@/utils/date'

import css from './styles.module.css'

const TxDateLabel = ({ item }: { item: DateLabel | SafeMessageDateLabel }): ReactElement => {
  return (
    <div className={css.container}>
      <span>{formatWithSchema(item.timestamp, 'MMM d, yyyy')}</span>
    </div>
  )
}

export default TxDateLabel
