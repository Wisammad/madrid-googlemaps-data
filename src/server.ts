import express from "express";
import * as fs from "fs";
import * as path from "path";
import { readFromCSV } from "./utils";
import { Lead } from "./types";

const app = express();
const PORT = 3000;
const DATA_DIR = path.join(__dirname, "..", "data");

app.get("/api/sectors", (_req, res) => {
	try {
		if (!fs.existsSync(DATA_DIR)) {
			return res.json([]);
		}
		const sectors = fs
			.readdirSync(DATA_DIR)
			.filter((f) => f.endsWith(".csv"))
			.map((f) => f.replace(".csv", ""));
		res.json(sectors);
	} catch (err) {
		res.status(500).json({ error: "Failed to list sectors" });
	}
});

app.get("/api/leads/:sector", (req, res) => {
	try {
		const sector = req.params.sector;
		const filePath = path.join(DATA_DIR, `${sector}.csv`);

		if (!fs.existsSync(filePath)) {
			return res.status(404).json({ error: "Sector not found" });
		}

		const leads = readFromCSV<Lead>(filePath);
		res.json(leads);
	} catch (err) {
		res.status(500).json({ error: "Failed to read leads" });
	}
});

app.get("/", (_req, res) => {
	res.sendFile(path.join(__dirname, "viewer.html"));
});

app.listen(PORT, () => {
	console.log(`Leads viewer running at http://localhost:${PORT}`);
});
