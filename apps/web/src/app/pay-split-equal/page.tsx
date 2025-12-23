"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { PaySplitEqualError } from "@/components/pay-split-equal/pay-split-equal.error";
import { PaySplitEqualContent } from "@/components/pay-split-equal/pay-split-equal.index";

function PaySplitEqualPageContent() {
	const searchParams = useSearchParams();
	const tableId = searchParams.get("tableId");
	const groupsParam = searchParams.get("groups");
	const numberOfGroups = groupsParam ? Number.parseInt(groupsParam, 10) : null;

	if (!tableId) {
		return (
			<PaySplitEqualError
				title="Por partes iguales"
				message="Error: No se proporcionó el ID de la mesa."
			/>
		);
	}

	if (!numberOfGroups || numberOfGroups <= 0) {
		return (
			<PaySplitEqualError
				title="Por partes iguales"
				message="Error: No se proporcionó el número de grupos o es inválido."
			/>
		);
	}

	return (
		<PaySplitEqualContent tableId={tableId} numberOfGroups={numberOfGroups} />
	);
}

export default function PaySplitEqualPage() {
	return (
		<div className="h-full overflow-hidden">
			<Suspense fallback={<div>Cargando...</div>}>
				<PaySplitEqualPageContent />
			</Suspense>
		</div>
	);
}
