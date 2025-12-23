import type { PaymentState } from "@/components/dialogs/payment-modal/payment-modal.types";

export interface CustomGroup {
	id: string; // UUID o timestamp
	name: string;
	itemIds: string[]; // IDs de productos asignados
	paymentState: PaymentState;
}

export interface ItemGroupAssignment {
	[itemId: string]: string[]; // itemId -> array de groupIds que lo comparten
}

export interface ItemAssignmentQuantities {
	[itemId: string]: number; // itemId -> cantidad a asignar (por defecto 1)
}

// Rastrea cuántas unidades de cada item están asignadas a cada grupo
export interface ItemGroupQuantities {
	[itemId: string]: {
		[groupId: string]: number; // cantidad de unidades en ese grupo
	};
}

export interface CustomGroupState {
	groups: CustomGroup[];
	itemAssignments: ItemGroupAssignment;
	selectedItems: string[]; // Para selección múltiple
	itemQuantities: ItemAssignmentQuantities;
	itemGroupQuantities: ItemGroupQuantities;
}
