import { Link } from '@cloudscape-design/components';
import React from 'react';
import '../index.scss';

export const CounterLink = ({ children }: any) => {
  return (
    <Link variant="awsui-value-large" className="no-link">
      {children}
    </Link>
  );
};
