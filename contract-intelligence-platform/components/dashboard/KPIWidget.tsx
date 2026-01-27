
import React from 'react';
import { Card } from '../ui/Card';

interface KPIWidgetProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  note?: string;
}

export const KPIWidget: React.FC<KPIWidgetProps> = ({ title, value, icon, note }) => {
  return (
    <Card className="flex items-center">
      <div className="flex-shrink-0">{icon}</div>
      <div className="ml-4">
        <p className="text-sm font-medium text-brand-light truncate">{title}</p>
        <p className="text-3xl font-bold text-brand-text">{value}</p>
        {note && <p className="text-xs text-brand-light">{note}</p>}
      </div>
    </Card>
  );
};