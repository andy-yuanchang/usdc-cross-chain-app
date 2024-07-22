/**
 * TODO: Generalize all erros in the file
 */

export class WalletConnectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WalletConnectionError';
  }
}

export class WalletSwitchChainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WalletSwitchChainError';
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class UnexpectedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnexpectedError';
  }
}