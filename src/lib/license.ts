import { nanoid } from 'nanoid';

export function generateLicenseKey(): string {
  const timestamp = Date.now().toString();
  const random = nanoid(8);
  return `LICENSE-${random}-${timestamp.substring(timestamp.length - 4)}`;
}

export function validateLicenseKey(key: string): boolean {
  return /^LICENSE-[A-Za-z0-9]{8}-\d{4}$/.test(key);
}

export function isLicenseExpired(expiresAt: string): boolean {
  return new Date(expiresAt) < new Date();
}

export function generateExpirationDate(durationInDays: number = 365): string {
  const date = new Date();
  date.setDate(date.getDate() + durationInDays);
  return date.toISOString();
}