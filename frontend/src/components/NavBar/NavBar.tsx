import React, { useContext } from 'react';
import Select from 'components/common/Select/Select';
import Logo from 'components/common/Logo/Logo';
import SunIcon from 'components/common/Icons/SunIcon';
import MoonIcon from 'components/common/Icons/MoonIcon';
import { ThemeModeContext } from 'components/contexts/ThemeModeContext';
import { Button } from 'components/common/Button/Button';
import MenuIcon from 'components/common/Icons/MenuIcon';
import UserInfo from './UserInfo/UserInfo';
import * as S from './NavBar.styled';

interface Props {
  onBurgerClick: () => void;
}

export type ThemeDropDownValue = 'light_theme' | 'dark_theme';

const options = [
  {
    label: (
      <>
        <SunIcon />
        <div>Light theme</div>
      </>
    ),
    value: 'light_theme',
  },
  {
    label: (
      <>
        <MoonIcon />
        <div>Dark theme</div>
      </>
    ),
    value: 'dark_theme',
  },
];

const NavBar: React.FC<Props> = ({ onBurgerClick }) => {
  const { themeMode, setThemeMode } = useContext(ThemeModeContext);

  return (
    <S.Navbar role="navigation" aria-label="Page Header">
      <S.NavbarBrand>
        <S.NavbarBrand>
          <Button buttonType="text" buttonSize="S" onClick={onBurgerClick}>
            <MenuIcon />
          </Button>

          <S.Hyperlink to="/">
            <Logo />
            Kafka by IDFcTS
          </S.Hyperlink>

        </S.NavbarBrand>
      </S.NavbarBrand>
      <S.NavbarVersion>Version: v1.1.4</S.NavbarVersion>
      <S.NavbarSocial>
        <Select
          options={options}
          value={themeMode}
          onChange={setThemeMode}
          isThemeMode
        />
        <UserInfo />
      </S.NavbarSocial>
    </S.Navbar>
  );
};

export default NavBar;
