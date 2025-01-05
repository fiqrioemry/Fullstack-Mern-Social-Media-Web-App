import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  Bookmark,
  ChevronLeft,
  LogOut,
  Menu,
  Moon,
  Settings,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useEffect, useRef, useState } from "react";
import useHandleDarkMode from "../../hooks/useHandleDarkMode";

function MenuOptions({ openSearch }) {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
  const { handleDarkMode, darkMode } = useHandleDarkMode();
  const [showModeToggle, setShowModeToggle] = useState(false);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowModeToggle(false);
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <DropdownMenu open={open}>
      <DropdownMenuTrigger asChild>
        <Button onClick={() => setOpen(!open)} variant="nav" size="lg">
          <Menu />
          {!openSearch && <div className="hidden lg:block">More</div>}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        ref={ref}
        className={cn(
          "dark:bg-accent w-64 p-0 transition-opacity",
          !open && "opacity-0"
        )}
        align="end"
        alignOffset={-40}
      >
        {!showModeToggle ? (
          <>
            <DropdownMenuItem className="dark:hover:bg-[#3C3C3C] flex items-center gap-x-2 px-4 py-3.5 m-1.5 rounded-lg font-medium cursor-pointer">
              <Settings size={20} />
              <p>Settings</p>
            </DropdownMenuItem>
            <DropdownMenuItem className="dark:hover:bg-[#3C3C3C] flex items-center gap-x-2 px-4 py-3.5 m-1.5 rounded-lg font-medium cursor-pointer">
              <Bookmark size={20} />
              <p>Saved</p>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="dark:hover:bg-[#3C3C3C] flex items-center gap-x-2 px-4 py-3.5 m-1.5 rounded-lg font-medium cursor-pointer"
              onClick={() => setShowModeToggle(true)}
            >
              <Moon size={20} />
              <p>Switch appearance</p>
            </DropdownMenuItem>
            <DropdownMenuItem className="dark:hover:bg-[#3C3C3C] flex items-center gap-x-2 px-4 py-3.5 m-1.5 rounded-lg font-medium cursor-pointer">
              <LogOut size={20} />
              <p>Log out</p>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <div className="flex items-center border-b border-gray-200 dark:border-neutral-700 py-3.5 px-2.5">
              <ChevronLeft size={18} onClick={() => setShowModeToggle(false)} />
              <p className="font-bold ml-1">Switch appearance</p>
              {darkMode ? (
                <Moon size={20} className="ml-auto" />
              ) : (
                <Sun size={20} className="ml-auto" />
              )}
            </div>
            <Label
              htmlFor="dark-mode"
              className="dark:hover:bg-[#3C3C3C] flex items-center gap-x-2 px-4 py-3.5 m-1.5 rounded-lg font-medium cursor-pointer"
            >
              Dark Mode
              <DropdownMenuItem className="ml-auto p-0">
                <Switch
                  id="dark-mode"
                  className="ml-auto"
                  checked={darkMode}
                  onCheckedChange={handleDarkMode}
                />
              </DropdownMenuItem>
            </Label>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default MenuOptions;
