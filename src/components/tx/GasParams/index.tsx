import type { ReactElement, SyntheticEvent } from 'react'
import { Accordion, AccordionDetails, AccordionSummary, Skeleton, Typography, Link, Grid } from '@mui/material'
import { useCurrentChain } from '@/hooks/useChains'
import { formatVisualAmount } from '@/utils/formatters'
import { type AdvancedParameters } from '../AdvancedParams/types'
import { trackEvent, MODALS_EVENTS } from '@/services/analytics'

const GasDetail = ({ name, value, isLoading }: { name: string; value: string; isLoading: boolean }): ReactElement => {
  const valueSkeleton = <Skeleton variant="text" sx={{ minWidth: '5em' }} />
  return (
    <Grid container>
      <Grid item xs>
        {name}
      </Grid>
      <Grid item>{value || (isLoading ? valueSkeleton : '-')}</Grid>
    </Grid>
  )
}

type GasParamsProps = {
  params: AdvancedParameters
  isExecution: boolean
  isEIP1559: boolean
  onEdit: () => void
  gasLimitError?: Error
}

const GasParams = ({ params, isExecution, isEIP1559, onEdit, gasLimitError }: GasParamsProps): ReactElement => {
  const { nonce, userNonce, safeTxGas, gasLimit, maxFeePerGas, maxPriorityFeePerGas } = params

  const onChangeExpand = (_: SyntheticEvent, expanded: boolean) => {
    trackEvent({ ...MODALS_EVENTS.ESTIMATION, label: expanded ? 'Open' : 'Close' })
  }

  const chain = useCurrentChain()
  const isLoading = !gasLimit || !maxFeePerGas

  // Total gas cost
  const totalFee = !isLoading
    ? formatVisualAmount(maxFeePerGas.mul(gasLimit), chain?.nativeCurrency.decimals)
    : '> 0.001'

  // Individual gas params
  const gasLimitString = gasLimit?.toString() || ''
  const maxFeePerGasGwei = maxFeePerGas ? formatVisualAmount(maxFeePerGas) : ''
  const maxPrioGasGwei = maxPriorityFeePerGas ? formatVisualAmount(maxPriorityFeePerGas) : ''

  const onEditClick = (e: SyntheticEvent) => {
    e.preventDefault()
    onEdit()
  }

  return (
    <Accordion elevation={0} onChange={onChangeExpand} sx={nonce === undefined ? { pointerEvents: 'none' } : undefined}>
      <AccordionSummary>
        {isExecution ? (
          <Typography display="flex" alignItems="center" justifyContent="space-between" width={1}>
            <span>Estimated fee </span>
            {gasLimitError ? null : isLoading ? (
              <Skeleton variant="text" sx={{ display: 'inline-block', minWidth: '7em' }} />
            ) : (
              <span>
                {totalFee} {chain?.nativeCurrency.symbol}
              </span>
            )}
          </Typography>
        ) : (
          <Typography>
            Transaction nonce: &nbsp;
            {nonce !== undefined ? (
              nonce
            ) : (
              <Skeleton variant="text" sx={{ display: 'inline-block', minWidth: '2em' }} />
            )}
          </Typography>
        )}
      </AccordionSummary>

      <AccordionDetails>
        {nonce !== undefined && <GasDetail isLoading={false} name="Safe transaction nonce" value={nonce.toString()} />}

        {!!safeTxGas && <GasDetail isLoading={false} name="safeTxGas" value={safeTxGas.toString()} />}

        {isExecution && (
          <>
            {userNonce !== undefined && (
              <GasDetail isLoading={false} name="Wallet nonce" value={userNonce.toString()} />
            )}

            <GasDetail
              isLoading={isLoading}
              name="Gas limit"
              value={gasLimitError ? 'Cannot estimate' : gasLimitString}
            />

            {isEIP1559 ? (
              <>
                <GasDetail isLoading={isLoading} name="Max priority fee (Gwei)" value={maxPrioGasGwei} />
                <GasDetail isLoading={isLoading} name="Max fee (Gwei)" value={maxFeePerGasGwei} />
              </>
            ) : (
              <GasDetail isLoading={isLoading} name="Gas price (Gwei)" value={maxFeePerGasGwei} />
            )}
          </>
        )}

        {gasLimitError || !isExecution || (isExecution && !isLoading) ? (
          <Link component="button" onClick={onEditClick} sx={{ mt: 2 }} fontSize="medium">
            Edit
          </Link>
        ) : (
          <Skeleton variant="text" sx={{ display: 'inline-block', minWidth: '2em', mt: 2 }} />
        )}
      </AccordionDetails>
    </Accordion>
  )
}

export default GasParams
