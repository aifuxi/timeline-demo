import { type ClassValue, clsx } from "clsx";
import { nanoid } from "nanoid";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const getRect = (ref: React.MutableRefObject<HTMLDivElement | null>) => {
  const rect = ref.current?.getBoundingClientRect();

  return {
    left: rect?.left ?? 0,
    right: rect?.right ?? 0,
    width: rect?.width ?? 0,
    height: rect?.height ?? 0,
  };
};

export const genID = () => {
  return nanoid();
};
