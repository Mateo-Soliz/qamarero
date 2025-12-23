import { Button } from "@/components/ui/button";

interface PaymentModalFooterProps {
	isValid: boolean;
	onConfirm: () => void;
	onCancel: () => void;
}

export function PaymentModalFooter({
	isValid,
	onConfirm,
	onCancel,
}: PaymentModalFooterProps) {
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
				disabled={!isValid}
				className="min-w-[120px] rounded-md"
			>
				Confirmar Pago
			</Button>
		</div>
	);
}
