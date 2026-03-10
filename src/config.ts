export interface Area {
	name: string;
	lat: number;
	lng: number;
	radius: number; // meters
}

export interface Config {
	sectors: string[];
	areas: Area[];
}

/**
 * Sectors prioritized for “low/no-website” local businesses (trade services + small retail).
 * Place Types reference: https://developers.google.com/maps/documentation/places/web-service/place-types
 */
export const config: Config = {
	sectors: [
		// Trades & local services
		"locksmith",
		"plumber",
		"electrician",
		"painter",
		"roofing_contractor",
		"moving_company",
		"laundry",
		"tailor",

		// Automotive
		"car_repair",
		"tire_shop",
		"car_wash",
		"auto_parts_store",

		// Small retail commonly under-digitized
		"hardware_store",
		"building_materials_store",
		"home_improvement_store",
		"butcher_shop",
		"bakery",
		"florist",
		"shoe_store",
		"bicycle_store",
		"convenience_store",
		"clothing_store",
		"pet_store",

		// Personal care (often social-only / no site)
		"barber_shop",
		"beauty_salon",
		"hair_salon",
	],

	// All 21 districts (distritos) of the Municipality of Madrid
	areas: [
		{ name: "Centro", lat: 40.417321, lng: -3.705279, radius: 2049 },
		{ name: "Arganzuela", lat: 40.398021, lng: -3.696815, radius: 3136 },
		{ name: "Retiro", lat: 40.411231, lng: -3.67656, radius: 2199 },
		{ name: "Salamanca", lat: 40.430194, lng: -3.673801, radius: 2331 },
		{ name: "Chamartín", lat: 40.457487, lng: -3.678122, radius: 3282 },
		{ name: "Tetuán", lat: 40.460635, lng: -3.699996, radius: 2157 },
		{ name: "Chamberí", lat: 40.437565, lng: -3.70352, radius: 2059 },
		{ name: "Fuencarral - El Pardo", lat: 40.544788, lng: -3.753651, radius: 14523 },
		{ name: "Moncloa - Aravaca", lat: 40.445423, lng: -3.757213, radius: 8021 },
		{ name: "Latina", lat: 40.38518, lng: -3.778689, radius: 6249 },
		{ name: "Carabanchel", lat: 40.378872, lng: -3.737093, radius: 3914 },
		{ name: "Usera", lat: 40.375942, lng: -3.703005, radius: 2716 },
		{ name: "Puente de Vallecas", lat: 40.383565, lng: -3.659776, radius: 3609 },
		{ name: "Moratalaz", lat: 40.406646, lng: -3.641362, radius: 2320 },
		{ name: "Ciudad Lineal", lat: 40.439291, lng: -3.649985, radius: 5659 },
		{ name: "Hortaleza", lat: 40.482294, lng: -3.637391, radius: 4709 },
		{ name: "Villaverde", lat: 40.342503, lng: -3.695035, radius: 3820 },
		{ name: "Villa de Vallecas", lat: 40.349924, lng: -3.616054, radius: 6024 },
		{ name: "Vicálvaro", lat: 40.394275, lng: -3.572746, radius: 5135 },
		{ name: "San Blas - Canillejas", lat: 40.43466, lng: -3.598669, radius: 6172 },
		{ name: "Barajas", lat: 40.475583, lng: -3.574599, radius: 5142 },
	],
};