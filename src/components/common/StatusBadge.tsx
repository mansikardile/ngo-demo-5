import React from 'react';
import { Badge } from '../ui/Badge';
import { ProgramStatus, RegistrationStatus, VolunteerStatus } from '../../types';

export interface StatusBadgeProps {
  status: ProgramStatus | RegistrationStatus | VolunteerStatus | string;
  type?: 'program' | 'registration' | 'volunteer';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  let variant: 'emerald' | 'indigo' | 'amber' | 'sky' | 'rose' | 'slate' | 'purple' | 'blue' = 'slate';
  let label = status;

  switch (status) {
    // Program Statuses
    case 'ACTIVE':
      variant = 'emerald';
      label = 'Active';
      break;
    case 'UPCOMING':
      variant = 'indigo';
      label = 'Upcoming';
      break;
    case 'COMPLETED':
      variant = 'emerald';
      label = 'Completed';
      break;
    case 'DRAFT':
      variant = 'amber';
      label = 'Draft';
      break;
    case 'CANCELLED':
      variant = 'rose';
      label = 'Cancelled';
      break;

    // Registration Statuses
    case 'REGISTERED':
      variant = 'indigo';
      label = 'Registered';
      break;
    case 'ATTENDED':
      variant = 'amber';
      label = 'Attended';
      break;
    case 'PARTICIPATED':
      variant = 'purple';
      label = 'Participated';
      break;

    // Volunteer Statuses
    case 'ASSIGNED':
      variant = 'blue';
      label = 'Assigned';
      break;

    default:
      variant = 'slate';
      break;
  }

  return (
    <Badge variant={variant} className={className}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current inline-block opacity-80" />
      {label}
    </Badge>
  );
};
