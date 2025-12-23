interface PaymentModalHeaderProps {
	total: number;
	currency: string;
	totalPaid: number;
}

export function PaymentModalHeader({
	total,
	currency,
	totalPaid,
}: PaymentModalHeaderProps) {
	const formatCurrency = (value: number) => {
		return `${value.toFixed(2)} ${currency}`;
	};

	const totalRemaining = total - totalPaid;

	return (
		<div className="flex flex-col gap-2">
			<h2 className="font-semibold text-xl leading-none">Realizar Pago</h2>
			<p className="text-gray-600 text-sm dark:text-gray-400">
				Selecciona el método de pago y el monto a pagar.
			</p>
			<div className="mt-2 rounded-lg border bg-muted/50 p-4">
				<div className="mb-2 flex items-center justify-between">
					<div className="text-muted-foreground text-sm">Total del pedido:</div>
					<div className="font-bold text-lg">{formatCurrency(total)}</div>
				</div>
				{totalPaid > 0 && (
					<div className="mb-2 flex items-center justify-between">
						<div className="text-muted-foreground text-sm">Ya pagado:</div>
						<div className="font-medium text-green-600 text-sm dark:text-green-400">
							{formatCurrency(totalPaid)}
						</div>
					</div>
				)}
				<div className="flex items-center justify-between border-t pt-2">
					<div className="font-medium text-sm">Pendiente:</div>
					<div className="font-bold text-lg text-orange-600 dark:text-orange-400">
						{formatCurrency(totalRemaining)}
					</div>
				</div>
			</div>
		</div>
	);
}
