import { useMemo } from "react";

interface AvatarProps {
  name: string;
  className?: string;
}

const Avatar = ({ name, className = "" }: AvatarProps) => {
  const initials = useMemo(() => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [name]);

  const gradientColors = useMemo(() => {
    // Generate a consistent gradient based on the name
    const hash = name.split("").reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    const hue = Math.abs(hash % 360);
    return {
      start: `hsl(${hue}, 70%, 65%)`,
      end: `hsl(${(hue + 30) % 360}, 70%, 45%)`,
    };
  }, [name]);

  return (
    <div
      className={`flex items-center justify-center rounded-full ${className}`}
      style={{
        background: `linear-gradient(135deg, ${gradientColors.start}, ${gradientColors.end})`,
        minWidth: "2.5rem",
        minHeight: "2.5rem",
      }}
    >
      <span className='text-white font-medium text-sm'>{initials}</span>
    </div>
  );
};

export default Avatar;
