import { Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import {
	getGroupMethodBadges,
	getGroupStatusBadge,
} from "./pay-split-equal.mappers";
import type { GroupPaymentState } from "./pay-split-equal.types";
import {
	calculateAmountForGroup,
	calculateGroupPaymentStatus,
} from "./pay-split-equal.utils";

interface PaySplitEqualGroupsProps {
	numberOfGroups: number;
	amountPerGroup: number; // Mantenemos para compatibilidad, pero usaremos calculateAmountForGroup
	total: number; // Necesitamos el total para calcular correctamente
	currency: string;
	groupsPaymentState: GroupPaymentState;
	onGroupPayClick: (groupId: number) => void;
}

export function PaySplitEqualGroups({
	numberOfGroups,
	amountPerGroup,
	total,
	currency,
	groupsPaymentState,
	onGroupPayClick,
}: PaySplitEqualGroupsProps) {
	const formatCurrency = (value: number) => {
		return `${value.toFixed(2)} ${currency}`;
	};

	return (
		<Card className="flex h-full flex-col overflow-hidden rounded-lg">
			<CardHeader className="shrink-0">
				<CardTitle>Grupos</CardTitle>
				<CardDescription>
					{numberOfGroups} {numberOfGroups === 1 ? "grupo" : "grupos"} para
					dividir el pago
				</CardDescription>
			</CardHeader>
			<CardContent className="min-h-0 flex-1 overflow-y-auto">
				<div className="space-y-4">
					{Array.from({ length: numberOfGroups }, (_, index) => {
						const groupId = index + 1;
						const groupName = `Grupo ${groupId}`;
						const groupAmount = calculateAmountForGroup(
							total,
							numberOfGroups,
							groupId,
						);
						const paymentState = groupsPaymentState[groupId] || {
							cashPaid: 0,
							cardPaid: 0,
						};
						const {
							totalPaid,
							totalRemaining,
							isFullyPaid,
							isPartiallyPaid,
							isNotPaid,
						} = calculateGroupPaymentStatus(paymentState, groupAmount);

						const statusBadge = getGroupStatusBadge({
							isFullyPaid,
							isPartiallyPaid,
							isNotPaid,
						});

						const methodBadges = getGroupMethodBadges(paymentState);

						return (
							<div
								key={groupId}
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
													{groupName}
												</h3>
												{statusBadge}
											</div>
											<div className="space-y-1 text-sm">
												<div className="flex items-center gap-2">
													<span className="text-muted-foreground">
														A pagar:
													</span>
													<span className="font-medium">
														{formatCurrency(groupAmount)}
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
										<div className="shrink-0">
											<Button
												onClick={() => onGroupPayClick(groupId)}
												disabled={isFullyPaid}
												size="sm"
											>
												{isFullyPaid ? "Pagado" : "Pagar"}
											</Button>
										</div>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
}
