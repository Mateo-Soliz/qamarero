import { Badge, Button } from "@qamarero/ui";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import type { GroupPaymentState } from "./pay-split-equal.types";
import { calculateOverallPaymentStatus } from "./pay-split-equal.utils";

interface PaySplitEqualHeaderProps {
	tableId: string;
	total: number;
	currency: string;
	numberOfGroups: number;
	groupsPaymentState: GroupPaymentState;
}

export function PaySplitEqualHeader({
	tableId,
	total,
	currency,
	numberOfGroups,
	groupsPaymentState,
}: PaySplitEqualHeaderProps) {
	const router = useRouter();
	const { totalPaid, totalRemaining, isFullyPaid, isPartiallyPaid, isNotPaid } =
		calculateOverallPaymentStatus(groupsPaymentState, total);

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
		const hasCash = Object.values(groupsPaymentState).some(
			(state) => state.cashPaid > 0,
		);
		const hasCard = Object.values(groupsPaymentState).some(
			(state) => state.cardPaid > 0,
		);

		if (hasCash) {
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
		if (hasCard) {
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
				<h1 className="font-bold text-2xl">Por partes iguales</h1>
				{getPaymentStatusBadge()}
				{getPaymentMethodBadges()}
			</div>
			<p className="text-muted-foreground">
				El pedido se divide en {numberOfGroups}{" "}
				{numberOfGroups === 1 ? "grupo" : "grupos"} de forma equitativa.
			</p>
			<p className="mt-2 text-muted-foreground text-sm">
				Mesa: <span className="font-medium">{tableId}</span>
			</p>
			<div className="mt-2 text-sm">
				<span className="text-muted-foreground">Total: </span>
				<span className="font-medium">
					{total.toFixed(2)} {currency}
				</span>
				<span className="text-muted-foreground"> / </span>
				<span className="text-muted-foreground">
					{numberOfGroups} {numberOfGroups === 1 ? "grupo" : "grupos"} ×{" "}
					{(total / numberOfGroups).toFixed(2)} {currency}
				</span>
			</div>
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
			<Button variant="outline" className="mt-2" onClick={() => router.back()}>
				<ArrowLeftIcon className="h-4 w-4" />
				Volver
			</Button>
		</div>
	);
}
