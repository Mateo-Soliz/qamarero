import { Circle } from "lucide-react";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import type { OrderItem } from "./pay-all.types";

interface PayAllOrderDetailProps {
	items: OrderItem[];
	currency: string;
}

export function PayAllOrderDetail({ items, currency }: PayAllOrderDetailProps) {
	return (
		<Card className="flex h-full flex-col overflow-hidden rounded-lg">
			<CardHeader className="shrink-0">
				<CardTitle>Detalle del Pedido</CardTitle>
				<CardDescription>Items incluidos en el pedido</CardDescription>
			</CardHeader>
			<CardContent className="min-h-0 flex-1 overflow-y-auto">
				<div className="space-y-4">
					{items.length === 0 ? (
						<div className="py-8 text-center">
							<p className="text-muted-foreground">
								No hay items en este pedido.
							</p>
						</div>
					) : (
						<div className="space-y-4">
							{items.map((item, index) => {
								const subtotal = item.quantity * item.unitPrice;
								return (
									<div
										key={item.id}
										className="flex gap-4 rounded-lg border border-transparent bg-muted/30 p-4 transition-colors hover:border-border hover:bg-muted/50"
									>
										<div className="shrink-0 pt-1">
											<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
												<span className="font-semibold text-primary text-xs">
													{index + 1}
												</span>
											</div>
										</div>
										<div className="min-w-0 flex-1">
											<div className="flex items-start justify-between gap-4">
												<div className="flex-1">
													<h3 className="font-semibold text-base text-foreground">
														{item.name}
													</h3>
													{item.notes && (
														<div className="mt-1.5 flex items-center gap-1.5">
															<Circle className="h-2 w-2 fill-current text-muted-foreground" />
															<span className="text-muted-foreground text-sm italic">
																{item.notes}
															</span>
														</div>
													)}
													<div className="mt-2 flex items-center gap-2 text-muted-foreground text-sm">
														<span className="rounded-md border border-border bg-background px-2 py-0.5 font-medium">
															{item.quantity}{" "}
															{item.quantity === 1 ? "unidad" : "unidades"}
														</span>
														<span className="text-muted-foreground/70">×</span>
														<span className="font-medium">
															{item.unitPrice.toFixed(2)} {currency}
														</span>
													</div>
												</div>
												<div className="shrink-0 text-right">
													<div className="font-bold text-foreground text-lg">
														{subtotal.toFixed(2)} {currency}
													</div>
													<div className="mt-0.5 text-muted-foreground text-xs">
														{item.unitPrice.toFixed(2)} c/u
													</div>
												</div>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
