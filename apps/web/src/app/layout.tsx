import type { Metadata } from "next";

import { Geist, Geist_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { HeaderWrapper } from "@/components/header-wrapper";
import Providers from "@/components/providers";
import "../index.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "qamarero",
	description: "qamarero",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning className="h-full overflow-hidden">
			<body
				className={`${geistSans.variable} ${geistMono.variable} h-full overflow-hidden antialiased`}
			>
				<NuqsAdapter>
					<Providers>
						<main className="flex h-screen flex-col overflow-hidden">
							<HeaderWrapper />
							<div className="min-h-0 flex-1 overflow-hidden">{children}</div>
						</main>
					</Providers>
				</NuqsAdapter>
			</body>
		</html>
	);
}
