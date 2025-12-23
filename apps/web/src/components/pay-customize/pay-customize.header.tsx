import { Badge } from "@qamarero/ui";
import { ArrowLeftIcon, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { CustomGroup } from "./pay-customize.types";

interface PayCustomizeHeaderProps {
	tableId: string;
	total: number;
	currency: string;
	groups: CustomGroup[];
	onAddGroup: () => void;
}

export function PayCustomizeHeader({
	tableId,
	total,
	currency,
	groups,
	onAddGroup,
}: PayCustomizeHeaderProps) {
	const router = useRouter();
	const totalPaid = groups.reduce(
		(sum, group) =>
			sum + group.paymentState.cashPaid + group.paymentState.cardPaid,
		0,
	);
	const totalRemaining = Math.max(0, total - totalPaid);
	const isFullyPaid = totalRemaining <= 0.01 || totalPaid >= total;
	const isPartiallyPaid = totalPaid > 0 && !isFullyPaid;
	const isNotPaid = totalPaid === 0;

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
		const hasCash = groups.some((group) => group.paymentState.cashPaid > 0);
		const hasCard = groups.some((group) => group.paymentState.cardPaid > 0);

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
		<div className="flex items-start justify-between gap-4">
			<div className="flex-1">
				<div className="flex flex-wrap items-center gap-3">
					<h1 className="font-bold text-2xl">Personalizar</h1>
					{getPaymentStatusBadge()}
					{getPaymentMethodBadges()}
				</div>
				<p className="text-muted-foreground">
					Divide el pedido en grupos personalizados y asigna productos a cada
					uno.
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
						{groups.length} {groups.length === 1 ? "grupo" : "grupos"} creado
						{groups.length === 1 ? "" : "s"}
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
				<Button
					variant="outline"
					className="mt-2 rounded-sm"
					onClick={() => router.back()}
				>
					<ArrowLeftIcon className="h-4 w-4" />
					Volver
				</Button>
			</div>
			<Button
				variant="outline"
				onClick={onAddGroup}
				className="mt-2 shrink-0 rounded-sm"
			>
				<Plus className="mr-2 h-4 w-4" />
				Agregar grupo
			</Button>
		</div>
	);
}
