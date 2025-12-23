"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { PaymentModal } from "@/components/dialogs/payment-modal/payment-modal";
import type { PaymentState } from "@/components/dialogs/payment-modal/payment-modal.types";
import { trpc } from "@/utils/trpc";
import { calculateTotal } from "../pay-all/pay-all.utils";
import { PayCustomizeError } from "./pay-customize.error";
import { PayCustomizeGroups } from "./pay-customize.groups";
import { PayCustomizeHeader } from "./pay-customize.header";
import { PayCustomizeItems } from "./pay-customize.items";
import { PayCustomizeLoading } from "./pay-customize.loading";
import type {
	CustomGroup,
	ItemAssignmentQuantities,
	ItemGroupAssignment,
	ItemGroupQuantities,
} from "./pay-customize.types";
import {
	assignItemsToGroups,
	calculateGroupTotal,
	createNewGroup,
	getItemAssignedQuantity,
	removeItemFromGroup,
} from "./pay-customize.utils";
import { PayCustomizeAssignmentDialog } from "./pay-customize-assignment-dialog";

interface PayCustomizeContentProps {
	tableId: string;
}

export function PayCustomizeContent({ tableId }: PayCustomizeContentProps) {
	const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
	const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
	const [groups, setGroups] = useState<CustomGroup[]>([]);
	const [itemAssignments, setItemAssignments] = useState<ItemGroupAssignment>(
		{},
	);
	const [itemGroupQuantities, setItemGroupQuantities] =
		useState<ItemGroupQuantities>({});
	const [selectedItems, setSelectedItems] = useState<string[]>([]);
	const [itemQuantities, setItemQuantities] =
		useState<ItemAssignmentQuantities>({});
	const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = useState(false);

	const { data, isLoading, error } = useQuery({
		...trpc.orders.getByTableId.queryOptions({
			tableId: tableId || "",
		}),
		enabled: !!tableId,
	});

	if (isLoading) {
		return <PayCustomizeLoading />;
	}

	if (error) {
		return (
			<PayCustomizeError
				title="Personalizar"
				message={`Error al cargar el pedido: ${error.message}`}
			/>
		);
	}

	if (!data || !data.order) {
		return (
			<PayCustomizeError
				title="Personalizar"
				message={`No se encontró un pedido para la mesa: ${tableId}`}
			/>
		);
	}

	const { order, items } = data;
	const total = calculateTotal(items);

	const handleAddGroup = () => {
		const newGroup = createNewGroup(groups);
		setGroups((prev) => [...prev, newGroup]);
	};

	const handleDeleteGroup = (groupId: string) => {
		const group = groups.find((g) => g.id === groupId);
		if (!group) return;

		// Remover asignaciones de items de este grupo
		let newAssignments = { ...itemAssignments };
		let newGroupQuantities = { ...itemGroupQuantities };

		group.itemIds.forEach((itemId) => {
			const result = removeItemFromGroup(
				itemId,
				groupId,
				newAssignments,
				newGroupQuantities,
			);
			newAssignments = result.assignments;
			newGroupQuantities = result.groupQuantities;
		});

		setItemAssignments(newAssignments);
		setItemGroupQuantities(newGroupQuantities);
		setGroups((prev) => prev.filter((g) => g.id !== groupId));
	};

	const handleItemToggle = (itemId: string) => {
		const isCurrentlySelected = selectedItems.includes(itemId);

		setSelectedItems((prev) =>
			isCurrentlySelected
				? prev.filter((id) => id !== itemId)
				: [...prev, itemId],
		);

		// Inicializar cantidad si el item se selecciona por primera vez
		if (!isCurrentlySelected && !itemQuantities[itemId]) {
			const item = items.find((i) => i.id.toString() === itemId);
			if (item) {
				const assignedQuantity = getItemAssignedQuantity(
					itemId,
					itemGroupQuantities,
				);
				const availableQuantity = item.quantity - assignedQuantity;

				// Inicializar a 1 si hay unidades disponibles
				if (availableQuantity > 0) {
					setItemQuantities((prev) => ({
						...prev,
						[itemId]: 1,
					}));
				}
			}
		}
	};

	const handleAssignClick = () => {
		if (selectedItems.length === 0 || groups.length === 0) return;
		setIsAssignmentDialogOpen(true);
	};

	const handleAssignConfirm = (groupIds: string[]) => {
		// Asignar todos los items seleccionados a los grupos en una sola operación
		let newAssignments = { ...itemAssignments };
		let newGroupQuantities = { ...itemGroupQuantities };

		selectedItems.forEach((itemId) => {
			const assignmentQuantity = itemQuantities[itemId] ?? 1;
			const result = assignItemsToGroups(
				[itemId],
				groupIds,
				assignmentQuantity,
				newAssignments,
				newGroupQuantities,
			);
			newAssignments = result.assignments;
			newGroupQuantities = result.groupQuantities;
		});

		setItemAssignments(newAssignments);
		setItemGroupQuantities(newGroupQuantities);

		// Actualizar itemIds en los grupos
		setGroups((prev) =>
			prev.map((group) => {
				if (groupIds.includes(group.id)) {
					// Agregar items que no estén ya en el grupo
					const newItemIds = [...new Set([...group.itemIds, ...selectedItems])];
					return { ...group, itemIds: newItemIds };
				}
				return group;
			}),
		);

		// Limpiar selección y cantidades de asignación
		setSelectedItems([]);
		setItemQuantities((prev) => {
			const newQuantities = { ...prev };
			selectedItems.forEach((itemId) => {
				delete newQuantities[itemId];
			});
			return newQuantities;
		});
		setIsAssignmentDialogOpen(false);
	};

	const handleQuantityChange = (itemId: string, quantity: number) => {
		setItemQuantities((prev) => ({
			...prev,
			[itemId]: quantity,
		}));
	};

	const handleGroupPayClick = (groupId: string) => {
		setSelectedGroupId(groupId);
		setIsPaymentModalOpen(true);
	};

	const handlePaymentUpdate = (paymentState: PaymentState) => {
		if (selectedGroupId !== null) {
			setGroups((prev) =>
				prev.map((group) => {
					if (group.id === selectedGroupId) {
						const currentState = group.paymentState;
						return {
							...group,
							paymentState: {
								cashPaid: currentState.cashPaid + paymentState.cashPaid,
								cardPaid: currentState.cardPaid + paymentState.cardPaid,
							},
						};
					}
					return group;
				}),
			);
		}
	};

	const getGroupPaymentState = (): PaymentState => {
		if (selectedGroupId === null) {
			return { cashPaid: 0, cardPaid: 0 };
		}
		const group = groups.find((g) => g.id === selectedGroupId);
		return group?.paymentState || { cashPaid: 0, cardPaid: 0 };
	};

	const getGroupTotal = (): number => {
		if (selectedGroupId === null) return 0;
		const group = groups.find((g) => g.id === selectedGroupId);
		if (!group) return 0;

		return calculateGroupTotal(group, items, itemGroupQuantities);
	};

	return (
		<div className="flex h-full flex-col overflow-hidden">
			<div className="shrink-0 px-4 pt-6 pb-4">
				<PayCustomizeHeader
					tableId={tableId}
					total={total}
					currency={order.currency}
					groups={groups}
					onAddGroup={handleAddGroup}
				/>
			</div>

			<div className="grid min-h-0 flex-1 grid-cols-1 gap-6 overflow-hidden px-4 pb-6 lg:grid-cols-2">
				<PayCustomizeItems
					items={items}
					currency={order.currency}
					selectedItems={selectedItems}
					onItemToggle={handleItemToggle}
					itemAssignments={itemAssignments}
					onAssignClick={handleAssignClick}
					itemQuantities={itemQuantities}
					onQuantityChange={handleQuantityChange}
					itemGroupQuantities={itemGroupQuantities}
				/>

				<PayCustomizeGroups
					groups={groups}
					items={items}
					currency={order.currency}
					itemAssignments={itemAssignments}
					itemGroupQuantities={itemGroupQuantities}
					onGroupPayClick={handleGroupPayClick}
					onDeleteGroup={handleDeleteGroup}
				/>
			</div>

			<PayCustomizeAssignmentDialog
				open={isAssignmentDialogOpen}
				onOpenChange={setIsAssignmentDialogOpen}
				groups={groups}
				selectedItemIds={selectedItems}
				onConfirm={handleAssignConfirm}
			/>

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
