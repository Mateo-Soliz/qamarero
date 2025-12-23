"use client";

import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PaymentModalContent } from "./payment-modal.content";
import { PaymentModalFooter } from "./payment-modal.footer";
import { PaymentModalHeader } from "./payment-modal.header";
import type { PaymentMethod, PaymentState } from "./payment-modal.types";

interface PaymentModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	total: number;
	currency?: string;
	onPaymentUpdate?: (state: PaymentState) => void;
	initialPaymentState?: PaymentState;
}

export function PaymentModal({
	open,
	onOpenChange,
	total,
	currency = "EUR",
	onPaymentUpdate,
	initialPaymentState,
}: PaymentModalProps) {
	const [amount, setAmount] = useState<string>("");
	const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);
	// Estado local para rastrear pagos acumulados
	const [paymentState, setPaymentState] = useState<PaymentState>(
		initialPaymentState || { cashPaid: 0, cardPaid: 0 },
	);

	// Sincronizar estado inicial cuando cambia
	useEffect(() => {
		if (initialPaymentState) {
			setPaymentState(initialPaymentState);
		}
	}, [initialPaymentState]);

	// Resetear valores cuando se abre el modal (pero mantener el estado de pagos)
	useEffect(() => {
		if (open) {
			const currentState = initialPaymentState || paymentState;
			const totalPaid = currentState.cashPaid + currentState.cardPaid;
			const totalRemaining = total - totalPaid;
			setAmount(totalRemaining.toFixed(2));
			setSelectedMethod(null);
		}
	}, [open, total, initialPaymentState, paymentState]);

	// Prevenir scroll del body cuando el diálogo está abierto
	useEffect(() => {
		if (open) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);

	// Cerrar con Escape
	useEffect(() => {
		if (!open) return;

		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onOpenChange(false);
			}
		};

		document.addEventListener("keydown", handleEscape);
		return () => {
			document.removeEventListener("keydown", handleEscape);
		};
	}, [open, onOpenChange]);

	const amountValue = Number.parseFloat(amount) || total;
	const currentState = initialPaymentState || paymentState;
	const totalPaid = currentState.cashPaid + currentState.cardPaid;
	const totalRemaining = total - totalPaid;

	// Validar que el monto no exceda lo pendiente
	const isValidAmount = amountValue > 0 && amountValue <= totalRemaining;
	const hasMethodSelected = selectedMethod !== null;

	const handleConfirm = () => {
		if (!hasMethodSelected) {
			toast.error("Debes seleccionar un método de pago");
			return;
		}

		if (!isValidAmount) {
			toast.error(
				`El monto no puede exceder el total pendiente. Total pendiente: ${totalRemaining.toFixed(2)} ${currency}`,
			);
			return;
		}

		// Actualizar el estado de pagos acumulados según el método seleccionado
		const currentState = initialPaymentState || paymentState;
		const newPaymentState: PaymentState = { ...currentState };

		if (selectedMethod === "cash") {
			newPaymentState.cashPaid += amountValue;
		} else if (selectedMethod === "card") {
			newPaymentState.cardPaid += amountValue;
		}

		setPaymentState(newPaymentState);

		// Notificar al componente padre del cambio
		// Si hay initialPaymentState, enviamos solo el incremento
		// Si no, enviamos el estado completo (para compatibilidad con pay-all)
		if (onPaymentUpdate) {
			if (initialPaymentState) {
				// Para grupos: solo el incremento
				onPaymentUpdate({
					cashPaid: selectedMethod === "cash" ? amountValue : 0,
					cardPaid: selectedMethod === "card" ? amountValue : 0,
				});
			} else {
				// Para pay-all: estado completo
				onPaymentUpdate(newPaymentState);
			}
		}

		// Mostrar mensaje de éxito
		const methodName = selectedMethod === "cash" ? "efectivo" : "tarjeta";
		toast.success(
			`Pago realizado: ${amountValue.toFixed(2)} ${currency} en ${methodName}`,
		);

		// Si ya se pagó todo, resetear estado cuando se cierra completamente pagado
		const finalTotalPaid = newPaymentState.cashPaid + newPaymentState.cardPaid;
		if (finalTotalPaid >= total) {
			setTimeout(() => {
				setPaymentState({ cashPaid: 0, cardPaid: 0 });
				if (onPaymentUpdate) {
					onPaymentUpdate({ cashPaid: 0, cardPaid: 0 });
				}
			}, 100);
		}

		// Cerrar el modal después de cada confirmación de pago
		setTimeout(() => {
			onOpenChange(false);
		}, 500);
	};

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div
				className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
				onClick={() => onOpenChange(false)}
				aria-hidden="true"
			/>
			<div
				className="relative z-51 mx-4 flex w-full max-w-md flex-col gap-4 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900"
				onClick={(e) => e.stopPropagation()}
			>
				<Button
					type="button"
					onClick={() => onOpenChange(false)}
					variant="destructive"
					size="icon"
					className="absolute top-4 right-4 rounded-md p-2 transition-opacity focus:outline-none focus:ring-2 focus:ring-gray-400"
					aria-label="Cerrar"
				>
					<XIcon className="size-4" />
				</Button>

				<PaymentModalHeader
					total={total}
					currency={currency}
					totalPaid={totalPaid}
				/>
				<PaymentModalContent
					amount={amount}
					onAmountChange={setAmount}
					selectedMethod={selectedMethod}
					onMethodSelect={setSelectedMethod}
					total={total}
					totalRemaining={totalRemaining}
					currency={currency}
				/>
				<PaymentModalFooter
					isValid={hasMethodSelected && isValidAmount}
					onConfirm={handleConfirm}
					onCancel={() => onOpenChange(false)}
				/>
			</div>
		</div>
	);
}
