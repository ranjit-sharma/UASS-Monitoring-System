// src/utils/cn.js
/**
 * Merges class names, filtering falsy values.
 * Avoids the need for clsx/classnames dependency.
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
