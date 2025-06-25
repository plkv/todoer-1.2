import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement> & { color?: string };

export const IconPlus: React.FC<IconProps> = (props) => <svg {...props} />;
export const IconSettings: React.FC<IconProps> = (props) => <svg {...props} />;
export const IconInbox: React.FC<IconProps> = (props) => <svg {...props} />;
export const IconCheck: React.FC<IconProps> = (props) => <svg {...props} />;
export const IconChevronLeft: React.FC<IconProps> = (props) => <svg {...props} />;
export const IconChevronRight: React.FC<IconProps> = (props) => <svg {...props} />;
export const IconCalendar: React.FC<IconProps> = (props) => <svg {...props} />;
export const IconUser: React.FC<IconProps> = (props) => <svg {...props} />;
export const IconLogout: React.FC<IconProps> = (props) => <svg {...props} />;
export const IconEdit: React.FC<IconProps> = (props) => <svg {...props} />;
export const IconTrash: React.FC<IconProps> = (props) => <svg {...props} />;
export const IconSearch: React.FC<IconProps> = (props) => <svg {...props} />;
export const IconFilter: React.FC<IconProps> = (props) => <svg {...props} />;
export const IconSort: React.FC<IconProps> = (props) => <svg {...props} />;
export const IconTag: React.FC<IconProps> = (props) => <svg {...props} />;
export const IconMoney: React.FC<IconProps> = (props) => <svg {...props} />;
export const IconCalendarDay: React.FC<IconProps> = (props) => <svg {...props} />;
export const IconCalendarWeek: React.FC<IconProps> = (props) => <svg {...props} />;
export const IconCalendarMonth: React.FC<IconProps> = (props) => <svg {...props} />;
export const IconArrowMove: React.FC<IconProps> = (props) => <svg {...props} />;
export const IconNotification: React.FC<IconProps> = (props) => <svg {...props} />;
export const IconEye: React.FC<IconProps> = (props) => <svg {...props} />;
export const IconEyeOff: React.FC<IconProps> = (props) => <svg {...props} />;
export const IconDots: React.FC<IconProps> = (props) => <svg {...props} />;
export const IconStar: React.FC<IconProps> = (props) => <svg {...props} />;
export const IconLock: React.FC<IconProps> = (props) => <svg {...props} />;
export const IconAttachment: React.FC<IconProps> = (props) => <svg {...props} />;
export const IconComment: React.FC<IconProps> = (props) => <svg {...props} />;
export const IconRepeat: React.FC<IconProps> = (props) => <svg {...props} />;
export const Icon00: React.FC<IconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <path
      d="M21.25 12C21.25 17.1086 17.1086 21.25 12 21.25C6.89137 21.25 2.75 17.1086 2.75 12C2.75 6.89137 6.89137 2.75 12 2.75C17.1086 2.75 21.25 6.89137 21.25 12Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="3 4"
    />
  </svg>
);

export const IconChevronDown: React.FC<IconProps> = (props) => <Icon00 {...props} />;
export const IconChevronUp: React.FC<IconProps> = (props) => <Icon00 {...props} />;
export const IconCircle: React.FC<IconProps> = (props) => <Icon00 {...props} />;
export const IconDot: React.FC<IconProps> = (props) => <Icon00 {...props} />;
export const IconGripVertical: React.FC<IconProps> = (props) => <Icon00 {...props} />;
export const IconPanelLeft: React.FC<IconProps> = (props) => <Icon00 {...props} />;
export const IconClose: React.FC<IconProps> = (props) => <Icon00 {...props} />; 