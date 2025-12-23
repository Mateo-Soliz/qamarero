import { Trash2, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import type { OrderItem } from "../pay-all/pay-all.types";
import { calculateGroupPaymentStatus } from "../pay-split-equal/pay-split-equal.utils";
import {
	getGroupMethodBadges,
	getGroupStatusBadge,
} from "./pay-customize.mappers";
import type {
	CustomGroup,
	ItemGroupAssignment,
	ItemGroupQuantities,
} from "./pay-customize.types";
import {
	calculateGroupTotal,
	getItemPricePerGroup,
	getItemQuantityInGroup,
} from "./pay-customize.utils";

interface PayCustomizeGroupsProps {
	groups: CustomGroup[];
	items: OrderItem[];
	currency: string;
	itemAssignments: ItemGroupAssignment;
	itemGroupQuantities: ItemGroupQuantities;
	onGroupPayClick: (groupId: string) => void;
	onDeleteGroup: (groupId: string) => void;
}

export function PayCustomizeGroups({
	groups,
	items,
	currency,
	itemAssignments,
	itemGroupQuantities,
	onGroupPayClick,
	onDeleteGroup,
}: PayCustomizeGroupsProps) {
	const formatCurrency = (value: number) => {
		return `${value.toFixed(2)} ${currency}`;
	};

	return (
		<Card className="flex h-full flex-col overflow-hidden rounded-lg">
			<CardHeader className="shrink-0">
				<CardTitle>Grupos</CardTitle>
				<CardDescription>
					{groups.length} {groups.length === 1 ? "grupo" : "grupos"} creado
					{groups.length === 1 ? "" : "s"}
				</CardDescription>
			</CardHeader>
			<CardContent className="min-h-0 flex-1 overflow-y-auto">
				<div className="space-y-4">
					{groups.length === 0 ? (
						<div className="py-8 text-center">
							<p className="text-muted-foreground">
								No hay grupos creados. Crea un grupo para comenzar.
							</p>
						</div>
					) : (
						groups.map((group) => {
							const groupTotal = calculateGroupTotal(
								group,
								items,
								itemGroupQuantities,
							);
							const {
								totalPaid,
								totalRemaining,
								isFullyPaid,
								isPartiallyPaid,
								isNotPaid,
							} = calculateGroupPaymentStatus(group.paymentState, groupTotal);

							const statusBadge = getGroupStatusBadge({
								isFullyPaid,
								isPartiallyPaid,
								isNotPaid,
							});

							const methodBadges = getGroupMethodBadges(group.paymentState);

							// Obtener items asignados a este grupo
							const groupItems = group.itemIds
								.map((itemId) =>
									items.find((item) => item.id.toString() === itemId),
								)
								.filter((item): item is OrderItem => item !== undefined);

							return (
								<div
									key={group.id}
									className="flex gap-4 rounded-lg border border-transparent bg-muted/30 p-4 transition-colors hover:border-border hover:bg-muted/50"
								>
									<div className="shrink-0 pt-1">
										<div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
											<Users className="h-4 w-4 text-primary" />
										</div>
									</div>
									<div className="min-w-0 flex-1">
										<div className="flex items-start justify-between gap-4">
											<div className="flex-1">
												<div className="mb-2 flex items-center gap-2">
													<h3 className="font-semibold text-base text-foreground">
														{group.name}
													</h3>
													{statusBadge}
													<Button
														variant="ghost"
														size="icon"
														className="h-6 w-6 text-destructive hover:bg-destructive/10 hover:text-destructive"
														onClick={() => onDeleteGroup(group.id)}
														title="Eliminar grupo"
													>
														<Trash2 className="h-3 w-3" />
													</Button>
												</div>
												<div className="space-y-2 text-sm">
													{groupItems.length > 0 ? (
														<div className="space-y-1">
															{groupItems.map((item) => {
																const itemId = item.id.toString();
																const quantityInGroup = getItemQuantityInGroup(
																	itemId,
																	group.id,
																	itemGroupQuantities,
																);
																const pricePerGroup = getItemPricePerGroup(
																	item,
																	group.id,
																	itemGroupQuantities,
																);
																const isShared =
																	(itemAssignments[itemId]?.length || 0) > 1;
																const showPartialQuantity =
																	quantityInGroup < item.quantity;

																return (
																	<div
																		key={item.id}
																		className="flex items-center justify-between rounded bg-background/50 p-2 text-xs"
																	>
																		<div className="min-w-0 flex-1">
																			<div className="truncate font-medium">
																				{item.name}
																			</div>
																			<div className="mt-0.5 flex items-center gap-2">
																				{showPartialQuantity && (
																					<span className="text-muted-foreground text-xs">
																						{quantityInGroup.toFixed(2)} de{" "}
																						{item.quantity}
																					</span>
																				)}
																				{isShared && (
																					<span className="text-muted-foreground text-xs">
																						{showPartialQuantity && " • "}
																						Compartido
																					</span>
																				)}
																			</div>
																		</div>
																		<div className="ml-2 shrink-0 font-medium">
																			{formatCurrency(pricePerGroup)}
																		</div>
																	</div>
																);
															})}
														</div>
													) : (
														<p className="text-muted-foreground text-xs">
															Sin items asignados
														</p>
													)}
													<div className="space-y-1 border-t pt-2">
														<div className="flex items-center gap-2">
															<span className="text-muted-foreground">
																Total a pagar:
															</span>
															<span className="font-medium">
																{formatCurrency(groupTotal)}
															</span>
														</div>
														{totalPaid > 0 && (
															<div className="flex items-center gap-2">
																<span className="text-muted-foreground">
																	Pagado:
																</span>
																<span className="font-medium text-green-600 dark:text-green-400">
																	{formatCurrency(totalPaid)}
																</span>
															</div>
														)}
														{totalRemaining > 0 && (
															<div className="flex items-center gap-2">
																<span className="text-muted-foreground">
																	Pendiente:
																</span>
																<span className="font-medium text-orange-600 dark:text-orange-400">
																	{formatCurrency(totalRemaining)}
																</span>
															</div>
														)}
														{methodBadges && (
															<div className="mt-2 flex items-center gap-2">
																{methodBadges}
															</div>
														)}
													</div>
												</div>
											</div>
											<div className="shrink-0">
												<Button
													onClick={() => onGroupPayClick(group.id)}
													disabled={isFullyPaid || groupTotal === 0}
													size="sm"
												>
													{isFullyPaid ? "Pagado" : "Pagar"}
												</Button>
											</div>
										</div>
									</div>
								</div>
							);
						})
					)}
				</div>
			</CardContent>
		</Card>
	);
}
