"use client";

import { useState } from "react";

import { TableSelectPaymentDialog } from "./dialogs/table-select-payment/table-select-payment.index";

interface Table {
	id: string;
	name: string;
	server: string | null;
}

interface TableListProps {
	tables: Table[];
}

export function TableList({ tables }: TableListProps) {
	const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const handleTableClick = (tableId: string) => {
		setSelectedTableId(tableId);
		setIsDialogOpen(true);
	};

	return (
		<>
			<div className="grid gap-4">
				{tables.map((table) => (
					<button
						key={table.id}
						onClick={() => handleTableClick(table.id)}
						className="cursor-pointer rounded-lg border p-4 transition-colors hover:bg-accent/50"
					>
						<div className="flex items-center justify-between">
							<div className="space-y-1">
								<h3 className="font-semibold text-foreground">{table.name}</h3>
								<p className="text-muted-foreground text-sm">ID: {table.id}</p>
							</div>
							{table.server && (
								<div className="text-right">
									<p className="font-medium text-foreground text-sm">
										{table.server}
									</p>
									<p className="text-muted-foreground text-xs">Camarero</p>
								</div>
							)}
						</div>
					</button>
				))}
			</div>
			<TableSelectPaymentDialog
				open={isDialogOpen}
				onOpenChange={(open) => {
					setIsDialogOpen(open);
					if (!open) {
						setSelectedTableId(null);
					}
				}}
				tableId={selectedTableId || ""}
			/>
		</>
	);
}
