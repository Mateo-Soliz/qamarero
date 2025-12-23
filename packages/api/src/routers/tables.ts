import { table } from "@qamarero/db";
import { or, sql } from "drizzle-orm";
import { z } from "zod";

import { publicProcedure, router } from "../index";

export const tablesRouter = router({
	getAll: publicProcedure
		.input(
			z
				.object({
					search: z.string().optional(),
				})
				.optional(),
		)
		.query(async ({ ctx, input }) => {
			const searchQuery = input?.search?.trim();

			if (!searchQuery) {
				return await ctx.db.select().from(table);
			}

			// Filtrar por id o server usando ilike para búsqueda case-insensitive
			const searchPattern = `%${searchQuery}%`;
			const results = await ctx.db
				.select()
				.from(table)
				.where(
					or(
						sql`${table.id} ILIKE ${searchPattern}`,
						sql`${table.server} ILIKE ${searchPattern}`,
					),
				);

			return results;
		}),
});
