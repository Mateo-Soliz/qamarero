export type PaymentStatus = "pagado" | "no pagado" | "parcial";
export type PaymentMethod = "cash" | "card" | null;

export interface PaymentState {
	cashPaid: number;
	cardPaid: number;
}
