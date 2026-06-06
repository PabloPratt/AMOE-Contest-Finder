export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function daysUntilExpiry(endDate: string | Date): number {
  const end = new Date(endDate);
  const now = new Date();
  return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

export function generateContestId(): string {
  return `contest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function isExpiringSoon(endDate: string | Date, days: number = 7): boolean {
  return daysUntilExpiry(endDate) <= days;
}

export function isExpired(endDate: string | Date): boolean {
  return daysUntilExpiry(endDate) < 0;
}
