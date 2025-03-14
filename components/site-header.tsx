"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { ChevronDown, LogIn, Menu, X } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function SiteHeader() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const routes = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "About",
      path: "/about",
    },
    {
      name: "Academics",
      path: "/academics",
      children: [
        { name: "CBC Curriculum", path: "/academics/cbc" },
        { name: "Subjects", path: "/academics/subjects" },
        { name: "Programs", path: "/academics/programs" },
      ],
    },
    {
      name: "Admissions",
      path: "/admissions",
    },
    {
      name: "News & Events",
      path: "/events",
    },
    {
      name: "Contact",
      path: "/contact",
    },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" aria-label="Toggle Menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <div className="flex items-center gap-2 pb-4 pt-2">
                <div className="relative h-10 w-10 overflow-hidden">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-02-26%20at%2017.45.15_90b5c25e.jpg-DKDqlB7TbZW1ATzj9FDmIXHxs39109.jpeg"
                    alt="CHEPARERIA PREPARATORY SCHOOL Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-lg font-bold">CHEPARERIA PREPARATORY</span>
                <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setIsOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="flex flex-col gap-4">
                {routes.map((route) => (
                  <div key={route.path} className="flex flex-col">
                    <Link
                      href={route.path}
                      className={`py-2 text-lg font-medium ${
                        pathname === route.path ? "text-primary" : "text-foreground/70 hover:text-foreground"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {route.name}
                    </Link>
                    {route.children && (
                      <div className="ml-4 flex flex-col gap-2 mt-2">
                        {route.children.map((child) => (
                          <Link
                            key={child.path}
                            href={child.path}
                            className={`py-1 text-base ${
                              pathname === child.path ? "text-primary" : "text-foreground/70 hover:text-foreground"
                            }`}
                            onClick={() => setIsOpen(false)}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
              <div className="mt-8 flex flex-col gap-2">
                <Button asChild className="w-full">
                  <Link href="/portal" onClick={() => setIsOpen(false)}>
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-10 w-10 overflow-hidden">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-02-26%20at%2017.45.15_90b5c25e.jpg-DKDqlB7TbZW1ATzj9FDmIXHxs39109.jpeg"
                alt="CHEPARERIA PREPARATORY SCHOOL Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-lg font-bold hidden sm:inline-block">CHEPARERIA PREPARATORY SCHOOL</span>
          </Link>
        </div>
        <nav className="hidden lg:flex items-center gap-6">
          {routes.map((route) =>
            route.children ? (
              <DropdownMenu key={route.path}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`flex items-center gap-1 ${
                      pathname === route.path ? "text-primary" : "text-foreground/70"
                    }`}
                  >
                    {route.name}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center">
                  {route.children.map((child) => (
                    <DropdownMenuItem key={child.path} asChild>
                      <Link href={child.path}>{child.name}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                key={route.path}
                href={route.path}
                className={`text-sm font-medium ${
                  pathname === route.path ? "text-primary" : "text-foreground/70 hover:text-foreground"
                }`}
              >
                {route.name}
              </Link>
            ),
          )}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="hidden sm:flex">
            <Link href="/portal">
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/admissions">Apply Now</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

