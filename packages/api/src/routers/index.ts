import { publicProcedure, router } from "../index";

import { ordersRouter } from "./orders";
import { tablesRouter } from "./tables";

export const appRouter = router({
	healthCheck: publicProcedure.query(() => {
		return "OK";
	}),
	tables: tablesRouter,
	orders: ordersRouter,
});
export type AppRouter = typeof appRouter;
