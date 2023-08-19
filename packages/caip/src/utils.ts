import type { AccountId } from './accountId/accountId'
import { fromAccountId } from './accountId/accountId'
import type { AssetId } from './assetId/assetId'
import { toAssetId } from './assetId/assetId'
import type { ChainId, ChainNamespace, ChainReference } from './chainId/chainId'
import * as constants from './constants'

export const accountIdToChainId = (accountId: AccountId): ChainId =>
  fromAccountId(accountId).chainId

export const accountIdToSpecifier = (accountId: AccountId): string =>
  fromAccountId(accountId).account

export const isValidChainPartsPair = (
  chainNamespace: ChainNamespace,
  chainReference: ChainReference,
) => constants.VALID_CHAIN_IDS[chainNamespace]?.includes(chainReference) || false

export const generateAssetIdFromOsmosisDenom = (denom: string): AssetId => {
  if (denom.startsWith('u') && denom !== 'uosmo') {
    return toAssetId({
      assetNamespace: constants.ASSET_NAMESPACE.native,
      assetReference: denom,
      chainId: constants.osmosisChainId,
    })
  }

  if (denom.startsWith('ibc')) {
    return toAssetId({
      assetNamespace: constants.ASSET_NAMESPACE.ibc,
      assetReference: denom.split('/')[1],
      chainId: constants.osmosisChainId,
    })
  }

  if (denom.startsWith('gamm')) {
    return toAssetId({
      assetNamespace: constants.ASSET_NAMESPACE.ibc,
      assetReference: denom,
      chainId: constants.osmosisChainId,
    })
  }

  return toAssetId({
    assetNamespace: constants.ASSET_NAMESPACE.slip44,
    assetReference: constants.ASSET_REFERENCE.Osmosis,
    chainId: constants.osmosisChainId,
  })
}

export const bitcoinAssetMap = { [constants.btcAssetId]: 'bitcoin' }
export const bitcoinCashAssetMap = { [constants.bchAssetId]: 'bitcoin-cash' }
export const dogecoinAssetMap = { [constants.dogeAssetId]: 'dogecoin' }
export const highburyAssetMap = { [constants.highburyAssetId]: 'highbury' }
export const litecoinAssetMap = { [constants.ltcAssetId]: 'litecoin' }
export const cosmosAssetMap = { [constants.cosmosAssetId]: 'cosmos' }
export const merlinsAssetMap = { [constants.merlinsAssetId]: 'merlins' }
export const osmosisAssetMap = { [constants.osmosisAssetId]: 'osmosis' }
export const thorchainAssetMap = { [constants.thorchainAssetId]: 'thorchain' }

interface Flavoring<FlavorT> {
  _type?: FlavorT
}

export type Nominal<T, FlavorT> = T & Flavoring<FlavorT>
