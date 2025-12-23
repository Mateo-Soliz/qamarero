import { Badge } from "@qamarero/ui";

import type { PaymentState } from "@/components/dialogs/payment-modal/payment-modal.types";

interface PaymentStatus {
	isFullyPaid: boolean;
	isPartiallyPaid: boolean;
	isNotPaid: boolean;
}

export function getGroupStatusBadge({
	isFullyPaid,
	isPartiallyPaid,
}: PaymentStatus) {
	if (isFullyPaid) {
		return (
			<Badge variant="default" className="bg-green-600 hover:bg-green-700">
				Pagado
			</Badge>
		);
	}
	if (isPartiallyPaid) {
		return (
			<Badge variant="secondary" className="bg-yellow-600 hover:bg-yellow-700">
				Parcial
			</Badge>
		);
	}
	return (
		<Badge variant="outline" className="bg-gray-100 dark:bg-gray-800">
			No pagado
		</Badge>
	);
}

export function getGroupMethodBadges(paymentState: PaymentState) {
	const badges = [];
	if (paymentState.cashPaid > 0) {
		badges.push(
			<Badge
				key="cash"
				variant="default"
				className="bg-blue-600 text-xs hover:bg-blue-700"
			>
				Efectivo
			</Badge>,
		);
	}
	if (paymentState.cardPaid > 0) {
		badges.push(
			<Badge
				key="card"
				variant="default"
				className="bg-purple-600 text-xs hover:bg-purple-700"
			>
				Tarjeta
			</Badge>,
		);
	}
	return badges.length > 0 ? badges : null;
}
