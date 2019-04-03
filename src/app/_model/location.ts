export interface Location {
    ip: string;
    city?: string;
    region?: string;
    regionCode?: string;
    country?: string;
    countryName?: string;
    continentCode?: string;
    inEu: boolean;
    codePostal?: string;
    latitude?: number;
    longitude?: number;
    timeZone?: string;
    utcOffset?: string;
    countryCallingCode?: string;
    currency?: string;
    languages?: string;
    asn?: string;
}
