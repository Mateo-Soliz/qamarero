import { db } from "@qamarero/db";
import type { NextRequest } from "next/server";

export async function createContext(req: NextRequest) {
	// No auth configured
	return {
		session: null,
		db,
	};
}

export type Context = Awaited<ReturnType<typeof createContext>>;
