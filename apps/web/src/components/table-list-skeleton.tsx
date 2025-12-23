"use client";

import { Skeleton } from "./ui/skeleton";

export function TableListSkeleton() {
	return (
		<div className="grid gap-4">
			{Array.from({ length: 6 }).map((_, i) => (
				<div key={i} className="rounded-lg border p-4">
					<div className="flex items-center justify-between">
						<div className="flex-1 space-y-2">
							<Skeleton className="h-5 w-32" />
							<Skeleton className="h-4 w-24" />
						</div>
						<Skeleton className="h-4 w-16" />
					</div>
				</div>
			))}
		</div>
	);
}
