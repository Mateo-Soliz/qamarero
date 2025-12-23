import { Button } from "@/components/ui/button";

import type { PaymentOption } from "./table-select-payment.types";

interface TableSelectPaymentDialogFooterProps {
	selectedOption: PaymentOption;
	onConfirm: () => void;
	onCancel: () => void;
}

export function TableSelectPaymentDialogFooter({
	selectedOption,
	onConfirm,
	onCancel,
}: TableSelectPaymentDialogFooterProps) {
	return (
		<div className="mt-auto flex justify-end gap-3">
			<Button
				type="button"
				variant="ghost"
				onClick={onCancel}
				className="rounded-md"
			>
				Cancelar
			</Button>
			<Button
				type="button"
				onClick={onConfirm}
				disabled={!selectedOption}
				className="min-w-[120px] rounded-md"
			>
				Confirmar
			</Button>
		</div>
	);
}
