import type { PaymentState } from "@/components/dialogs/payment-modal/payment-modal.types";

export function calculateAmountPerGroup(
	total: number,
	numberOfGroups: number,
): number {
	if (numberOfGroups <= 0) return 0;
	return Number((total / numberOfGroups).toFixed(2));
}

/**
 * Calcula el monto para un grupo específico, asignando los centavos sobrantes al último grupo
 */
export function calculateAmountForGroup(
	total: number,
	numberOfGroups: number,
	groupId: number,
): number {
	if (numberOfGroups <= 0 || groupId < 1 || groupId > numberOfGroups) return 0;

	// Si es el último grupo, recibe el resto para evitar pérdidas por redondeo
	if (groupId === numberOfGroups) {
		const baseAmount = Number((total / numberOfGroups).toFixed(2));
		const sumOfPreviousGroups = baseAmount * (numberOfGroups - 1);
		const lastGroupAmount = Number((total - sumOfPreviousGroups).toFixed(2));
		return lastGroupAmount;
	}

	// Para los demás grupos, dividir equitativamente
	return Number((total / numberOfGroups).toFixed(2));
}

export function calculateGroupPaymentStatus(
	paymentState: PaymentState,
	groupAmount: number,
): {
	totalPaid: number;
	totalRemaining: number;
	isFullyPaid: boolean;
	isPartiallyPaid: boolean;
	isNotPaid: boolean;
} {
	const totalPaid = paymentState.cashPaid + paymentState.cardPaid;
	const totalRemaining = Math.max(0, groupAmount - totalPaid);
	const isFullyPaid = totalRemaining <= 0.01 || totalPaid >= groupAmount;
	const isPartiallyPaid = totalPaid > 0 && !isFullyPaid;
	const isNotPaid = totalPaid === 0;

	return {
		totalPaid,
		totalRemaining,
		isFullyPaid,
		isPartiallyPaid,
		isNotPaid,
	};
}

export function getTotalPaidForGroup(paymentState: PaymentState): number {
	return paymentState.cashPaid + paymentState.cardPaid;
}

export function calculateOverallPaymentStatus(
	groupsPaymentState: Record<number, PaymentState>,
	total: number,
): {
	totalPaid: number;
	totalRemaining: number;
	isFullyPaid: boolean;
	isPartiallyPaid: boolean;
	isNotPaid: boolean;
} {
	const totalPaid = Object.values(groupsPaymentState).reduce(
		(sum, state) => sum + state.cashPaid + state.cardPaid,
		0,
	);
	const totalRemaining = Math.max(0, total - totalPaid);
	const isFullyPaid = totalRemaining <= 0.01 || totalPaid >= total;
	const isPartiallyPaid = totalPaid > 0 && !isFullyPaid;
	const isNotPaid = totalPaid === 0;

	return {
		totalPaid,
		totalRemaining,
		isFullyPaid,
		isPartiallyPaid,
		isNotPaid,
	};
}
