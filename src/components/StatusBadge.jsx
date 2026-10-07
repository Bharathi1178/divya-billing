import React from 'react';

export default function StatusBadge({ status }) {
  const normalized = (status || 'Draft').toLowerCase();

  let badgeClass = 'status-draft';
  if (normalized === 'quotation') badgeClass = 'status-quotation';
  else if (normalized === 'approved') badgeClass = 'status-approved';
  else if (normalized === 'completed') badgeClass = 'status-completed';
  else if (normalized === 'cancelled') badgeClass = 'status-cancelled';

  return (
    <span className={`status-badge ${badgeClass}`}>
      {status || 'Draft'}
    </span>
  );
}
