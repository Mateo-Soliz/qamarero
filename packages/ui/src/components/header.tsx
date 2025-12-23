"use client";

import { Utensils } from "lucide-react";

interface HeaderProps {
	isOnline: boolean;
}

export function Header({ isOnline }: HeaderProps) {
	return (
		<header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
			<div className="flex h-16 items-center justify-between px-6">
				{/* Logo */}
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
						<Utensils className="h-6 w-6 text-primary-foreground" />
					</div>
					<h1 className="block font-bold text-2xl text-foreground tracking-tight sm:hidden">
						Qamarero
					</h1>
				</div>

				{/* Status Indicator */}
				<div className="flex items-center gap-2">
					<div
						className={`h-2.5 w-2.5 rounded-full ${
							isOnline ? "animate-pulse bg-green-500" : "bg-destructive"
						}`}
					/>
					<span className="inline font-medium text-muted-foreground text-sm sm:hidden">
						{isOnline ? "Conectado" : "Desconectado"}
					</span>
				</div>
			</div>
		</header>
	);
}
