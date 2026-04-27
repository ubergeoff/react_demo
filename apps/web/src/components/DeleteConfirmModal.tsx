interface Props {
  bookingReference: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmModal({ bookingReference, onConfirm, onCancel }: Props) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal modal--confirm" onClick={(e) => e.stopPropagation()}>
        <h2>Delete Booking</h2>
        <p className="modal-confirm__message">
          Are you sure you want to delete booking <strong>{bookingReference}</strong>? This action
          cannot be undone.
        </p>
        <div className="form-actions">
          <button type="button" className="btn btn--secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="btn btn--danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
