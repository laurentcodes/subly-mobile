import { Text } from 'react-native';
import { Card } from 'heroui-native';

const DEFAULT_ACCENT_CLASSES: Record<string, string> = {
  active: 'text-success',
  paused: 'text-warning',
  cancelled: 'text-danger',
  expired: 'text-foreground/60',
};

export const SummaryCard = ({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: 'active' | 'paused' | 'canceled' | 'expired' | string;
}) => {
  const accentClass = accent
    ? DEFAULT_ACCENT_CLASSES[accent] || accent
    : 'text-foreground';

  return (
    <Card className='px-3 py-3 border-0 flex-1'>
      <Text className='text-foreground/60 text-xs mb-1'>{label}</Text>

      <Text className={`text-xl font-semibold ${accentClass}`}>
        {typeof value === 'number' ? value.toString() : value}
      </Text>
    </Card>
  );
};

export default SummaryCard;
