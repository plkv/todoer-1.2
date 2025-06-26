import React from 'react';

// Централизованный объект размеров иконок
export const ICON_SIZES = {
  m: 16,
  l: 20,
};

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: keyof typeof ICON_SIZES;
};

const getSize = (size: keyof typeof ICON_SIZES = 'm') => ICON_SIZES[size] || ICON_SIZES.m;

export const IconPlus: React.FC<IconProps> = ({ size = 'm', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={getSize(size)}
    height={getSize(size)}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <path d="M12 3.75V12M12 12V20.25M12 12H3.75M12 12H20.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconSettings: React.FC<IconProps> = ({ size = 'm', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={getSize(size)} height={getSize(size)} viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M5.70117 20.254V14.0015" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.70117 10.25V3.74707" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 20.0038V12.7505" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 8.99915V3.99707" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18.2988 20.2536V16.002" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18.2988 12.2508V3.74707" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 9.24902H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16.25 15.752H20.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.74609 13.7515H7.74982" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconList: React.FC<IconProps> = ({ size = 'm', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={getSize(size)} height={getSize(size)} viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M2.75 12H21.25M2.75 5.75H21.25M2.75 18.25H11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconCheck: React.FC<IconProps> = ({ size = 'm', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={getSize(size)} height={getSize(size)} viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M6.75 13.0625L9.9 16.25L17.25 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconChevronLeft: React.FC<IconProps> = ({ size = 'm', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={getSize(size)} height={getSize(size)} viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M13.7929 16L10.1464 12.3536C9.95118 12.1583 9.95118 11.8417 10.1464 11.6464L13.7929 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconChevronRight: React.FC<IconProps> = ({ size = 'm', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={getSize(size)} height={getSize(size)} viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M10 16L13.6464 12.3536C13.8417 12.1583 13.8417 11.8417 13.6464 11.6464L10 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconSearch: React.FC<IconProps> = ({ size = 'm', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={getSize(size)} height={getSize(size)} viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M20 20L16.1265 16.1265M16.1265 16.1265C17.4385 14.8145 18.25 13.002 18.25 11C18.25 6.99594 15.0041 3.75 11 3.75C6.99594 3.75 3.75 6.99594 3.75 11C3.75 15.0041 6.99594 18.25 11 18.25C13.002 18.25 14.8145 17.4385 16.1265 16.1265Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconDots: React.FC<IconProps> = ({ size = 'm', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={getSize(size)} height={getSize(size)} viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" fill="currentColor" />
    <path d="M20.25 13C20.8023 13 21.25 12.5523 21.25 12C21.25 11.4477 20.8023 11 20.25 11C19.6977 11 19.25 11.4477 19.25 12C19.25 12.5523 19.6977 13 20.25 13Z" fill="currentColor" />
    <path d="M3.75 13C4.30228 13 4.75 12.5523 4.75 12C4.75 11.4477 4.30228 11 3.75 11C3.19772 11 2.75 11.4477 2.75 12C2.75 12.5523 3.19772 13 3.75 13Z" fill="currentColor" />
    <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20.25 13C20.8023 13 21.25 12.5523 21.25 12C21.25 11.4477 20.8023 11 20.25 11C19.6977 11 19.25 11.4477 19.25 12C19.25 12.5523 19.6977 13 20.25 13Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.75 13C4.30228 13 4.75 12.5523 4.75 12C4.75 11.4477 4.30228 11 3.75 11C3.19772 11 2.75 11.4477 2.75 12C2.75 12.5523 3.19772 13 3.75 13Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconChevronDown: React.FC<IconProps> = ({ size = 'm', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={getSize(size)} height={getSize(size)} viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M8 10L11.6464 13.6464C11.8417 13.8417 12.1583 13.8417 12.3536 13.6464L16 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconChevronUp: React.FC<IconProps> = ({ size = 'm', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={getSize(size)} height={getSize(size)} viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M8 13.9999L11.6464 10.3535C11.8417 10.1582 12.1583 10.1582 12.3536 10.3535L16 13.9999" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconClose: React.FC<IconProps> = ({ size = 'm', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={getSize(size)} height={getSize(size)} viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M4.75 4.75L19.25 19.25M19.25 4.75L4.75 19.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const IconSun: React.FC<IconProps> = ({ size = 'm', ...props }) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width={getSize(size)} height={getSize(size)} viewBox="0 0 24 24" fill="none">
    <path d="M11.9982 3.29083V1.76758M5.83985 18.1586L4.76275 19.2357M11.9982 22.2327V20.7094M19.2334 4.76468L18.1562 5.84179M20.707 12.0001H22.2303M18.1562 18.1586L19.2334 19.2357M1.76562 12.0001H3.28888M4.76267 4.76462L5.83977 5.84173M15.7104 8.28781C17.7606 10.3381 17.7606 13.6622 15.7104 15.7124C13.6601 17.7627 10.336 17.7627 8.28574 15.7124C6.23548 13.6622 6.23548 10.3381 8.28574 8.28781C10.336 6.23756 13.6601 6.23756 15.7104 8.28781Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconMoon: React.FC<IconProps> = ({ size = 'm', ...props }) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width={getSize(size)} height={getSize(size)} viewBox="0 0 24 24" fill="none">
    <path d="M21.2481 11.8112C20.1889 12.56 18.8958 13 17.5 13C13.9101 13 11 10.0899 11 6.5C11 5.10416 11.44 3.81108 12.1888 2.75189C12.126 2.75063 12.0631 2.75 12 2.75C6.89137 2.75 2.75 6.89137 2.75 12C2.75 17.1086 6.89137 21.25 12 21.25C17.1086 21.25 21.25 17.1086 21.25 12C21.25 11.9369 21.2494 11.874 21.2481 11.8112Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconAuto: React.FC<IconProps> = ({ size = 'm', ...props }) => (
  <svg {...props} width={getSize(size)} height={getSize(size)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2.75C6.89137 2.75 2.75 6.89137 2.75 12C2.75 17.1086 6.89137 21.25 12 21.25C17.1086 21.25 21.25 17.1086 21.25 12C21.25 6.89137 17.1086 2.75 12 2.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8.85449 16.4883C8.34863 16.4883 8 16.1807 8 15.7158C8 15.5312 8.04785 15.3193 8.16406 14.9707L10.5156 8.23047C10.8096 7.3623 11.2266 7 12.0059 7C12.7783 7 13.1885 7.35547 13.4824 8.23047L15.834 14.9707C15.9297 15.2646 15.9775 15.4902 15.9775 15.6816C15.9775 16.1738 15.6289 16.4883 15.1025 16.4883C14.6035 16.4883 14.3164 16.2285 14.1318 15.5928L13.6055 14.0068H10.3311L9.81152 15.5928C9.62012 16.2354 9.34668 16.4883 8.85449 16.4883ZM10.7412 12.6328H13.2021L12.0195 8.85938H11.9307L10.7412 12.6328Z" fill="currentColor"/>
  </svg>
);

export const IconMore: React.FC<IconProps> = ({ size = 'm', ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={getSize(size)} height={getSize(size)} viewBox="0 0 16 16" fill="none" {...props}>
    <path d="M8.00004 8.66634C8.36824 8.66634 8.66671 8.36787 8.66671 7.99967C8.66671 7.63147 8.36824 7.33301 8.00004 7.33301C7.63184 7.33301 7.33337 7.63147 7.33337 7.99967C7.33337 8.36787 7.63184 8.66634 8.00004 8.66634Z" fill="currentColor"/>
    <path d="M13.5 8.66634C13.8682 8.66634 14.1667 8.36787 14.1667 7.99967C14.1667 7.63147 13.8682 7.33301 13.5 7.33301C13.1318 7.33301 12.8334 7.63147 12.8334 7.99967C12.8334 8.36787 13.1318 8.66634 13.5 8.66634Z" fill="currentColor"/>
    <path d="M2.50004 8.66634C2.86823 8.66634 3.16671 8.36787 3.16671 7.99967C3.16671 7.63147 2.86823 7.33301 2.50004 7.33301C2.13185 7.33301 1.83337 7.63147 1.83337 7.99967C1.83337 8.36787 2.13185 8.66634 2.50004 8.66634Z" fill="currentColor"/>
    <path d="M8.16671 7.99967C8.16671 7.90762 8.0921 7.83301 8.00004 7.83301C7.90798 7.83301 7.83337 7.90762 7.83337 7.99967C7.83337 8.09173 7.90798 8.16634 8.00004 8.16634C8.0921 8.16634 8.16671 8.09173 8.16671 7.99967ZM9.16671 7.99967C9.16671 8.64402 8.64438 9.16634 8.00004 9.16634C7.3557 9.16634 6.83337 8.64402 6.83337 7.99967C6.83337 7.35533 7.3557 6.83301 8.00004 6.83301C8.64438 6.83301 9.16671 7.35533 9.16671 7.99967Z" fill="currentColor"/>
    <path d="M13.6667 7.99967C13.6667 7.90762 13.5921 7.83301 13.5 7.83301C13.408 7.83301 13.3334 7.90762 13.3334 7.99967C13.3334 8.09173 13.408 8.16634 13.5 8.16634C13.5921 8.16634 13.6667 8.09173 13.6667 7.99967ZM14.6667 7.99967C14.6667 8.64402 14.1444 9.16634 13.5 9.16634C12.8557 9.16634 12.3334 8.64402 12.3334 7.99967C12.3334 7.35533 12.8557 6.83301 13.5 6.83301C14.1444 6.83301 14.6667 7.35533 14.6667 7.99967Z" fill="currentColor"/>
    <path d="M2.66671 7.99967C2.66671 7.90762 2.59209 7.83301 2.50004 7.83301C2.40799 7.83301 2.33337 7.90762 2.33337 7.99967C2.33337 8.09173 2.40799 8.16634 2.50004 8.16634C2.59209 8.16634 2.66671 8.09173 2.66671 7.99967ZM3.66671 7.99967C3.66671 8.64402 3.14436 9.16634 2.50004 9.16634C1.85572 9.16634 1.33337 8.64402 1.33337 7.99967C1.33337 7.35533 1.85572 6.83301 2.50004 6.83301C3.14436 6.83301 3.66671 7.35533 3.66671 7.99967Z" fill="currentColor"/>
  </svg>
); 