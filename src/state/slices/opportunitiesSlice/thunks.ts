import type { StartQueryActionCreatorOptions } from '@reduxjs/toolkit/dist/query/core/buildInitiate'
import type { AccountId, ChainId } from '@shapeshiftoss/caip'
import { fromAccountId } from '@shapeshiftoss/caip'
import { store } from 'state/store'

import { furyEthStakingIds } from '../opportunitiesSlice/constants'
import { CHAIN_ID_TO_SUPPORTED_DEFI_OPPORTUNITIES } from './mappings'
import { opportunitiesApi } from './opportunitiesApiSlice'
import { DefiProvider, DefiType } from './types'

export const fetchAllLpOpportunitiesMetadataByChainId = async (
  chainId: ChainId,
  options?: StartQueryActionCreatorOptions,
) => {
  const { getOpportunitiesMetadata } = opportunitiesApi.endpoints

  const queries = CHAIN_ID_TO_SUPPORTED_DEFI_OPPORTUNITIES[chainId]

  await Promise.allSettled(
    queries
      .filter(query => query.defiType === DefiType.LiquidityPool)
      .map(query =>
        store.dispatch(
          getOpportunitiesMetadata.initiate(
            {
              defiType: query.defiType,
              defiProvider: query.defiProvider,
            },
            // Any previous query without portfolio loaded will be rejected, the first successful one will be cached
            { forceRefetch: false, ...options },
          ),
        ),
      ),
  )
}

export const fetchAllStakingOpportunitiesMetadataByChainId = async (
  chainId: ChainId,
  options?: StartQueryActionCreatorOptions,
) => {
  const { getOpportunitiesMetadata, getOpportunityMetadata } = opportunitiesApi.endpoints

  const queries = CHAIN_ID_TO_SUPPORTED_DEFI_OPPORTUNITIES[chainId]

  const ethFuryStakingQueries = furyEthStakingIds.map(opportunityId =>
    store.dispatch(
      getOpportunityMetadata.initiate(
        {
          opportunityId,
          defiType: DefiType.Staking,
          defiProvider: DefiProvider.EthFuryStaking,
        },
        // Any previous query without portfolio loaded will be rejected, the first successful one will be cached
        { forceRefetch: false, ...options },
      ),
    ),
  )
  await Promise.allSettled(
    queries
      .filter(query => query.defiType === DefiType.Staking)
      .map(query =>
        store.dispatch(
          getOpportunitiesMetadata.initiate(
            {
              defiType: query.defiType,
              defiProvider: query.defiProvider,
            },
            // Any previous query without portfolio loaded will be rejected, the first successful one will be cached
            { forceRefetch: false, ...options },
          ),
        ),
      )
      .concat(ethFuryStakingQueries),
  )
}

export const fetchAllOpportunitiesIdsByChainId = async (
  chainId: ChainId,
  options?: StartQueryActionCreatorOptions,
) => {
  const { getOpportunityIds } = opportunitiesApi.endpoints

  const queries = CHAIN_ID_TO_SUPPORTED_DEFI_OPPORTUNITIES[chainId]

  for (const query of queries) {
    await store.dispatch(getOpportunityIds.initiate(query, options))
  }

  return
}

export const fetchAllOpportunitiesMetadataByChainId = async (
  chainId: ChainId,
  options?: StartQueryActionCreatorOptions,
) => {
  // Don't Promise.all() me - parallel execution would be better, but the market data of the LP tokens gets populated when fetching LP opportunities
  // Without it, we won't have all we need to populate the staking one - which is relying on the market data of the staked LP token for EVM chains LP token farming
  await fetchAllLpOpportunitiesMetadataByChainId(chainId, options)
  await fetchAllStakingOpportunitiesMetadataByChainId(chainId, options)
}

export const fetchAllStakingOpportunitiesUserDataByAccountId = async (
  accountId: AccountId,
  options?: StartQueryActionCreatorOptions,
) => {
  const { getOpportunitiesUserData, getOpportunityUserData } = opportunitiesApi.endpoints

  const chainId = fromAccountId(accountId).chainId
  const queries = CHAIN_ID_TO_SUPPORTED_DEFI_OPPORTUNITIES[chainId]

  const ethFuryStakingQueries = furyEthStakingIds.map(opportunityId =>
    store.dispatch(
      getOpportunityUserData.initiate(
        {
          accountId,
          opportunityId,
          defiType: DefiType.Staking,
          defiProvider: DefiProvider.EthFuryStaking,
        },
        // Any previous query without portfolio loaded will be rejected, the first successful one will be cached
        { forceRefetch: false, ...options },
      ),
    ),
  )

  await Promise.allSettled(
    queries
      .filter(query => query.defiType === DefiType.Staking)
      .map(query =>
        store.dispatch(
          getOpportunitiesUserData.initiate(
            {
              accountId,
              defiType: query.defiType,
              defiProvider: query.defiProvider,
            },
            // Any previous query without portfolio loaded will be rejected, the first successful one will be cached
            { forceRefetch: false, ...options },
          ),
        ),
      )
      .concat(ethFuryStakingQueries),
  )
}

export const fetchAllLpOpportunitiesUserdataByAccountId = (
  _accountId: AccountId,
  _options?: StartQueryActionCreatorOptions,
  // User data for all our current LP opportunities is held as a portfolio balance, there's no need to fetch it
) => Promise.resolve()

export const fetchAllOpportunitiesUserDataByAccountId = (
  accountId: AccountId,
  options?: StartQueryActionCreatorOptions,
) =>
  Promise.allSettled([
    fetchAllLpOpportunitiesUserdataByAccountId(accountId, options),
    fetchAllStakingOpportunitiesUserDataByAccountId(accountId, options),
  ])
