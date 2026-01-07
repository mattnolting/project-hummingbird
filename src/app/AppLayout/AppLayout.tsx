import React from 'react';
import { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Brand,
  Button,
  ButtonVariant,
  Compass,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownList,
  Masthead,
  MastheadBrand,
  MastheadContent,
  MastheadLogo,
  MastheadMain,
  MenuToggle,
  Nav,
  NavItem,
  NavList,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  Tooltip,
} from '@patternfly/react-core';
import CubeIcon from '@patternfly/react-icons/dist/esm/icons/cube-icon';
import FolderIcon from '@patternfly/react-icons/dist/esm/icons/folder-icon';
import QuestionCircleIcon from '@patternfly/react-icons/dist/esm/icons/question-circle-icon';
import CloudIcon from '@patternfly/react-icons/dist/esm/icons/cloud-icon';
import CodeIcon from '@patternfly/react-icons/dist/esm/icons/code-icon';
import pfLogo from '../../assets/PF-IconLogo-color.svg';
import imgAvatar from '../../assets/avatarImg.svg';
import { routes } from '../routes';

interface NavOnSelectProps {
  groupId: number | string;
  itemId: number | string;
  to: string;
}

interface AppLayoutProps {
  children: React.ReactNode;
}

// Map routes to icons - you can customize this mapping
const routeIconMap: Record<string, React.ReactNode> = {
  '/': <CubeIcon />,
  '/catalog': <FolderIcon />,
  '/support': <CloudIcon />,
  '/settings/general': <CodeIcon />,
  '/settings/profile': <CodeIcon />,
};

// Get icon for a route path
const getRouteIcon = (path: string): React.ReactNode => {
  return routeIconMap[path] || <CubeIcon />;
};

const AppLayout: React.FunctionComponent<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Get all routes that should appear in navigation (have labels and are not nested)
  const navRoutes = routes
    .flatMap((route) => ('routes' in route ? route.routes : [route]))
    .filter((route): route is NonNullable<typeof route> => !!route && !!route.label && !route.path.includes(':'));

  const onNavSelect = (_event: React.FormEvent<HTMLInputElement>, selectedItem: NavOnSelectProps) => {
    const path = typeof selectedItem.itemId === 'string' ? selectedItem.itemId : '';
    if (path) {
      navigate(path);
    }
  };

  const onDropdownToggle = () => {
    setIsDropdownOpen((prevIsOpen) => !prevIsOpen);
  };

  const onDropdownSelect = () => {
    setIsDropdownOpen(false);
  };

  const userDropdownItems = [
    <>
      <DropdownItem key="profile">My profile</DropdownItem>
      <DropdownItem key="user">User management</DropdownItem>
      <DropdownItem key="logout">Logout</DropdownItem>
    </>,
  ];

  // Create refs for nav items dynamically
  const navItemRefs = useRef<Record<string, React.RefObject<HTMLAnchorElement | null>>>({});
  navRoutes.forEach((route) => {
    if (route?.path && !navItemRefs.current[route.path]) {
      navItemRefs.current[route.path] = React.createRef<HTMLAnchorElement | null>();
    }
  });

  const settingsRef = useRef<HTMLButtonElement>(null);
  const helpRef = useRef<HTMLButtonElement>(null);
  const userMenuRef = useRef<HTMLButtonElement>(null);

  // Determine active item based on current location
  const activeItem =
    navRoutes.find(
      (route) => route?.path && (location.pathname === route.path || location.pathname.startsWith(route.path + '/')),
    )?.path || '';

  // Use type assertions for Compass-specific props that may not be in TypeScript definitions yet
  const MastheadComponent = Masthead as any;
  const ToolbarComponent = Toolbar as any;
  const NavComponent = Nav as any;
  const CompassComponent = Compass as any;

  const dockContent = (
    <MastheadComponent id="icon-router-link" variant="docked">
      <MastheadMain>
        <MastheadBrand>
          <MastheadLogo component={(props) => <a {...props} href="/" />}>
            <Brand src={pfLogo} alt="PatternFly" heights={{ default: '37px' }} />
          </MastheadLogo>
        </MastheadBrand>
      </MastheadMain>
      <Divider />
      <MastheadContent>
        <ToolbarComponent id="toolbar" isVertical>
          <ToolbarContent>
            <ToolbarItem>
              <NavComponent onSelect={onNavSelect} variant="docked" aria-label="Main navigation" ouiaId="IconNav">
                <NavList>
                  {navRoutes.map((route) => {
                    if (!route) return null;
                    const navRef = navItemRefs.current[route.path];
                    const routeLabel = route.label || route.path;
                    return (
                      <React.Fragment key={route.path}>
                        <NavItem
                          key={route.path}
                          preventDefault
                          id={`nav-${route.path}`}
                          to={route.path}
                          itemId={route.path}
                          isActive={activeItem === route.path}
                          icon={getRouteIcon(route.path)}
                          aria-label={routeLabel}
                        />
                        {navRef && navRef.current && (
                          <Tooltip aria="none" aria-live="off" triggerRef={navRef} content={routeLabel} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </NavList>
              </NavComponent>
            </ToolbarItem>
            <ToolbarGroup
              variant="action-group-plain"
              align={{ default: 'alignEnd' }}
              gap={{ default: 'gapNone', md: 'gapMd' }}
            >
              <ToolbarGroup variant="action-group-plain" visibility={{ default: 'hidden', lg: 'visible' }}>
                <ToolbarItem>
                  <Tooltip aria="none" aria-live="off" triggerRef={settingsRef} content="Settings">
                    <Button ref={settingsRef} aria-label="Settings" isSettings variant="plain" />
                  </Tooltip>
                </ToolbarItem>
                <ToolbarItem>
                  <Tooltip aria="none" aria-live="off" triggerRef={helpRef} content="Help">
                    <Button
                      ref={helpRef}
                      aria-label="Help"
                      variant={ButtonVariant.plain}
                      icon={<QuestionCircleIcon />}
                    />
                  </Tooltip>
                </ToolbarItem>
              </ToolbarGroup>
            </ToolbarGroup>
            <ToolbarItem>
              <Dropdown
                isOpen={isDropdownOpen}
                shouldFocusToggleOnSelect
                onSelect={onDropdownSelect}
                onOpenChange={(isOpen: boolean) => setIsDropdownOpen(isOpen)}
                toggle={{
                  toggleNode: (
                    <Tooltip content="User menu" aria="none" aria-live="off" triggerRef={userMenuRef}>
                      <MenuToggle
                        ref={userMenuRef}
                        onClick={onDropdownToggle}
                        isExpanded={isDropdownOpen}
                        icon={<Avatar src={imgAvatar} alt="" size="sm" />}
                        variant="plain"
                        aria-label="User menu"
                      />
                    </Tooltip>
                  ),
                  toggleRef: userMenuRef,
                }}
              >
                <DropdownList>{userDropdownItems}</DropdownList>
              </Dropdown>
            </ToolbarItem>
          </ToolbarContent>
        </ToolbarComponent>
      </MastheadContent>
    </MastheadComponent>
  );

  return (
    <CompassComponent
      dock={dockContent}
      main={children}
      backgroundSrcDark="/app/bgimages/pf-background.svg"
      backgroundSrcLight="/app/bgimages/pf-background.svg"
    />
  );
};

export { AppLayout };
