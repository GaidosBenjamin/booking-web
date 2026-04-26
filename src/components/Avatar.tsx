interface AvatarProps {
  firstName: string;
  lastName: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

const bgColors = [
  'bg-primary-fixed',
  'bg-secondary-fixed',
  'bg-tertiary-fixed',
  'bg-secondary-container',
  'bg-primary-fixed-dim',
  'bg-tertiary-fixed-dim',
];

const textColors = [
  'text-on-primary-fixed',
  'text-on-secondary-fixed',
  'text-on-tertiary-fixed',
  'text-on-secondary-container',
  'text-on-primary-fixed',
  'text-on-tertiary-fixed',
];

const sizeClasses = {
  sm: 'w-6 h-6 text-[10px]',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
};

export default function Avatar({ firstName, lastName, size = 'md', className = '' }: AvatarProps) {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  const hash = hashCode(`${firstName}${lastName}`);
  const colorIndex = hash % bgColors.length;

  return (
    <div
      className={`
        ${sizeClasses[size]} rounded-full flex items-center justify-center
        ${bgColors[colorIndex]} ${textColors[colorIndex]}
        font-headline font-bold select-none shrink-0
        ${className}
      `}
      title={`${firstName} ${lastName}`}
    >
      {initials}
    </div>
  );
}
