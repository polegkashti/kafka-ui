import React, { useContext } from 'react';
import Select from 'components/common/Select/Select';
import Logo from 'components/common/Logo/Logo';
import SunIcon from 'components/common/Icons/SunIcon';
import MoonIcon from 'components/common/Icons/MoonIcon';
import { ThemeModeContext } from 'components/contexts/ThemeModeContext';
import { Button } from 'components/common/Button/Button';
import { useSupportUrl } from 'lib/hooks/api/appConfig';

import MenuIcon from 'components/common/Icons/MenuIcon';
import UserInfo from './UserInfo/UserInfo';
import External_Link from 'components/common/Icons/ExternalLink';
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
  const { data: supportUrl } = useSupportUrl();

  const handleSupportRedirect = () => {
    if (supportUrl) {
      window.open(supportUrl, '_blank');
    } else {
      console.error('Support URL is not defined in environment variables');
    }
  };

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
      <S.NavbarVersion>v1.1.4</S.NavbarVersion>
      <S.NavbarSocial>
      <Button buttonType="text" buttonSize="S" onClick={handleSupportRedirect}>
        Docs <External_Link/>
      </Button>
        <S.NoPaddingSelect
          options={options}
          value={themeMode}
          onChange={(option) => setThemeMode(option as string | number)}
          isThemeMode={true}
        />
        <UserInfo />
      </S.NavbarSocial>
    </S.Navbar>
  );
};

export default NavBar;
