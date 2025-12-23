"use client";

import { Label } from "@qamarero/ui";
import { XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableSelectPaymentDialogContent } from "./table-select-payment.content";
import { TableSelectPaymentDialogFooter } from "./table-select-payment.footer";
import { TableSelectPaymentDialogHeader } from "./table-select-payment.header";
import { getPaymentOptionById } from "./table-select-payment.mappers";
import type {
	PaymentOption,
	TableSelectPaymentDialogProps,
} from "./table-select-payment.types";

export function TableSelectPaymentDialog({
	open,
	onOpenChange,
	tableId,
}: TableSelectPaymentDialogProps) {
	const router = useRouter();
	const [selectedOption, setSelectedOption] = useState<PaymentOption>(null);
	const [numberOfGroups, setNumberOfGroups] = useState<string>("2");

	const handleConfirm = () => {
		if (!selectedOption || !tableId) return;

		const option = getPaymentOptionById(selectedOption);
		if (option) {
			let route = `${option.route}?tableId=${encodeURIComponent(tableId)}`;

			// Si es split-equal, agregar el parámetro groups
			if (selectedOption === "split-equal") {
				const groups = Number.parseInt(numberOfGroups, 10);
				if (groups > 0) {
					route += `&groups=${groups}`;
				} else {
					return; // No navegar si el número de grupos es inválido
				}
			}

			router.push(route as any);
			onOpenChange(false);
			setSelectedOption(null);
			setNumberOfGroups("2");
		}
	};

	// Reset selection when dialog closes
	useEffect(() => {
		if (!open) {
			setSelectedOption(null);
			setNumberOfGroups("2");
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

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div
				className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
				onClick={() => onOpenChange(false)}
				aria-hidden="true"
			/>
			<div
				className="relative z-51 mx-4 flex w-full max-w-4xl flex-col gap-4 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900"
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

				<TableSelectPaymentDialogHeader tableId={tableId} />
				<TableSelectPaymentDialogContent
					selectedOption={selectedOption}
					onSelectOption={setSelectedOption}
				/>

				{selectedOption === "split-equal" && (
					<div className="border-t px-2 py-4">
						<Label htmlFor="number-of-groups" className="mb-2 block">
							Número de grupos
						</Label>
						<Input
							id="number-of-groups"
							type="number"
							min="1"
							max="20"
							value={numberOfGroups}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
								const value = e.target.value;
								const numValue = Number.parseInt(value, 10);
								if (value === "" || (numValue >= 1 && numValue <= 20)) {
									setNumberOfGroups(value);
								}
							}}
							placeholder="2"
							className="max-w-32"
						/>
						<p className="mt-2 text-muted-foreground text-xs">
							El total se dividirá en {numberOfGroups || "2"}{" "}
							{Number.parseInt(numberOfGroups || "2", 10) === 1
								? "grupo"
								: "grupos"}{" "}
							de forma equitativa.
						</p>
					</div>
				)}

				<TableSelectPaymentDialogFooter
					selectedOption={selectedOption}
					onConfirm={handleConfirm}
					onCancel={() => onOpenChange(false)}
				/>
			</div>
		</div>
	);
}
