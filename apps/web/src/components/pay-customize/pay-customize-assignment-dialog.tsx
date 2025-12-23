"use client";

import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import type { CustomGroup } from "./pay-customize.types";

interface PayCustomizeAssignmentDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	groups: CustomGroup[];
	selectedItemIds: string[];
	onConfirm: (groupIds: string[]) => void;
}

export function PayCustomizeAssignmentDialog({
	open,
	onOpenChange,
	groups,
	selectedItemIds,
	onConfirm,
}: PayCustomizeAssignmentDialogProps) {
	const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

	// Reset selection when dialog opens/closes
	useEffect(() => {
		if (open) {
			setSelectedGroups([]);
		}
	}, [open]);

	// Prevenir scroll del body cuando el diálogo está abierto
	useEffect(() => {
		if (open) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);

	// Cerrar con Escape
	useEffect(() => {
		if (!open) return;

		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onOpenChange(false);
			}
		};

		document.addEventListener("keydown", handleEscape);
		return () => {
			document.removeEventListener("keydown", handleEscape);
		};
	}, [open, onOpenChange]);

	const handleGroupToggle = (groupId: string) => {
		setSelectedGroups((prev) =>
			prev.includes(groupId)
				? prev.filter((id) => id !== groupId)
				: [...prev, groupId],
		);
	};

	const handleConfirm = () => {
		if (selectedGroups.length === 0) {
			return;
		}
		onConfirm(selectedGroups);
		onOpenChange(false);
	};

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div
				className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
				onClick={() => onOpenChange(false)}
				aria-hidden="true"
			/>
			<div
				className="relative z-51 mx-4 flex w-full max-w-md flex-col gap-4 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900"
				onClick={(e) => e.stopPropagation()}
			>
				<Button
					type="button"
					onClick={() => onOpenChange(false)}
					variant="destructive"
					size="icon"
					className="absolute top-4 right-4 rounded-md p-2 transition-opacity focus:outline-none focus:ring-2 focus:ring-gray-400"
					aria-label="Cerrar"
				>
					<XIcon className="size-4" />
				</Button>

				<div>
					<h2 className="font-bold text-xl">Asignar a grupos</h2>
					<p className="mt-1 text-muted-foreground text-sm">
						Selecciona los grupos a los que quieres asignar{" "}
						{selectedItemIds.length}{" "}
						{selectedItemIds.length === 1 ? "item" : "items"} seleccionado
						{selectedItemIds.length === 1 ? "" : "s"}.
					</p>
				</div>

				<div className="max-h-64 space-y-3 overflow-y-auto">
					{groups.length === 0 ? (
						<p className="py-4 text-center text-muted-foreground text-sm">
							No hay grupos creados. Crea un grupo primero.
						</p>
					) : (
						groups.map((group) => (
							<div
								key={group.id}
								className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
							>
								<Checkbox
									checked={selectedGroups.includes(group.id)}
									onCheckedChange={() => handleGroupToggle(group.id)}
								/>
								<div className="flex-1">
									<div className="font-medium">{group.name}</div>
									<div className="text-muted-foreground text-xs">
										{group.itemIds.length}{" "}
										{group.itemIds.length === 1 ? "item" : "items"} asignado
										{group.itemIds.length === 1 ? "" : "s"}
									</div>
								</div>
							</div>
						))
					)}
				</div>

				<div className="mt-auto flex justify-end gap-3 border-t pt-4">
					<Button
						type="button"
						variant="ghost"
						onClick={() => onOpenChange(false)}
						className="rounded-md"
					>
						Cancelar
					</Button>
					<Button
						type="button"
						onClick={handleConfirm}
						disabled={selectedGroups.length === 0 || groups.length === 0}
						className="min-w-[120px] rounded-md"
					>
						Asignar
					</Button>
				</div>
			</div>
		</div>
	);
}
