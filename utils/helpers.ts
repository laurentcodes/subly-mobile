export const getInitials = (name: string) => {
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

export const formatNumber = (value: number | string | undefined): string => {
  if (value === undefined || value === null) {
    return '0.00';
  }

  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return '0.00';
  }

  // Manual formatting for better cross-platform compatibility
  const parts = numValue.toFixed(2).split('.');
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return `${integerPart}.${parts[1]}`;
};

export const formatCurrency = (value: number | string): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue) || numValue === null || numValue === undefined) {
    return '0.00';
  }

  const formatted = new Intl.NumberFormat('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numValue);

  return formatted;
};

export const formatCompactCurrency = (value: number | string): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  // Handle edge cases
  if (isNaN(numValue) || numValue === 0) {
    return '₦0';
  }

  const absValue = Math.abs(numValue);
  const sign = numValue < 0 ? '-' : '';

  // Define thresholds and suffixes
  if (absValue >= 1000000000) {
    const formatted = (absValue / 1000000000).toFixed(1);
    return `${sign}₦${formatted.replace('.0', '')}B`;
  } else if (absValue >= 1000000) {
    const formatted = (absValue / 1000000).toFixed(1);
    return `${sign}₦${formatted.replace('.0', '')}M`;
  } else if (absValue >= 1000) {
    const formatted = (absValue / 1000).toFixed(1);
    return `${sign}₦${formatted.replace('.0', '')}K`;
  } else {
    return `${sign}₦${absValue.toFixed(0)}`;
  }
};

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
    .toString()
    .padStart(2, '0')}`;
};
