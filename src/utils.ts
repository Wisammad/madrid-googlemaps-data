import * as fs from "fs";
import * as path from "path";
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';

/**
 * Read data from a CSV file and convert to objects
 */
export function readFromCSV<T>(filename: string): T[] {
	if (!fs.existsSync(filename)) {
		return [];
	}

	const csvData = fs.readFileSync(filename, "utf-8");

	const records = parse(csvData, {
		columns: true,
		skip_empty_lines: true,
		cast: true,
		trim: true
	});

	return records as T[];
}

/**
 * Write data to a CSV file
 */
export function writeToCSV<T extends Record<string, any>>(
	data: T[],
	filename: string
): void {
	if (data.length === 0) {
		console.log(`No data to write to ${filename}`);
		return;
	}

	const csvString = stringify(data, {
		header: true,
		quoted: true,
		quoted_empty: true
	});

	const dir = path.dirname(filename);
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}

	fs.writeFileSync(filename, csvString);
	console.log(`Data written to ${filename} (${data.length} rows)`);
}
