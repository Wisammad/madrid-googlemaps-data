import * as dotenv from "dotenv";
import { config } from "./config";
import { collectLeadsForSector } from "./places";
import { readFromCSV, writeToCSV } from "./utils";
import { Lead } from "./types";

dotenv.config();

const PLACES_API_KEY = process.env.PLACES_API_KEY;
if (!PLACES_API_KEY) {
	throw Error("No Google Maps API key set. Add PLACES_API_KEY to .env");
}

async function main() {
	const apiKey = PLACES_API_KEY as string;
	const dataDir = "./data";

	console.log(`Searching ${config.sectors.length} sectors across ${config.areas.length} areas in Madrid...\n`);

	for (const sector of config.sectors) {
		console.log(`\n--- Sector: ${sector} ---`);

		// Load existing leads for this sector to avoid duplicates
		const csvPath = `${dataDir}/${sector}.csv`;
		const existing = readFromCSV<Lead>(csvPath);
		const existingIds = new Set(existing.map((l) => l.place_id));

		if (existing.length > 0) {
			console.log(`  Loaded ${existing.length} existing leads`);
		}

		const newLeads = await collectLeadsForSector(
			apiKey,
			sector,
			config.areas,
			existingIds
		);

		const allLeads = [...existing, ...newLeads];
		writeToCSV(allLeads, csvPath);

		console.log(`  Total for ${sector}: ${allLeads.length} leads (${newLeads.length} new)`);
	}

	console.log("\nDone! Check the data/ directory for CSV files.");
}

main().catch(console.error);
