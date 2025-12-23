export type PaymentOption = "all" | "split-equal" | "customize" | null;

export interface PaymentOptionData {
	id: PaymentOption;
	title: string;
	description: string;
	icon: React.ComponentType<{ className?: string }>;
	route: string;
}

export interface TableSelectPaymentDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	tableId: string;
}
