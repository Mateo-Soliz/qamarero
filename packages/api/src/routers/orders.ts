import { order, orderItem } from "@qamarero/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { publicProcedure, router } from "../index";

export const ordersRouter = router({
	getByTableId: publicProcedure
		.input(
			z.object({
				tableId: z.string(),
			}),
		)
		.query(async ({ ctx, input }) => {
			// Obtener el pedido activo de la mesa
			const [orderData] = await ctx.db
				.select()
				.from(order)
				.where(eq(order.tableId, input.tableId))
				.limit(1);

			if (!orderData) {
				return null;
			}

			// Obtener los items del pedido
			const items = await ctx.db
				.select()
				.from(orderItem)
				.where(eq(orderItem.orderId, orderData.id));

			return {
				order: {
					id: orderData.id,
					tableId: orderData.tableId,
					currency: orderData.currency,
				},
				items: items.map((item) => ({
					id: item.id,
					itemId: item.itemId,
					name: item.name,
					quantity: item.quantity,
					unitPrice: Number(item.unitPrice),
					notes: item.notes,
				})),
			};
		}),
});
