import type { OrderItem } from "../pay-all/pay-all.types";
import type {
	CustomGroup,
	ItemAssignmentQuantities,
	ItemGroupAssignment,
	ItemGroupQuantities,
} from "./pay-customize.types";

/**
 * Obtiene la cantidad de asignación de un item (por defecto 1)
 */
export function getItemAssignmentQuantity(
	itemId: string,
	quantities: ItemAssignmentQuantities,
): number {
	return quantities[itemId] ?? 1;
}

/**
 * Calcula cuántas unidades de un item están asignadas a un grupo específico
 */
export function getItemQuantityInGroup(
	itemId: string,
	groupId: string,
	groupQuantities: ItemGroupQuantities = {},
): number {
	return groupQuantities[itemId]?.[groupId] ?? 0;
}

/**
 * Calcula cuántas unidades de un item ya están asignadas a grupos
 */
export function getItemAssignedQuantity(
	itemId: string,
	groupQuantities: ItemGroupQuantities = {},
): number {
	const itemGroups = groupQuantities[itemId];
	if (!itemGroups) return 0;

	return Object.values(itemGroups).reduce((sum, qty) => sum + qty, 0);
}

/**
 * Calcula el precio de un item para un grupo específico
 */
export function getItemPricePerGroup(
	item: OrderItem,
	groupId: string,
	groupQuantities: ItemGroupQuantities = {},
): number {
	const quantityInGroup = getItemQuantityInGroup(
		item.id.toString(),
		groupId,
		groupQuantities,
	);
	if (quantityInGroup === 0) return 0;

	return Number((quantityInGroup * item.unitPrice).toFixed(2));
}

/**
 * Calcula el total de un grupo considerando productos compartidos
 */
export function calculateGroupTotal(
	group: CustomGroup,
	items: OrderItem[],
	groupQuantities: ItemGroupQuantities = {},
): number {
	let total = 0;

	group.itemIds.forEach((itemId) => {
		const item = items.find((i) => i.id.toString() === itemId);
		if (!item) return;

		const pricePerGroup = getItemPricePerGroup(item, group.id, groupQuantities);
		total += pricePerGroup;
	});

	return Number(total.toFixed(2));
}

/**
 * Asigna items a grupos con sus cantidades
 */
export function assignItemsToGroups(
	itemIds: string[],
	groupIds: string[],
	assignmentQuantity: number,
	currentAssignments: ItemGroupAssignment,
	currentGroupQuantities: ItemGroupQuantities = {},
): {
	assignments: ItemGroupAssignment;
	groupQuantities: ItemGroupQuantities;
} {
	const newAssignments = { ...currentAssignments };
	const newGroupQuantities: ItemGroupQuantities = JSON.parse(
		JSON.stringify(currentGroupQuantities),
	);

	// Distribuir la cantidad entre los grupos seleccionados
	const quantityPerGroup = assignmentQuantity / groupIds.length;

	itemIds.forEach((itemId) => {
		const currentGroups = newAssignments[itemId] || [];
		// Agregar grupos que no estén ya asignados
		const newGroups = groupIds.filter((gId) => !currentGroups.includes(gId));
		newAssignments[itemId] = [...currentGroups, ...newGroups];

		// Inicializar estructura si no existe
		if (!newGroupQuantities[itemId]) {
			newGroupQuantities[itemId] = {};
		}

		// Asignar cantidad a cada grupo
		groupIds.forEach((groupId) => {
			const currentQty = newGroupQuantities[itemId][groupId] || 0;
			newGroupQuantities[itemId][groupId] = currentQty + quantityPerGroup;
		});
	});

	return {
		assignments: newAssignments,
		groupQuantities: newGroupQuantities,
	};
}

/**
 * Remueve un item de un grupo específico
 */
export function removeItemFromGroup(
	itemId: string,
	groupId: string,
	currentAssignments: ItemGroupAssignment,
	currentGroupQuantities: ItemGroupQuantities = {},
): {
	assignments: ItemGroupAssignment;
	groupQuantities: ItemGroupQuantities;
} {
	const newAssignments = { ...currentAssignments };
	const newGroupQuantities: ItemGroupQuantities = JSON.parse(
		JSON.stringify(currentGroupQuantities),
	);

	if (newAssignments[itemId]) {
		newAssignments[itemId] = newAssignments[itemId].filter(
			(gId) => gId !== groupId,
		);
		// Si no quedan grupos, eliminar la entrada
		if (newAssignments[itemId].length === 0) {
			delete newAssignments[itemId];
		}
	}

	// Remover cantidad del grupo
	if (newGroupQuantities[itemId]?.[groupId]) {
		delete newGroupQuantities[itemId][groupId];
		// Si no quedan grupos para este item, eliminar la entrada
		if (Object.keys(newGroupQuantities[itemId]).length === 0) {
			delete newGroupQuantities[itemId];
		}
	}

	return {
		assignments: newAssignments,
		groupQuantities: newGroupQuantities,
	};
}

/**
 * Obtiene el número de grupos que comparten un item
 */
export function getItemGroupCount(
	itemId: string,
	assignments: ItemGroupAssignment,
): number {
	return assignments[itemId]?.length || 0;
}

/**
 * Crea un nuevo grupo con nombre por defecto
 */
export function createNewGroup(existingGroups: CustomGroup[]): CustomGroup {
	const groupNumber = existingGroups.length + 1;
	return {
		id: `group-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
		name: `Grupo ${groupNumber}`,
		itemIds: [],
		paymentState: {
			cashPaid: 0,
			cardPaid: 0,
		},
	};
}
