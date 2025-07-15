import { useEffect, useCallback, useMemo } from 'react';

type KeyboardModifiers = {
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
};

type KeyboardShortcut = {
  key: string;
  modifiers?: KeyboardModifiers;
  callback: (event: KeyboardEvent) => void;
  enabled?: boolean;
};

export function useKeyboardShortcut(shortcut: KeyboardShortcut): void;
export function useKeyboardShortcut(shortcuts: KeyboardShortcut[]): void;
export function useKeyboardShortcut(
  shortcutOrShortcuts: KeyboardShortcut | KeyboardShortcut[]
): void {
  const shortcuts = useMemo(
    () => (Array.isArray(shortcutOrShortcuts) ? shortcutOrShortcuts : [shortcutOrShortcuts]),
    [shortcutOrShortcuts]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        if (shortcut.enabled === false) continue;

        const { key, modifiers = {}, callback } = shortcut;

        const isKeyMatch = event.key.toLowerCase() === key.toLowerCase();
        const isCtrlMatch = modifiers.ctrl ? event.ctrlKey : true;
        const isAltMatch = modifiers.alt ? event.altKey : true;
        const isShiftMatch = modifiers.shift ? event.shiftKey : true;
        const isMetaMatch = modifiers.meta ? event.metaKey : true;

        if (isKeyMatch && isCtrlMatch && isAltMatch && isShiftMatch && isMetaMatch) {
          event.preventDefault();
          callback(event);
          break;
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]): void {
  return useKeyboardShortcut(shortcuts);
}
