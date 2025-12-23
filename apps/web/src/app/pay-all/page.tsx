"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { PayAllError } from "@/components/pay-all/pay-all.error";
import { PayAllContent } from "@/components/pay-all/pay-all.index";

function PayAllPageContent() {
	const searchParams = useSearchParams();
	const tableId = searchParams.get("tableId");

	if (!tableId) {
		return (
			<PayAllError
				title="Pagar todo de una"
				message="Error: No se proporcionó el ID de la mesa."
			/>
		);
	}

	return <PayAllContent tableId={tableId} />;
}

export default function PayAllPage() {
	return (
		<Suspense fallback={<div>Cargando...</div>}>
			<PayAllPageContent />
		</Suspense>
	);
}
