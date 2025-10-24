const TOKEN_DECIMALS = 6n;
const DECIMAL_FACTOR = 10n ** TOKEN_DECIMALS;

function isValidAmountFormat(value: string) {
  return /^\d+(\.\d{0,6})?$/.test(value);
}

export function parsePayrollAmount(value: string): bigint {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error('Amount is required');
  }

  if (!isValidAmountFormat(trimmed)) {
    throw new Error('Use up to 6 decimal places');
  }

  const [wholePart, fractionalPart = ''] = trimmed.split('.');
  const paddedFraction = (fractionalPart + '000000').slice(0, 6);

  const whole = BigInt(wholePart);
  const fraction = BigInt(paddedFraction);

  return whole * DECIMAL_FACTOR + fraction;
}

export function formatPayrollAmount(value: bigint): string {
  const isNegative = value < 0n;
  const absoluteValue = isNegative ? -value : value;

  const whole = absoluteValue / DECIMAL_FACTOR;
  const fraction = absoluteValue % DECIMAL_FACTOR;

  if (fraction === 0n) {
    return `${isNegative ? '-' : ''}${whole.toString()}`;
  }

  const fractionStr = fraction.toString().padStart(Number(TOKEN_DECIMALS), '0').replace(/0+$/, '');
  return `${isNegative ? '-' : ''}${whole.toString()}.${fractionStr}`;
}

export function formatTimestamp(seconds: bigint): string {
  const timestamp = Number(seconds) * 1000;
  if (Number.isNaN(timestamp) || !Number.isFinite(timestamp)) {
    return 'Unknown';
  }

  const date = new Date(timestamp);
  return date.toLocaleString();
}
