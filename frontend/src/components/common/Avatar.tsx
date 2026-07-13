import React, { HTMLAttributes } from 'react';

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Avatar({
  src,
  name,
  size = 'md',
  className = '',
  ...props
}: AvatarProps) {
  const getInitials = () => {
    if (!name) return '';
    const parts = name.trim().split(' ');
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const getGradientColors = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = [
      'from-indigo-500 to-violet-600',
      'from-blue-500 to-cyan-600',
      'from-emerald-500 to-teal-600',
      'from-amber-500 to-orange-600',
      'from-pink-500 to-rose-600',
      'from-purple-500 to-fuchsia-600',
    ];
    return colors[Math.abs(hash) % colors.length];
  };

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-lg',
  };

  return (
    <div
      className={`relative overflow-hidden rounded-full bg-gradient-to-br ${getGradientColors(
        name
      )} flex items-center justify-center text-white font-medium shadow-lg ${sizes[size]} ${className}`}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : null}
      {!src && <span>{getInitials()}</span>}
    </div>
  );
}
