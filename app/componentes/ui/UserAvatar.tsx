interface UserAvatarProps {
  name?: string | null;
  size?: 'sm' | 'md' | 'lg';
}

export default function UserAvatar({ name, size = 'md' }: UserAvatarProps) {
  const getInitials = (nombre?: string | null) => {
    if (!nombre) return 'U';
    const palabras = nombre.trim().split(' ');
    if (palabras.length >= 2) {
      return (palabras[0][0] + palabras[1][0]).toUpperCase();
    }
    return palabras[0].substring(0, 2).toUpperCase();
  };

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base'
  };

  const initials = getInitials(name);

  return (
    <div className={`${sizes[size]} bg-gray-500 rounded-full flex items-center justify-center font-bold text-white`}>
      {initials}
    </div>
  );
}
