import { BookingStatus } from '@flight-booking/models';

const colours: Record<BookingStatus, string> = {
  [BookingStatus.CONFIRMED]: '#16a34a',
  [BookingStatus.PENDING]: '#ca8a04',
  [BookingStatus.CANCELLED]: '#dc2626',
};

export function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span
      style={{
        background: colours[status],
        color: '#fff',
        borderRadius: 4,
        padding: '2px 10px',
        fontSize: 12,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: 1,
      }}
    >
      {status}
    </span>
  );
}
