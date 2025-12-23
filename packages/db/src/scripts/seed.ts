import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { Pool } from "pg";
import { fileURLToPath } from "url";
import { order, orderItem, table } from "../schema";

// Configurar dotenv
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({
	path: join(__dirname, "../../../../apps/web/.env"),
});

// Leer el archivo JSON
const seedDataPath = join(__dirname, "seed-data.json");
const seedData = JSON.parse(readFileSync(seedDataPath, "utf-8"));

// Crear conexión a la base de datos
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function seed() {
	try {
		console.log("🌱 Iniciando inserción de datos...");

		// 1. Insertar o actualizar la mesa
		console.log("📋 Insertando mesa:", seedData.table.name);
		await db
			.insert(table)
			.values({
				id: seedData.table.id,
				name: seedData.table.name,
				server: seedData.table.server || null,
			})
			.onConflictDoUpdate({
				target: table.id,
				set: {
					name: seedData.table.name,
					server: seedData.table.server || null,
				},
			});

		// 2. Insertar el pedido
		console.log("🛒 Creando pedido...");
		const [newOrder] = await db
			.insert(order)
			.values({
				tableId: seedData.table.id,
				currency: seedData.currency,
			})
			.returning();

		if (!newOrder) {
			throw new Error("No se pudo crear el pedido");
		}

		console.log(`✅ Pedido creado con ID: ${newOrder.id}`);

		// 3. Insertar los items del pedido
		console.log(`📦 Insertando ${seedData.items.length} items...`);
		const itemsToInsert = seedData.items.map((item) => ({
			orderId: newOrder.id,
			itemId: item.id,
			name: item.name,
			quantity: item.qty,
			unitPrice: item.unitPrice.toString(),
			notes: item.notes || null,
		}));

		await db.insert(orderItem).values(itemsToInsert);

		console.log("✅ Todos los items insertados correctamente");

		// 4. Mostrar resumen
		const totalItems = seedData.items.length;
		const totalAmount = seedData.items.reduce(
			(sum, item) => sum + item.qty * item.unitPrice,
			0,
		);

		console.log("\n📊 Resumen del pedido:");
		console.log(`   Mesa: ${seedData.table.name} (${seedData.table.id})`);
		console.log(`   Camarero: ${seedData.table.server || "N/A"}`);
		console.log(`   Total items: ${totalItems}`);
		console.log(`   Total: ${totalAmount.toFixed(2)} ${seedData.currency}`);
		console.log("\n✨ Datos insertados correctamente!");

		await pool.end();
	} catch (error) {
		console.error("❌ Error al insertar datos:", error);
		await pool.end();
		process.exit(1);
	}
}

seed();
