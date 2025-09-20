"use client"

import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import BlendItLogo from "@/assets/icons/logo"
import { useUserInfoQuery } from "@/redux/features/auth/auth.api"
import { ProfileMenu } from "./ProfileMenu"

const NavAnimations = () => (
  <style>{`
    .nav-link {
      position: relative;
      font-weight: 500;
      color: #ffffff;
      padding-bottom: 2px;
      letter-spacing: 0.5px;
      transition: all 0.3s ease;
      background-color: transparent !important;
    }

    /* Hover effect: scale and letter spacing */
    .nav-link:hover {
      transform: scale(1.05);
      letter-spacing: 1px;
      background-color: transparent !important;
    }

    /* Base underline */
    .nav-link::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -18px; /* align slightly below label */
      width: 0%;
      height: 2px;
      background-color: #f97316;
      border-radius: 2px;
      transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1), transform 0.35s ease;
      transform-origin: left;
    }

    /* Hover underline: slide in from left */
    .nav-link:hover::after {
      width: 100%;
      transform: scaleX(1);
    }

    /* Active underline stays fixed */
    .nav-link-active::after {
      width: 100%;
      transform: scaleX(1);
    }
  `}</style>
)

const navigationLinks = [
  { href: "/", label: "Home" },
  { href: "/render", label: "Render" },
  { href: "/generate3d", label: "Generate 3D" },
  { href: "/community", label: "Community" },
  { href: "/projects", label: "Projects" },
]

export default function Navbar() {
  const { data } = useUserInfoQuery(undefined)
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token")
      localStorage.removeItem("email");
      navigate("/")
    } catch (error) {
      console.error("Failed to logout:", error)
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      window.location.reload()
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b px-4 backdrop-blur md:px-6">
      <NavAnimations />
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left: Logo & Nav */}
        <div className="flex items-center gap-6">
          <a href="/" className="text-primary hover:text-primary/90">
            <BlendItLogo />
          </a>
          <NavigationMenu className="max-md:hidden">
            <NavigationMenuList className="gap-4">
              {data?.email && localStorage.getItem("token")
                ? navigationLinks.map((link) => (
                    <NavigationMenuItem
                      key={link.href}
                      className="hover:bg-transparent"
                    >
                      <NavigationMenuLink asChild>
                        <Link
                          to={link.href}
                          className={cn(
                            "nav-link",
                            location.pathname === link.href &&
                              "nav-link-active"
                          )}
                        >
                          {link.label}
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))
                : navigationLinks.map((link) => (
                    <NavigationMenuItem
                      key={link.href}
                      className="hover:bg-transparent"
                    >
                      <NavigationMenuLink asChild>
                        <Link
                          to={link.href}
                          className={cn(
                            "nav-link",
                            location.pathname === link.href &&
                              "nav-link-active"
                          )}
                        >
                          {link.label}
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                ))
              }
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right: Auth */}
        <div className="flex items-center gap-4">
          {data?.email && localStorage.getItem("token") ? (
            <ProfileMenu onLogout={handleLogout} />
          ) : (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="bg-orange-600 text-white hover:scale-105 transition-transform"
            >
              <Link to={"/login"}>Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
