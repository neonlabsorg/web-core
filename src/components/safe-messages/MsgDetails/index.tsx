import { Accordion, AccordionSummary, Typography, AccordionDetails, Box } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CodeIcon from '@mui/icons-material/Code'
import classNames from 'classnames'
import { SafeMessageStatus } from '@safe-global/safe-gateway-typescript-sdk'
import { useMemo } from 'react'
import type { SafeMessage } from '@safe-global/safe-gateway-typescript-sdk'
import type { ReactElement } from 'react'

import { formatDateTime } from '@/utils/date'
import EthHashInfo from '@/components/common/EthHashInfo'
import { InfoDetails } from '@/components/transactions/InfoDetails'
import { generateDataRowValue, TxDataRow } from '@/components/transactions/TxDetails/Summary/TxDataRow'
import MsgSigners from '@/components/safe-messages/MsgSigners'
import useWallet from '@/hooks/wallets/useWallet'
import SignMsgButton from '@/components/safe-messages/SignMsgButton'
import useIsWrongChain from '@/hooks/useIsWrongChain'
import Msg from '@/components/safe-messages/Msg'
import { generateSafeMessageMessage } from '@/utils/safe-messages'

import txDetailsCss from '@/components/transactions/TxDetails/styles.module.css'
import singleTxDecodedCss from '@/components/transactions/TxDetails/TxData/DecodedData/SingleTxDecoded/styles.module.css'
import infoDetailsCss from '@/components/transactions/InfoDetails/styles.module.css'

const MsgDetails = ({ msg }: { msg: SafeMessage }): ReactElement => {
  const wallet = useWallet()
  const isWrongChain = useIsWrongChain()
  const isConfirmed = msg.status === SafeMessageStatus.CONFIRMED
  const safeMessage = useMemo(() => {
    return generateSafeMessageMessage(msg.message)
  }, [msg.message])

  return (
    <div className={txDetailsCss.container}>
      <div className={txDetailsCss.details}>
        <div className={txDetailsCss.txData}>
          <InfoDetails title="Created by:">
            <EthHashInfo
              address={msg.proposedBy.value || ''}
              name={msg.proposedBy.name}
              customAvatar={msg.proposedBy.logoUri}
              shortAddress={false}
              showCopyButton
              hasExplorer
            />
          </InfoDetails>
        </div>

        <div className={txDetailsCss.txSummary}>
          <TxDataRow title="Created:">{formatDateTime(msg.creationTimestamp)}</TxDataRow>
          <TxDataRow title="Last modified:">{formatDateTime(msg.modifiedTimestamp)}</TxDataRow>
          <TxDataRow title="Message hash:">{generateDataRowValue(msg.messageHash, 'hash')}</TxDataRow>
          <TxDataRow title="SafeMessage:">{generateDataRowValue(safeMessage, 'hash')}</TxDataRow>
          <TxDataRow title="Message:">
            <Msg message={msg.message} defaultExpanded />
          </TxDataRow>
        </div>

        {msg.preparedSignature && (
          <div className={classNames(txDetailsCss.txSummary, txDetailsCss.multiSend)}>
            <TxDataRow title="Prepared signature:">{generateDataRowValue(msg.preparedSignature, 'hash')}</TxDataRow>
          </div>
        )}

        <div className={txDetailsCss.multiSend}>
          {msg.confirmations.map((confirmation, i) => (
            <Accordion
              variant="elevation"
              key={confirmation.signature}
              defaultExpanded={confirmation.owner.value === wallet?.address}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <div className={singleTxDecodedCss.summary}>
                  <CodeIcon />
                  <Typography>{`Confirmation ${i + 1}`}</Typography>
                </div>
              </AccordionSummary>

              <AccordionDetails>
                <div className={infoDetailsCss.container}>
                  <EthHashInfo
                    address={confirmation.owner.value || ''}
                    name={confirmation.owner.name}
                    customAvatar={confirmation.owner.logoUri}
                    shortAddress={false}
                    showCopyButton
                    hasExplorer
                  />
                </div>
                <TxDataRow title="Signature:">
                  <EthHashInfo address={confirmation.signature} showAvatar={false} showCopyButton />
                </TxDataRow>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </div>
      <div className={txDetailsCss.txSigners}>
        <MsgSigners msg={msg} />
        {wallet && !isWrongChain && !isConfirmed && (
          <Box display="flex" alignItems="center" justifyContent="center" gap={1} mt={2}>
            <SignMsgButton msg={msg} />
          </Box>
        )}
      </div>
    </div>
  )
}

export default MsgDetails