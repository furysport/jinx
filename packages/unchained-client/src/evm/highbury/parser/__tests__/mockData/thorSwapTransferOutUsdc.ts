import { THOR_ROUTER_CONTRACT_ETH_MAINNET } from '../../constants'

export default {
  tx: {
    txid: '0x21c32222d4a9e2a876cdf5b2548b5186d6ac871028e3497525a44d99743aae7d',
    blockHash: '0x5a0166d56b77e5a8167d8c7fe083173ddf226a65176cdd529a4baa922812affb',
    blockHeight: 12478650,
    timestamp: 1621613233,
    status: 1,
    from: '0x2Ab5a16737bd4449Cc5c096598b3D2e32add0EF0',
    to: THOR_ROUTER_CONTRACT_ETH_MAINNET,
    confirmations: 2334656,
    value: '0',
    fee: '37199999999936725',
    gasLimit: '82915',
    gasUsed: '82915',
    gasPrice: '448652234215',
    inputData:
      '0x574da7170000000000000000000000005a8c5afbcc1a58ccbe17542957b587f46828b38e000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb480000000000000000000000000000000000000000000000000000000b14f88558000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000444f55543a4633414334453930414235393531414239464542313731354234383134323242393034413430423046363735334343383434453332364231323133434637304500000000000000000000000000000000000000000000000000000000',
    tokenTransfers: [
      {
        contract: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        decimals: 6,
        name: 'USD Coin',
        symbol: 'USDC',
        type: 'ERC20',
        from: THOR_ROUTER_CONTRACT_ETH_MAINNET,
        to: '0x5a8C5afbCC1A58cCbe17542957b587F46828B38E',
        value: '47596471640',
      },
    ],
  },
}
