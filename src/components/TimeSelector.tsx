
import React from 'react';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

export interface TimeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const timeOptions = [
  'Без оценки',
  '5 мин',
  '10 мин',
  '15 мин',
  '30 мин',
  '45 мин',
  '1 ч',
  '1.5 ч',
  '2 ч',
  '3 ч',
  '4 ч',
  '5 ч',
  '8 ч',
  '1 день',
  '2 дня',
  '3 дня',
  '1 неделя',
  '2 недели',
  '1 месяц',
];

export const TimeSelector = ({ value, onChange }: TimeSelectorProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full h-9 text-style-p-m bg-fill-prim border-brd-prim focus:ring-0 focus:ring-offset-0">
        <SelectValue placeholder="Без оценки" />
      </SelectTrigger>
      <SelectContent>
        {timeOptions.map((option) => (
          <SelectItem key={option} value={option} className="text-style-p-m">
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TimeSelector;