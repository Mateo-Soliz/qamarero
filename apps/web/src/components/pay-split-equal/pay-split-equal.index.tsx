"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { PaymentModal } from "@/components/dialogs/payment-modal/payment-modal";
import type { PaymentState } from "@/components/dialogs/payment-modal/payment-modal.types";
import { trpc } from "@/utils/trpc";
import { calculateTotal } from "../pay-all/pay-all.utils";
import { PaySplitEqualError } from "./pay-split-equal.error";
import { PaySplitEqualGroups } from "./pay-split-equal.groups";
import { PaySplitEqualHeader } from "./pay-split-equal.header";
import { PaySplitEqualItems } from "./pay-split-equal.items";
import { PaySplitEqualLoading } from "./pay-split-equal.loading";
import type { GroupPaymentState } from "./pay-split-equal.types";
import {
	calculateAmountForGroup,
	calculateAmountPerGroup,
} from "./pay-split-equal.utils";

interface PaySplitEqualContentProps {
	tableId: string;
	numberOfGroups: number;
}

export function PaySplitEqualContent({
	tableId,
	numberOfGroups,
}: PaySplitEqualContentProps) {
	const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
	const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
	const [groupsPaymentState, setGroupsPaymentState] =
		useState<GroupPaymentState>({});

	const { data, isLoading, error } = useQuery({
		...trpc.orders.getByTableId.queryOptions({
			tableId: tableId || "",
		}),
		enabled: !!tableId,
	});

	if (isLoading) {
		return <PaySplitEqualLoading />;
	}

	if (error) {
		return (
			<PaySplitEqualError
				title="Por partes iguales"
				message={`Error al cargar el pedido: ${error.message}`}
			/>
		);
	}

	if (!data || !data.order) {
		return (
			<PaySplitEqualError
				title="Por partes iguales"
				message={`No se encontró un pedido para la mesa: ${tableId}`}
			/>
		);
	}

	const { order, items } = data;
	const total = calculateTotal(items);
	const amountPerGroup = calculateAmountPerGroup(total, numberOfGroups);

	const handleGroupPayClick = (groupId: number) => {
		setSelectedGroupId(groupId);
		setIsPaymentModalOpen(true);
	};

	const handlePaymentUpdate = (paymentState: PaymentState) => {
		if (selectedGroupId !== null) {
			setGroupsPaymentState((prev) => {
				const currentState = prev[selectedGroupId] || {
					cashPaid: 0,
					cardPaid: 0,
				};
				return {
					...prev,
					[selectedGroupId]: {
						cashPaid: currentState.cashPaid + paymentState.cashPaid,
						cardPaid: currentState.cardPaid + paymentState.cardPaid,
					},
				};
			});
		}
	};

	const getGroupPaymentState = (): PaymentState => {
		if (selectedGroupId === null) {
			return { cashPaid: 0, cardPaid: 0 };
		}
		return groupsPaymentState[selectedGroupId] || { cashPaid: 0, cardPaid: 0 };
	};

	const getGroupTotal = (): number => {
		if (selectedGroupId === null) return 0;
		return calculateAmountForGroup(total, numberOfGroups, selectedGroupId);
	};

	return (
		<div className="flex h-full flex-col overflow-hidden">
			<div className="shrink-0 px-4 pt-6 pb-4">
				<PaySplitEqualHeader
					tableId={tableId}
					total={total}
					currency={order.currency}
					numberOfGroups={numberOfGroups}
					groupsPaymentState={groupsPaymentState}
				/>
			</div>

			<div className="grid min-h-0 flex-1 grid-cols-1 gap-6 overflow-hidden px-4 pb-6 lg:grid-cols-2">
				<PaySplitEqualItems items={items} currency={order.currency} />

				<PaySplitEqualGroups
					numberOfGroups={numberOfGroups}
					amountPerGroup={amountPerGroup}
					total={total}
					currency={order.currency}
					groupsPaymentState={groupsPaymentState}
					onGroupPayClick={handleGroupPayClick}
				/>
			</div>

			{selectedGroupId !== null && (
				<PaymentModal
					open={isPaymentModalOpen}
					onOpenChange={(open) => {
						setIsPaymentModalOpen(open);
						if (!open) {
							setSelectedGroupId(null);
						}
					}}
					total={getGroupTotal()}
					currency={order.currency}
					initialPaymentState={getGroupPaymentState()}
					onPaymentUpdate={handlePaymentUpdate}
				/>
			)}
		</div>
	);
}
