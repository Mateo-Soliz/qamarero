import { Badge, Button } from "@qamarero/ui";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import type { PaymentState } from "@/components/dialogs/payment-modal/payment-modal.types";
import { calculatePaymentStatus, getTotalPaid } from "./pay-all.utils";

interface PayAllHeaderProps {
	tableId: string;
	total: number;
	currency: string;
	paymentState: PaymentState;
}

export function PayAllHeader({
	tableId,
	total,
	currency,
	paymentState,
}: PayAllHeaderProps) {
	const router = useRouter();
	const totalPaid = getTotalPaid(paymentState);
	const { totalRemaining, isFullyPaid, isPartiallyPaid, isNotPaid } =
		calculatePaymentStatus(totalPaid, total);

	const getPaymentStatusBadge = () => {
		if (isFullyPaid) {
			return (
				<Badge variant="default" className="bg-green-600 hover:bg-green-700">
					Pagado
				</Badge>
			);
		}
		if (isPartiallyPaid) {
			return (
				<Badge
					variant="secondary"
					className="bg-yellow-600 hover:bg-yellow-700"
				>
					Parcialmente pagado
				</Badge>
			);
		}
		if (isNotPaid) {
			return (
				<Badge variant="outline" className="bg-gray-100 dark:bg-gray-800">
					No pagado
				</Badge>
			);
		}
		return null;
	};

	const getPaymentMethodBadges = () => {
		const badges = [];
		if (paymentState.cashPaid > 0) {
			badges.push(
				<Badge
					key="cash"
					variant="default"
					className="bg-blue-600 hover:bg-blue-700"
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
					className="bg-purple-600 hover:bg-purple-700"
				>
					Tarjeta
				</Badge>,
			);
		}
		return badges.length > 0 ? badges : null;
	};

	return (
		<div>
			<div className="flex flex-wrap items-center gap-3">
				<h1 className="font-bold text-2xl">Pagar todo de una</h1>
				{getPaymentStatusBadge()}
				{getPaymentMethodBadges()}
			</div>
			<p className="text-muted-foreground">
				Revisa el detalle del pedido y procede con el pago.
			</p>
			<p className="mt-2 text-muted-foreground text-sm">
				Mesa: <span className="font-medium">{tableId}</span>
			</p>
			<Button variant="outline" className="mt-2" onClick={() => router.back()}>
				<ArrowLeftIcon className="h-4 w-4" />
				Volver
			</Button>
			{isPartiallyPaid && (
				<div className="mt-2 text-sm">
					<span className="text-muted-foreground">Pagado: </span>
					<span className="font-medium text-green-600 dark:text-green-400">
						{totalPaid.toFixed(2)} {currency}
					</span>
					<span className="text-muted-foreground"> / </span>
					<span className="font-medium">
						{total.toFixed(2)} {currency}
					</span>
					<span className="ml-2 text-muted-foreground">
						(Pendiente: {totalRemaining.toFixed(2)} {currency})
					</span>
				</div>
			)}
		</div>
	);
}
