import { paymentOptions } from "./table-select-payment.constants";
import type { PaymentOption } from "./table-select-payment.types";

interface TableSelectPaymentDialogContentProps {
	selectedOption: PaymentOption;
	onSelectOption: (option: PaymentOption) => void;
}

export function TableSelectPaymentDialogContent({
	selectedOption,
	onSelectOption,
}: TableSelectPaymentDialogContentProps) {
	return (
		<div className="grid grid-cols-3 gap-4 py-4">
			{paymentOptions.map((option) => {
				const Icon = option.icon;
				const isSelected = selectedOption === option.id;

				return (
					<button
						key={option.id}
						type="button"
						onClick={() => onSelectOption(option.id)}
						className={`relative flex aspect-square flex-col items-center justify-center gap-3 rounded-lg border-2 p-6 transition-all duration-200 ${
							isSelected
								? "scale-105 border-primary bg-primary/10 shadow-md"
								: "border-gray-200 bg-white hover:border-primary/50 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800"
						}
            `}
					>
						<div
							className={`rounded-full p-4 ${
								isSelected
									? "bg-primary text-primary-foreground"
									: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
							}
              `}
						>
							<Icon className="h-8 w-8" />
						</div>
						<div className="text-center">
							<h3
								className={`font-semibold text-sm ${
									isSelected
										? "text-primary"
										: "text-gray-900 dark:text-gray-100"
								}`}
							>
								{option.title}
							</h3>
							<p className="mt-1 text-gray-500 text-xs dark:text-gray-400">
								{option.description}
							</p>
						</div>
						{isSelected && (
							<div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
								<div className="h-2 w-2 rounded-full bg-white" />
							</div>
						)}
					</button>
				);
			})}
		</div>
	);
}
