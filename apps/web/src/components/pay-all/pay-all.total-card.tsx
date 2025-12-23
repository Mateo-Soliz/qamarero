import type { PaymentState } from "@/components/dialogs/payment-modal/payment-modal.types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { calculatePaymentStatus, getTotalPaid } from "./pay-all.utils";

interface PayAllTotalCardProps {
	total: number;
	currency: string;
	paymentState: PaymentState;
	itemsCount: number;
	onPayClick: () => void;
}

export function PayAllTotalCard({
	total,
	currency,
	paymentState,
	itemsCount,
	onPayClick,
}: PayAllTotalCardProps) {
	const totalPaid = getTotalPaid(paymentState);
	const { totalRemaining, isFullyPaid, isPartiallyPaid } =
		calculatePaymentStatus(totalPaid, total);

	return (
		<Card className="rounded-lg">
			<CardContent className="pt-6">
				<div className="flex items-center justify-between">
					<div>
						<div className="text-muted-foreground text-sm">Total a pagar</div>
						<div className="mt-1 font-bold text-3xl">
							{total.toFixed(2)} {currency}
						</div>
						{isPartiallyPaid && (
							<div className="mt-1 text-orange-600 text-sm dark:text-orange-400">
								Pendiente: {totalRemaining.toFixed(2)} {currency}
							</div>
						)}
					</div>
					<Button
						onClick={onPayClick}
						size="lg"
						disabled={itemsCount === 0 || isFullyPaid}
					>
						{isFullyPaid ? "Pagado" : "Pagar"}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
