import { Area } from "./config";
import { Lead } from "./types";

const NEARBY_SEARCH_URL = "https://places.googleapis.com/v1/places:searchNearby";

interface NearbySearchResponse {
	places?: NearbyPlace[];
}

interface NearbyPlace {
	id?: string;
	displayName?: { text?: string };
	formattedAddress?: string;
	nationalPhoneNumber?: string;
	websiteUri?: string;
	reviews?: unknown[];
	rating?: number;
	userRatingCount?: number;
	primaryTypeDisplayName?: { text?: string };
	googleMapsUri?: string;
}

/**
 * Search for places in an area using the Nearby Search (New) API.
 * Returns only places that have reviews or a phone number but NO website.
 */
export async function searchNearbyPlaces(
	apiKey: string,
	sector: string,
	area: Area
): Promise<Lead[]> {
	const body = {
		includedTypes: [sector],
		maxResultCount: 20,
		locationRestriction: {
			circle: {
				center: { latitude: area.lat, longitude: area.lng },
				radius: area.radius,
			},
		},
	};

	const fieldMask = [
		"places.id",
		"places.displayName",
		"places.formattedAddress",
		"places.nationalPhoneNumber",
		"places.websiteUri",
		"places.reviews",
		"places.rating",
		"places.userRatingCount",
		"places.primaryTypeDisplayName",
		"places.googleMapsUri",
	].join(",");

	const response = await fetch(NEARBY_SEARCH_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"X-Goog-Api-Key": apiKey,
			"X-Goog-FieldMask": fieldMask,
		},
		body: JSON.stringify(body),
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Nearby Search failed (${response.status}): ${errorText}`);
	}

	const data: NearbySearchResponse = await response.json();
	const places = data.places || [];

	// Filter: keep places WITHOUT a website that HAVE reviews or a phone number
	const leads: Lead[] = [];
	for (const place of places) {
		if (place.websiteUri) continue; // skip places that already have a website

		const hasReviews = place.reviews && place.reviews.length > 0;
		const hasPhone = !!place.nationalPhoneNumber;

		if (!hasReviews && !hasPhone) continue; // skip places with neither

		leads.push({
			place_id: place.id || "",
			name: place.displayName?.text || "",
			address: place.formattedAddress || "",
			phone: place.nationalPhoneNumber || "",
			rating: place.rating || 0,
			review_count: place.userRatingCount || 0,
			primary_type: place.primaryTypeDisplayName?.text || "",
			sector,
			area: area.name,
			google_maps_url: place.googleMapsUri || "",
		});
	}

	return leads;
}

/**
 * Collect leads for a sector across all areas with deduplication.
 */
export async function collectLeadsForSector(
	apiKey: string,
	sector: string,
	areas: Area[],
	existingIds: Set<string> = new Set()
): Promise<Lead[]> {
	const seenIds = new Set<string>(existingIds);
	const leads: Lead[] = [];

	for (const area of areas) {
		console.log(`  Searching ${sector} in ${area.name}...`);

		try {
			const results = await searchNearbyPlaces(apiKey, sector, area);
			let newCount = 0;

			for (const lead of results) {
				if (seenIds.has(lead.place_id)) continue;
				seenIds.add(lead.place_id);
				leads.push(lead);
				newCount++;
			}

			console.log(`    Found ${results.length} results, ${newCount} new leads (no website)`);

			// Rate limit between area requests
			await new Promise((resolve) => setTimeout(resolve, 500));
		} catch (error) {
			console.error(`    Error searching ${area.name}:`, error);
			await new Promise((resolve) => setTimeout(resolve, 2000));
		}
	}

	return leads;
}
