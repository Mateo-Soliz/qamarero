"use client";

import { Utensils } from "lucide-react";

export function TableListEmpty() {
	return (
		<div className="flex flex-col items-center justify-center py-12 text-center">
			<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
				<Utensils className="h-8 w-8 text-muted-foreground" />
			</div>
			<h3 className="mb-2 font-semibold text-foreground text-lg">
				No se encontraron mesas
			</h3>
			<p className="text-muted-foreground text-sm">
				Intenta ajustar tu búsqueda o filtros
			</p>
		</div>
	);
}
