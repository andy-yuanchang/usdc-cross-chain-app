import type { SupportedChains } from '@/types/wallet'
import type { Address } from 'viem'

export const USDC_CONTRACT_ADDRESS_MAP: Record<SupportedChains, Address> = {
  Sepolia: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
  'Avalanche Fuji': '0x5425890298aed601595a70ab815c96711a31bc65',
  'OP Sepolia': '0x5fd84259d66Cd46123540766Be93DFE6D43130D7',
  'Arbitrum Sepolia': '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d',
  'Base Sepolia': '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
  'Polygon Amoy': '0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582',
  // TODO: temporary address, extra 0x prefix
  'Solana Testnet': '0x4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'
}

export const TOKEN_MESSENGER_ADDRESS_MAP: Record<SupportedChains, Address> = {
  Sepolia: '0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5',
  'Avalanche Fuji': '0xeb08f243e5d3fcff26a9e38ae5520a669f4019d0',
  'OP Sepolia': '0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5',
  'Arbitrum Sepolia': '0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5',
  'Base Sepolia': '0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5',
  'Polygon Amoy': '0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5',
  // TODO: temporary address
  'Solana Testnet': '0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5'
}

export const MESSAGE_TRANSMITTER_ADDRESS_MAP: Record<SupportedChains, Address> =
  {
    Sepolia: '0x7865fAfC2db2093669d92c0F33AeEF291086BEFD',
    'Avalanche Fuji': '0xa9fb1b3009dcb79e2fe346c16a604b8fa8ae0a79',
    'OP Sepolia': '0x7865fAfC2db2093669d92c0F33AeEF291086BEFD',
    'Arbitrum Sepolia': '0xaCF1ceeF35caAc005e15888dDb8A3515C41B4872',
    'Base Sepolia': '0x7865fAfC2db2093669d92c0F33AeEF291086BEFD',
    'Polygon Amoy': '0x7865fAfC2db2093669d92c0F33AeEF291086BEFD',
    // TODO: temporary address
    'Solana Testnet': '0x7865fAfC2db2093669d92c0F33AeEF291086BEFD'
  }
