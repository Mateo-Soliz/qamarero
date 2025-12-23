import { relations } from "drizzle-orm";
import {
	decimal,
	index,
	integer,
	pgTable,
	serial,
	text,
} from "drizzle-orm/pg-core";

/**
 * Tabla de mesas del restaurante
 */
export const table = pgTable("restaurant_table", {
	id: text("id").primaryKey(), // Ej: "MESA-18"
	name: text("name").notNull(), // Ej: "Terraza Norte"
	server: text("server"), // Ej: "Lucía"
});

/**
 * Tabla de pedidos (orders) asociados a una mesa
 */
export const order = pgTable(
	"order",
	{
		id: serial("id").primaryKey(),
		tableId: text("table_id")
			.notNull()
			.references(() => table.id, { onDelete: "cascade" }),
		currency: text("currency").default("EUR").notNull(), // EUR, USD, etc.
	},
	(table) => [index("order_tableId_idx").on(table.tableId)],
);

/**
 * Tabla de items del pedido
 */
export const orderItem = pgTable(
	"order_item",
	{
		id: serial("id").primaryKey(),
		orderId: integer("order_id")
			.notNull()
			.references(() => order.id, { onDelete: "cascade" }),
		itemId: text("item_id").notNull(), // ID del item en el sistema (ej: "I1")
		name: text("name").notNull(), // Nombre del item
		quantity: integer("quantity").default(1).notNull(), // qty
		unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
		notes: text("notes"), // Notas adicionales del item (opcional)
	},
	(table) => [
		index("orderItem_orderId_idx").on(table.orderId),
		index("orderItem_itemId_idx").on(table.itemId),
	],
);

// ==================== RELACIONES ====================

export const tableRelations = relations(table, ({ many }) => ({
	orders: many(order),
}));

export const orderRelations = relations(order, ({ one, many }) => ({
	table: one(table, {
		fields: [order.tableId],
		references: [table.id],
	}),
	items: many(orderItem),
}));

export const orderItemRelations = relations(orderItem, ({ one }) => ({
	order: one(order, {
		fields: [orderItem.orderId],
		references: [order.id],
	}),
}));
