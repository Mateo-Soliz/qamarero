import { paymentOptions } from "./table-select-payment.constants";
import type {
	PaymentOption,
	PaymentOptionData,
} from "./table-select-payment.types";

export function getPaymentOptionById(
	id: PaymentOption,
): PaymentOptionData | undefined {
	return paymentOptions.find((option) => option.id === id);
}

export function getPaymentRouteById(id: PaymentOption): string | null {
	const option = getPaymentOptionById(id);
	return option?.route ?? null;
}
