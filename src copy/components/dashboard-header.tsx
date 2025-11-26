"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface DashboardHeaderProps {
  userName: string;
}

export default function DashboardHeader({ userName }: DashboardHeaderProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleLogout = () => {
    // Limpar dados da sessão
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("userEmail");
    
    // Redirecionar para a página inicial
    router.push("/");
  };
  
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
              TaBombandoAgora
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="ml-12 hidden md:flex space-x-6">
              <Link 
                href="/dashboard" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Dashboard
              </Link>
              <Link 
                href="/dashboard/favoritos" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Favoritos
              </Link>
              <Link 
                href="/dashboard/exportados" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Exportados
              </Link>
            </nav>
          </div>
          
          {/* User Menu - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <User size={18} />
                  <span className="max-w-[150px] truncate">{userName.split(" ")[0]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link href="/dashboard/perfil" className="flex items-center gap-2 w-full">
                    <User size={16} />
                    <span>Meu Perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <div className="flex items-center gap-2 w-full">
                    <LogOut size={16} />
                    <span>Sair</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <nav className="flex flex-col space-y-4 mt-8">
                  <Link 
                    href="/dashboard" 
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/dashboard/favoritos" 
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
                  >
                    Favoritos
                  </Link>
                  <Link 
                    href="/dashboard/exportados" 
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
                  >
                    Exportados
                  </Link>
                  <Link 
                    href="/dashboard/perfil" 
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors py-2"
                  >
                    Meu Perfil
                  </Link>
                  <Button 
                    variant="ghost" 
                    className="justify-start px-0 hover:bg-transparent"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} className="mr-2" />
                    <span>Sair</span>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}