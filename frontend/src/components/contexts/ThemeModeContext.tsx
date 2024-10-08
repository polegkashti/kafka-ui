import React, { useMemo } from 'react';
import type { FC, PropsWithChildren } from 'react';
import type { ThemeDropDownValue } from 'components/NavBar/NavBar';

interface ThemeModeContextProps {
  isDarkMode: boolean;
  themeMode: ThemeDropDownValue;
  setThemeMode: (value: string | number) => void;
}

export const ThemeModeContext = React.createContext<ThemeModeContextProps>({
  isDarkMode: false,
  themeMode: 'light_theme',
  setThemeMode: () => {},
});

export const ThemeModeProvider: FC<PropsWithChildren<unknown>> = ({
  children,
}) => {
  const [themeMode, setThemeModeState] =
    React.useState<ThemeDropDownValue>('light_theme');

  React.useLayoutEffect(() => {
    const mode = localStorage.getItem('mode');
    setThemeModeState((mode as ThemeDropDownValue) ?? 'light_theme');
  }, [setThemeModeState]);

  const isDarkMode = React.useMemo(() => {
    return themeMode === 'dark_theme';
  }, [themeMode]);

  const setThemeMode = React.useCallback(
    (value: string | number) => {
      setThemeModeState(value as ThemeDropDownValue);
      localStorage.setItem('mode', value as string);
    },
    [setThemeModeState]
  );

  const contextValue = useMemo(
    () => ({
      isDarkMode,
      themeMode,
      setThemeMode,
    }),
    [isDarkMode, themeMode, setThemeMode]
  );

  return (
    <ThemeModeContext.Provider value={contextValue}>
      {children}
    </ThemeModeContext.Provider>
  );
};
