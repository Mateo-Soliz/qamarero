import { Banknote, CreditCard } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { PaymentMethod } from "./payment-modal.types";

interface PaymentMethodCardProps {
	title: string;
	icon: React.ComponentType<{ className?: string }>;
	isSelected: boolean;
	onClick: () => void;
}

function PaymentMethodCard({
	title,
	icon: Icon,
	isSelected,
	onClick,
}: PaymentMethodCardProps) {
	return (
		<Card
			className={`cursor-pointer transition-all ${
				isSelected ? "bg-primary/5 ring-2 ring-primary" : "hover:bg-muted/50"
			}`}
			onClick={onClick}
		>
			<CardContent className="flex flex-col items-center justify-center gap-3 p-6">
				<div
					className={`rounded-full p-4 ${
						isSelected
							? "bg-primary text-primary-foreground"
							: "bg-muted text-muted-foreground"
					}`}
				>
					<Icon className="h-8 w-8" />
				</div>
				<span
					className={`font-medium ${
						isSelected ? "text-primary" : "text-foreground"
					}`}
				>
					{title}
				</span>
			</CardContent>
		</Card>
	);
}

interface PaymentModalContentProps {
	amount: string;
	onAmountChange: (value: string) => void;
	selectedMethod: PaymentMethod;
	onMethodSelect: (method: PaymentMethod) => void;
	total: number;
	totalRemaining: number;
	currency: string;
}

export function PaymentModalContent({
	amount,
	onAmountChange,
	selectedMethod,
	onMethodSelect,
	total,
	totalRemaining,
	currency,
}: PaymentModalContentProps) {
	const formatCurrency = (value: number) => {
		return `${value.toFixed(2)} ${currency}`;
	};

	const amountValue = Number.parseFloat(amount) || totalRemaining;

	return (
		<div className="space-y-4 py-4">
			<div className="space-y-2">
				<Label htmlFor="payment-amount">Monto a pagar ({currency})</Label>
				<Input
					id="payment-amount"
					type="number"
					step="0.01"
					min="0"
					max={totalRemaining}
					value={amount}
					onChange={(e) => {
						const value = e.target.value;
						const numValue = Number.parseFloat(value);
						if (value === "" || (numValue >= 0 && numValue <= totalRemaining)) {
							onAmountChange(value);
						}
					}}
					placeholder={totalRemaining.toFixed(2)}
				/>
				<div className="text-muted-foreground text-xs">
					{amountValue > 0 && amountValue !== totalRemaining && (
						<span>
							Pagarás {formatCurrency(amountValue)} de{" "}
							{formatCurrency(totalRemaining)} pendiente
						</span>
					)}
					{(!amount || Number.parseFloat(amount) === totalRemaining) && (
						<span>
							Pendiente: {formatCurrency(totalRemaining)} de{" "}
							{formatCurrency(total)} total
						</span>
					)}
				</div>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<PaymentMethodCard
					title="Efectivo"
					icon={Banknote}
					isSelected={selectedMethod === "cash"}
					onClick={() =>
						onMethodSelect(selectedMethod === "cash" ? null : "cash")
					}
				/>
				<PaymentMethodCard
					title="Tarjeta"
					icon={CreditCard}
					isSelected={selectedMethod === "card"}
					onClick={() =>
						onMethodSelect(selectedMethod === "card" ? null : "card")
					}
				/>
			</div>
		</div>
	);
}
