import { Circle, Minus, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

import type { OrderItem } from "../pay-all/pay-all.types";
import type {
	ItemAssignmentQuantities,
	ItemGroupAssignment,
	ItemGroupQuantities,
} from "./pay-customize.types";
import {
	getItemAssignedQuantity,
	getItemGroupCount,
} from "./pay-customize.utils";

interface PayCustomizeItemsProps {
	items: OrderItem[];
	currency: string;
	selectedItems: string[];
	onItemToggle: (itemId: string) => void;
	itemAssignments: ItemGroupAssignment;
	onAssignClick: () => void;
	itemQuantities: ItemAssignmentQuantities;
	onQuantityChange: (itemId: string, quantity: number) => void;
	itemGroupQuantities: ItemGroupQuantities;
}

export function PayCustomizeItems({
	items,
	currency,
	selectedItems,
	onItemToggle,
	itemAssignments,
	onAssignClick,
	itemQuantities,
	onQuantityChange,
	itemGroupQuantities,
}: PayCustomizeItemsProps) {
	const hasSelection = selectedItems.length > 0;

	return (
		<Card className="flex h-full flex-col overflow-hidden rounded-lg">
			<CardHeader className="shrink-0">
				<div className="flex items-center justify-between">
					<div>
						<CardTitle>Detalle del Pedido</CardTitle>
						<CardDescription>Items incluidos en el pedido</CardDescription>
					</div>
					{hasSelection && (
						<button
							onClick={onAssignClick}
							className="font-medium text-primary text-sm hover:underline"
						>
							Asignar a grupos ({selectedItems.length})
						</button>
					)}
				</div>
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
								const itemId = item.id.toString();
								const isSelected = selectedItems.includes(itemId);
								const groupCount = getItemGroupCount(itemId, itemAssignments);
								const assignedQuantity = getItemAssignedQuantity(
									itemId,
									itemGroupQuantities,
								);
								const availableQuantity = item.quantity - assignedQuantity;
								const assignmentQuantity = itemQuantities[itemId] ?? 1;
								const showQuantityControl = isSelected && availableQuantity > 0;
								const isFullyAssigned = availableQuantity === 0;

								return (
									<div
										key={item.id}
										className={`flex gap-4 rounded-lg border border-transparent bg-muted/30 p-4 transition-colors hover:border-border hover:bg-muted/50 ${
											isFullyAssigned ? "opacity-60" : ""
										}`}
									>
										<div className="shrink-0 pt-1">
											<Checkbox
												checked={isSelected}
												onCheckedChange={() => onItemToggle(itemId)}
												disabled={isFullyAssigned}
												className="mt-1"
											/>
										</div>
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
														{assignedQuantity > 0 && (
															<span className="text-muted-foreground text-xs">
																({assignedQuantity} asignada
																{assignedQuantity === 1 ? "" : "s"},{" "}
																{availableQuantity} disponible
																{availableQuantity === 1 ? "" : "s"})
															</span>
														)}
														<span className="text-muted-foreground/70">×</span>
														<span className="font-medium">
															{item.unitPrice.toFixed(2)} {currency}
														</span>
														{groupCount > 0 && (
															<div className="ml-2 flex items-center gap-1">
																<Users className="h-3 w-3 text-primary" />
																<span className="font-medium text-primary text-xs">
																	{groupCount}{" "}
																	{groupCount === 1 ? "grupo" : "grupos"}
																</span>
															</div>
														)}
													</div>
												</div>
												<div className="shrink-0 text-right">
													<div className="font-bold text-foreground text-lg">
														{subtotal.toFixed(2)} {currency}
													</div>
													<div className="mt-0.5 text-muted-foreground text-xs">
														{item.unitPrice.toFixed(2)} c/u
													</div>
													{showQuantityControl && (
														<div className="mt-2 flex items-center gap-2">
															<span className="text-muted-foreground text-xs">
																Cantidad a asignar:
															</span>
															<div className="flex items-center gap-1 rounded-md border border-border">
																<Button
																	type="button"
																	variant="ghost"
																	size="icon"
																	className="h-7 w-7"
																	onClick={() => {
																		const newQuantity = Math.max(
																			1,
																			assignmentQuantity - 1,
																		);
																		onQuantityChange(itemId, newQuantity);
																	}}
																	disabled={assignmentQuantity <= 1}
																>
																	<Minus className="h-3 w-3" />
																</Button>
																<span className="w-8 text-center font-medium text-sm">
																	{assignmentQuantity}
																</span>
																<Button
																	type="button"
																	variant="ghost"
																	size="icon"
																	className="h-7 w-7"
																	onClick={() => {
																		const newQuantity = Math.min(
																			availableQuantity,
																			assignmentQuantity + 1,
																		);
																		onQuantityChange(itemId, newQuantity);
																	}}
																	disabled={
																		assignmentQuantity >= availableQuantity
																	}
																>
																	<Plus className="h-3 w-3" />
																</Button>
															</div>
														</div>
													)}
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
