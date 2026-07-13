interface AvatarProps {
  src: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Avatar({ src, name, size = 'md' }: AvatarProps) {
  const sizes = { sm: 32, md: 40, lg: 56, xl: 80 };
  const fontSize = { sm: 12, md: 14, lg: 18, xl: 24 };
  const s = sizes[size];

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={{
          width: s, height: s, borderRadius: '50%',
          objectFit: 'cover', border: '2px solid var(--color-border)',
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: s, height: s, borderRadius: '50%',
        background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: fontSize[size], fontWeight: 700, color: 'white',
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}
