import type { PaymentState } from "@/components/dialogs/payment-modal/payment-modal.types";

export interface OrderItem {
	id: number;
	name: string;
	quantity: number;
	unitPrice: number;
	notes: string | null;
}

export interface OrderData {
	order: {
		id: number;
		tableId: string;
		currency: string;
	};
	items: OrderItem[];
}

export interface PayAllProps {
	tableId: string;
	orderData: OrderData;
	paymentState: PaymentState;
	onPaymentStateChange: (state: PaymentState) => void;
	onOpenPaymentModal: () => void;
}
