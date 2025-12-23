import { CreditCard, Settings, Users } from "lucide-react";

import type { PaymentOptionData } from "./table-select-payment.types";

export const paymentOptions: PaymentOptionData[] = [
	{
		id: "all",
		title: "Pagar todo de una",
		description: "Un solo pago",
		icon: CreditCard,
		route: "/pay-all",
	},
	{
		id: "split-equal",
		title: "Por partes iguales",
		description: "Dividir equitativamente",
		icon: Users,
		route: "/pay-split-equal",
	},
	{
		id: "customize",
		title: "Personalizar",
		description: "Dividir manualmente",
		icon: Settings,
		route: "/pay-customize",
	},
];
