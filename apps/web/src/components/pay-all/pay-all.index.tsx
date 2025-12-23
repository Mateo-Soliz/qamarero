"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { PaymentModal } from "@/components/dialogs/payment-modal/payment-modal";
import type { PaymentState } from "@/components/dialogs/payment-modal/payment-modal.types";
import { trpc } from "@/utils/trpc";
import { PayAllError } from "./pay-all.error";
import { PayAllHeader } from "./pay-all.header";
import { PayAllLoading } from "./pay-all.loading";
import { PayAllOrderDetail } from "./pay-all.order-detail";
import { PayAllTotalCard } from "./pay-all.total-card";
import { calculateTotal } from "./pay-all.utils";

interface PayAllContentProps {
	tableId: string;
}

export function PayAllContent({ tableId }: PayAllContentProps) {
	const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
	const [paymentState, setPaymentState] = useState<PaymentState>({
		cashPaid: 0,
		cardPaid: 0,
	});

	const { data, isLoading, error } = useQuery({
		...trpc.orders.getByTableId.queryOptions({
			tableId: tableId || "",
		}),
		enabled: !!tableId,
	});

	if (isLoading) {
		return <PayAllLoading />;
	}

	if (error) {
		return (
			<PayAllError
				title="Pagar todo de una"
				message={`Error al cargar el pedido: ${error.message}`}
			/>
		);
	}

	if (!data || !data.order) {
		return (
			<PayAllError
				title="Pagar todo de una"
				message={`No se encontró un pedido para la mesa: ${tableId}`}
			/>
		);
	}

	const { order, items } = data;
	const total = calculateTotal(items);

	return (
		<div className="flex h-full flex-col overflow-hidden">
			<div className="shrink-0 px-4 pt-6 pb-4">
				<PayAllHeader
					tableId={tableId}
					total={total}
					currency={order.currency}
					paymentState={paymentState}
				/>
			</div>

			<div className="grid min-h-0 flex-1 grid-cols-1 gap-6 overflow-hidden px-4 pb-6 lg:grid-cols-2">
				<PayAllOrderDetail items={items} currency={order.currency} />

				<PayAllTotalCard
					total={total}
					currency={order.currency}
					paymentState={paymentState}
					itemsCount={items.length}
					onPayClick={() => setIsPaymentModalOpen(true)}
				/>
			</div>

			<PaymentModal
				open={isPaymentModalOpen}
				onOpenChange={setIsPaymentModalOpen}
				total={total}
				currency={order.currency}
				onPaymentUpdate={setPaymentState}
			/>
		</div>
	);
}
