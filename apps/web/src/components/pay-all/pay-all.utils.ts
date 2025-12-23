import type { PaymentState } from "@/components/dialogs/payment-modal/payment-modal.types";

export function calculateTotal(
	items: Array<{ quantity: number; unitPrice: number }>,
): number {
	return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
}

export function calculatePaymentStatus(
	totalPaid: number,
	total: number,
): {
	totalRemaining: number;
	isFullyPaid: boolean;
	isPartiallyPaid: boolean;
	isNotPaid: boolean;
} {
	const totalRemaining = Math.max(0, total - totalPaid);
	// Usar tolerancia para problemas de precisión de punto flotante
	const isFullyPaid = totalRemaining <= 0.01 || totalPaid >= total;
	const isPartiallyPaid = totalPaid > 0 && !isFullyPaid;
	const isNotPaid = totalPaid === 0;

	return {
		totalRemaining,
		isFullyPaid,
		isPartiallyPaid,
		isNotPaid,
	};
}

export function getTotalPaid(paymentState: PaymentState): number {
	return paymentState.cashPaid + paymentState.cardPaid;
}
