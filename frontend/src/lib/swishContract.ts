export const CONTRACT_ADDRESS = '0x813dca1Bf5B9012c6fAf16b449AaD1d3ff513Dc9';

export const CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "uint256", "name": "puzzleId", "type": "uint256" },
      { "internalType": "string", "name": "userAnswer", "type": "string" }
    ],
    "name": "submitAnswer",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "user", "type": "address" },
      { "internalType": "uint256", "name": "puzzleId", "type": "uint256" }
    ],
    "name": "checkSolved",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  }
];
