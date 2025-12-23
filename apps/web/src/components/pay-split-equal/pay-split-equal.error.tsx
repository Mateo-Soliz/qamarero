interface PaySplitEqualErrorProps {
	title: string;
	message: string;
}

export function PaySplitEqualError({
	title,
	message,
}: PaySplitEqualErrorProps) {
	return (
		<main className="container mx-auto max-w-4xl px-4 py-6">
			<div className="space-y-4">
				<h1 className="font-bold text-2xl">{title}</h1>
				<p className="text-red-600 dark:text-red-400">{message}</p>
			</div>
		</main>
	);
}
