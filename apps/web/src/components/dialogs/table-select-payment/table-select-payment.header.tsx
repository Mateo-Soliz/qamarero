interface TableSelectPaymentDialogHeaderProps {
	tableId: string;
}

export function TableSelectPaymentDialogHeader({
	tableId,
}: TableSelectPaymentDialogHeaderProps) {
	return (
		<div className="flex flex-col gap-2">
			<h2 className="font-semibold text-xl leading-none">
				Seleccionar método de pago
			</h2>
			<p className="text-gray-600 text-sm dark:text-gray-400">
				Elige cómo deseas dividir el pago para la mesa {tableId}
			</p>
		</div>
	);
}
