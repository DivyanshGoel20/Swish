// // src/lib/coreTestnet.ts
// import { defineChain } from 'viem'

// export const coreTestnet2 = defineChain({
//   id: 1114,
//   name: 'Core Testnet 2',
//   nativeCurrency: {
//     name: 'Core',
//     symbol: 'tCORE2',
//     decimals: 18,
//   },
//   rpcUrls: {
//     default: { http: ['https://rpc.test2.btcs.network'] },
//     public: { http: ['https://rpc.test2.btcs.network'] },
//   },
//   blockExplorers: {
//     default: {
//       name: 'Core Explorer',
//       url: 'https://scan.test2.btcs.network',
//     },
//   },
//   testnet: true,
// })