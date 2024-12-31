import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import InstagramLogo from "../common/InstagramLogo";
import InstagramIcon from "../common/InstagramIcon";
import { sidebarConfiguration } from "../../config";
import { MenuIcon, MoonIcon, SunIcon } from "lucide-react";
import useHandleDarkMode from "../../hooks/useHandleDarkMode";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProvider } from "../../context/GlobalProvider";
import MoreDropdown from "./MoreDropdown";

// eslint-disable-next-line react/prop-types
const SidebarContent = ({ openSearch, handleSearch, buttonRef }) => {
  const navigate = useNavigate();
  const { handleOpenModal } = useProvider();
  const { handleDarkMode, darkMode } = useHandleDarkMode();

  const handleNavigate = (params) => {
    navigate(`/${params}`);
  };

  const navigationMenu = sidebarConfiguration({
    handleNavigate,
    handleOpenModal,
    handleSearch,
  });

  return (
    <div className="px-3">
      <div className="hidden md:flex items-center h-[6.5rem] px-3">
        {openSearch ? (
          <InstagramIcon />
        ) : (
          <InstagramLogo size={30} width={105} />
        )}
      </div>

      <div className="flex md:block">
        {navigationMenu.map((menu) => (
          <Button
            size="lg"
            variant="nav"
            onClick={menu.action}
            ref={menu.title !== "create" ? buttonRef : null}
            key={menu.title}
          >
            <menu.icon size={26} />
            {!openSearch && (
              <span className="hidden xl:block">{menu.title}</span>
            )}
          </Button>
        ))}
      </div>
      <div className="hidden md:block">
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="lg" variant="nav">
              <MenuIcon size={26} />
              {!openSearch && <span className="hidden xl:block">more</span>}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <Button
              className="h-12 rounded-md px-3 py-3 text-sm hover:bg-accent hover:text-accent-foreground flex items-center justify-between gap-x-3 w-full"
              onClick={handleDarkMode}
            >
              {darkMode ? <span>Light mode</span> : <span>Dark mode</span>}
              {darkMode ? <MoonIcon /> : <SunIcon />}
            </Button>
            <DropdownMenuItem>
              <Link to="settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
        <MoreDropdown />
      </div>
    </div>
  );
};

export default SidebarContent;
