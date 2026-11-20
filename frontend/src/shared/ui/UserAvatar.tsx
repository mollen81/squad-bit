import { useState, useEffect } from 'react';

interface UserAvatarProps {
  src?: string | null;
  username: string;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

const SIZE_CLASSES = {
  xs: 'w-5 h-5 text-[9px]',
  sm: 'w-6 h-6 text-[10px]',
  md: 'w-8 h-8 text-[12px]'
};

export function UserAvatar({
  src,
  username,
  size = 'sm',
  className = ''
}: UserAvatarProps) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [src]);

  const showImage = Boolean(src) && !imgError;

  return (
    <span
      title={username}
      className={`relative inline-flex items-center justify-center shrink-0 overflow-hidden rounded-[3px] border border-[#DCDCDC] dark:border-[#2E2E2E] bg-[#EFEFEF] dark:bg-[#1C1C1C] ${SIZE_CLASSES[size]} ${className}`}
    >
      {showImage ? (
        <img
          src={src!}
          alt={username}
          loading="lazy"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover block"
        />
      ) : (
        <svg
          viewBox="0 0 24 24"
          className="w-[72%] h-[72%] text-[#888888] dark:text-[#737373]"
          fill="currentColor"
          aria-hidden="true"
        >
          <circle cx="12" cy="8.5" r="3.75" />
          <path d="M5.5 19.25c0-3.3 2.9-5.75 6.5-5.75s6.5 2.45 6.5 5.75v.75h-13v-.75z" />
        </svg>
      )}
    </span>
  );
}

export default UserAvatar;
