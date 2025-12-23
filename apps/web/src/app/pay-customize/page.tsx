"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { PayCustomizeError } from "@/components/pay-customize/pay-customize.error";
import { PayCustomizeContent } from "@/components/pay-customize/pay-customize.index";

function PayCustomizePageContent() {
	const searchParams = useSearchParams();
	const tableId = searchParams.get("tableId");

	if (!tableId) {
		return (
			<PayCustomizeError
				title="Personalizar"
				message="Error: No se proporcionó el ID de la mesa."
			/>
		);
	}

	return <PayCustomizeContent tableId={tableId} />;
}

export default function PayCustomizePage() {
	return (
		<div className="h-full overflow-hidden">
			<Suspense fallback={<div>Cargando...</div>}>
				<PayCustomizePageContent />
			</Suspense>
		</div>
	);
}
