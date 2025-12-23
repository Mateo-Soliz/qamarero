import type { PaymentState } from "@/components/dialogs/payment-modal/payment-modal.types";

export interface GroupPaymentState {
	[groupId: number]: PaymentState;
}

export interface Group {
	id: number;
	name: string;
	amount: number;
	paymentState: PaymentState;
}
