"use client";

import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import { Header } from "./header";

export function HeaderWrapper() {
	const healthCheck = useQuery(trpc.healthCheck.queryOptions());
	const isOnline = !!healthCheck.data;

	return <Header isOnline={isOnline} />;
}
