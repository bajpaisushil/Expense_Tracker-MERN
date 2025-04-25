"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  BarChart,
  PieChart,
  ArrowRight,
  LogOut,
  LayoutDashboardIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getUser, logout } from "@/lib/auth";
import { toast } from "sonner";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const currentUser = getUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="flex flex-col min-h-screen w-full">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">ExpenseTracker</span>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={()=> router.push("/dashboard")}
                  >
                    <LayoutDashboardIcon className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ): (
              <div className="flex gap-4">
                <Button variant={"default"} onClick={()=> router.push("/login")}>Login</Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 md:py-32 bg-gradient-to-b from-background to-muted/50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                  Track Your Expenses with Ease
                </h1>
                <p className="text-lg text-muted-foreground md:text-xl">
                  Take control of your finances with our intuitive expense
                  tracker. Log expenses, view spending patterns, and make
                  smarter financial decisions.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card p-6 rounded-xl shadow-lg flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px]">
                  <PieChart className="h-12 w-12 mb-4 text-primary" />
                  <h3 className="text-xl font-semibold">Category Insights</h3>
                  <p className="text-muted-foreground mt-2">
                    Understand where your money goes with detailed category
                    breakdown
                  </p>
                </div>
                <div className="bg-card p-6 rounded-xl shadow-lg flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px]">
                  <BarChart className="h-12 w-12 mb-4 text-primary" />
                  <h3 className="text-xl font-semibold">Monthly Trends</h3>
                  <p className="text-muted-foreground mt-2">
                    Track your spending patterns over time with interactive
                    charts
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/20">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-[800px] mx-auto mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Features That Make Budgeting Simple
              </h2>
              <p className="text-muted-foreground mt-4 text-lg">
                Our expense tracker offers everything you need to take control
                of your finances
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="bg-card p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Expense Tracking</h3>
                <p className="text-muted-foreground">
                  Easily log expenses with custom categories, amounts and
                  descriptions
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Visual Analytics</h3>
                <p className="text-muted-foreground">
                  Interactive charts and graphs to visualize your spending
                  patterns
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-2xl">🔐</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure Access</h3>
                <p className="text-muted-foreground">
                  Your financial data is protected with secure authentication
                  and storage
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container flex flex-col items-center justify-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold">ExpenseTracker</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 ExpenseTracker. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
