// components
import { Chip } from 'heroui-native';

export const StatusBadge = ({ status }: { status?: string | null }) => {
  const getStatusColor = (
    status?: string | null,
  ): 'success' | 'warning' | 'danger' | 'default' => {
    switch (status) {
      case 'active':
        return 'success';
      case 'paused':
        return 'warning';
      case 'cancelled':
      case 'expired':
        return 'danger';
      default:
        return 'default';
    }
  };

  const color = getStatusColor(status);

  return (
    <Chip size='sm' color={color}>
      {status || '-'}
    </Chip>
  );
};

export default StatusBadge;
