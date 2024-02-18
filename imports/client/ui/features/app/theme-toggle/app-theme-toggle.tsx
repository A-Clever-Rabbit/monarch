import React, {useEffect} from 'react'
import {useLocalStorage} from '@mantine/hooks'

export type Theme = 'light' | 'dark';
export const AppThemeToggle = () => {
  const [theme, _setTheme] = useLocalStorage<Theme>({ key: "theme", defaultValue: "dark" });

  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme, "text-muted-foreground");
  }, [ theme ]);
  return <>
    {/*<button onClick={() => {*/}
    {/*  setTheme(theme === "light" ? "dark":"light");*/}
    {/*}} className="fixed left-4 lg:left-auto lg:right-4 bottom-4 text-muted-foreground z-50">*/}
    {/*  {theme === "light" && <Sun />}*/}
    {/*  {theme === "dark" && <Moon/>}*/}
    {/*</button>*/}
  </>
}
