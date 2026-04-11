"use client";

import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import clientData from "@/data/clientData";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useTheme } from "next-themes";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const staticLinks = [
  { name: "Overview", href: "#overview" },
  { name: "Education", href: "#education" },
  { name: "Certificates", href: "#certificates" },
];

if (clientData.showProjectsSection) {
  staticLinks.push({ name: "Projects", href: "#projects" });
}

if (clientData.showBlogsSection) {
  staticLinks.push({ name: "Blogs", href: "#blogs" });
}

staticLinks.push({ name: "Contact", href: "#contact" });

const navLinks = staticLinks;

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );

    navLinks.forEach((link) => {
      const el = document.querySelector(link.href);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.05)] border-b border-white/50 dark:border-gray-800/50",
        scrolled ? "py-3" : "py-5"
      )}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center">
          <a href="#" className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            {clientData.name.split(" ")[0]}
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-2 items-center">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "font-medium transition-all duration-300 px-4 py-2 rounded-lg text-base",
                    isActive 
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-sm" 
                      : "text-gray-600 dark:text-gray-300 md:hover:text-blue-500 md:dark:hover:text-blue-400 md:hover:drop-shadow-[0_0_6px_rgba(99,102,241,0.6)] bg-transparent"
                  )}
                >
                  {link.name}
                </a>
              );
            })}
          </div>

          {/* Right Actions (Theme Toggle & Mobile Menu) */}
          <div className="flex items-center gap-3">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle Dark Mode"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-900 shadow-lg py-4 px-6 flex flex-col space-y-2 border-t border-gray-100 dark:border-gray-800 transition-colors duration-300">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "font-medium transition-colors px-4 py-3 rounded-lg text-lg",
                  isActive 
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white" 
                    : "text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                )}
              >
                {link.name}
              </a>
            );
          })}
        </div>
      )}
    </nav>
  );
}
