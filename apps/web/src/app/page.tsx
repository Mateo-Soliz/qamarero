"use client";
import { useDebounce } from "@qamarero/ui/hooks/use-debounce";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useQueryState } from "nuqs";
import { Suspense } from "react";

import { TableList } from "@/components/table-list";
import { TableListEmpty } from "@/components/table-list-empty";
import { TableListSkeleton } from "@/components/table-list-skeleton";
import { Input } from "@/components/ui/input";
import { trpc } from "@/utils/trpc";

function HomeContent() {
	const [searchQuery, setSearchQuery] = useQueryState("search", {
		defaultValue: "",
		clearOnDefault: true,
	});

	const debouncedSearch = useDebounce(searchQuery, 300);

	const tablesQuery = useQuery(
		trpc.tables.getAll.queryOptions({
			search: debouncedSearch || undefined,
		}),
	);

	return (
		<main className="w-full mx-auto max-w-4xl px-4 py-6 z-0">
			<div className="mb-6">
				<div className="relative  w-full">
					<Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
					<Input
						type="text"
						placeholder="Buscar mesa..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-11 h-12 rounded-xl border-2 bg-card text-base"
					/>
				</div>
			</div>

			{tablesQuery.isLoading && <TableListSkeleton />}
			{tablesQuery.isSuccess && tablesQuery.data.length === 0 && (
				<TableListEmpty />
			)}
			{tablesQuery.isSuccess && tablesQuery.data.length > 0 && (
				<TableList tables={tablesQuery.data} />
			)}
		</main>
	);
}

export default function Home() {
	return (
		<Suspense fallback={<TableListSkeleton />}>
			<HomeContent />
		</Suspense>
	);
}
