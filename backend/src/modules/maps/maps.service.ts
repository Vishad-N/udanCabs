import { Injectable, Logger } from '@nestjs/common';
import { AutocompleteQueryDto, GeocodeQueryDto, RouteQueryDto } from './dto/maps.dto';

interface PlaceSuggestion {
  description: string;
  placeId: string;
  lat: number;
  lng: number;
}

const UJJAIN_LANDMARKS: PlaceSuggestion[] = [
  { description: 'Mahakaleshwar Jyotirlinga, Jaisinghpura, Ujjain', placeId: 'ujn_mahakal', lat: 23.1827, lng: 75.7682 },
  { description: 'Ujjain Railway Station (UJN), Malviya Nagar, Ujjain', placeId: 'ujn_station', lat: 23.1821, lng: 75.7766 },
  { description: 'Ram Ghat, Kshipra River Bank, Ujjain', placeId: 'ujn_ramghat', lat: 23.1895, lng: 75.7645 },
  { description: 'Kal Bhairav Temple, Bhairavgarh, Ujjain', placeId: 'ujn_kalbhairav', lat: 23.2137, lng: 75.7762 },
  { description: 'Mangalnath Temple, Mangalnath Marg, Ujjain', placeId: 'ujn_mangal', lat: 23.2105, lng: 75.7801 },
  { description: 'Sandipani Ashram, Ankpat Marg, Ujjain', placeId: 'ujn_sandipani', lat: 23.2012, lng: 75.7831 },
  { description: 'Harsiddhi Mata Temple, Rudrasagar, Ujjain', placeId: 'ujn_harsiddhi', lat: 23.1834, lng: 75.7659 },
  { description: 'ISKCON Temple, Bharatpuri, Ujjain', placeId: 'ujn_iskcon', lat: 23.1612, lng: 75.8021 },
  { description: 'Jantar Mantar (Vedh Shala), Jaisinghpura, Ujjain', placeId: 'ujn_jantar', lat: 23.1702, lng: 75.7725 },
  { description: 'Gadkalika Temple, Bhartrihari Caves, Ujjain', placeId: 'ujn_gadkalika', lat: 23.2150, lng: 75.7835 },
  { description: 'Nanakheda Bus Stand, Indore Road, Ujjain', placeId: 'ujn_busstand', lat: 23.1601, lng: 75.7899 },
  { description: 'Omkareshwar Jyotirlinga Temple, Mandhata Island, MP', placeId: 'mp_omkareshwar', lat: 22.2472, lng: 76.1517 },
  { description: 'Devi Ahilyabai Holkar Airport (IDR), Indore, MP', placeId: 'mp_indore_airport', lat: 22.7217, lng: 75.8011 },
  { description: 'Indore City Centre / Railway Station, Indore, MP', placeId: 'mp_indore_city', lat: 22.7196, lng: 75.8577 },
];

@Injectable()
export class MapsService {
  private readonly logger = new Logger(MapsService.name);
  private readonly apiKey = process.env.GOOGLE_MAPS_API_KEY;

  async autocomplete(query: AutocompleteQueryDto) {
    const input = query.input.trim().toLowerCase();

    if (this.apiKey) {
      try {
        const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          query.input,
        )}&components=country:in&location=23.1827,75.7682&radius=50000&key=${this.apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.status === 'OK' && data.predictions) {
          return {
            success: true,
            source: 'google',
            data: data.predictions.map((p: any) => ({
              description: p.description,
              placeId: p.place_id,
            })),
          };
        }
      } catch (error) {
        this.logger.warn(`Google Places API error: ${error.message}. Using Ujjain fallback.`);
      }
    }

    // Ujjain Fallback Autocomplete
    const matches = UJJAIN_LANDMARKS.filter(
      (l) => l.description.toLowerCase().includes(input) || input.length <= 1,
    ).slice(0, 8);

    return {
      success: true,
      source: 'fallback_engine',
      data: matches.map((m) => ({
        description: m.description,
        placeId: m.placeId,
        lat: m.lat,
        lng: m.lng,
      })),
    };
  }

  async geocode(query: GeocodeQueryDto) {
    if (this.apiKey) {
      try {
        let url = '';
        if (query.address) {
          url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query.address)}&key=${this.apiKey}`;
        } else if (query.lat !== undefined && query.lng !== undefined) {
          url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${query.lat},${query.lng}&key=${this.apiKey}`;
        }
        if (url) {
          const res = await fetch(url);
          const data = await res.json();
          if (data.status === 'OK' && data.results && data.results.length > 0) {
            const first = data.results[0];
            return {
              success: true,
              source: 'google',
              data: {
                address: first.formatted_address,
                lat: first.geometry.location.lat,
                lng: first.geometry.location.lng,
              },
            };
          }
        }
      } catch (error) {
        this.logger.warn(`Google Geocode API error: ${error.message}. Using fallback.`);
      }
    }

    // Fallback Geocoding
    if (query.address) {
      const addr = query.address;
      const match = UJJAIN_LANDMARKS.find((l) =>
        l.description.toLowerCase().includes(addr.toLowerCase().substring(0, 10)),
      ) || UJJAIN_LANDMARKS[0];
      return {
        success: true,
        source: 'fallback_engine',
        data: {
          address: addr || match.description,
          lat: match.lat,
          lng: match.lng,
        },
      };
    }

    if (query.lat !== undefined && query.lng !== undefined) {
      // Find closest landmark
      let closest = UJJAIN_LANDMARKS[0];
      let minDist = Infinity;
      for (const l of UJJAIN_LANDMARKS) {
        const d = Math.hypot(l.lat - query.lat, l.lng - query.lng);
        if (d < minDist) {
          minDist = d;
          closest = l;
        }
      }
      return {
        success: true,
        source: 'fallback_engine',
        data: {
          address: closest.description,
          lat: query.lat,
          lng: query.lng,
        },
      };
    }

    return {
      success: true,
      source: 'fallback_engine',
      data: {
        address: UJJAIN_LANDMARKS[0].description,
        lat: UJJAIN_LANDMARKS[0].lat,
        lng: UJJAIN_LANDMARKS[0].lng,
      },
    };
  }

  async calculateRoute(query: RouteQueryDto) {
    if (this.apiKey) {
      try {
        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
          query.origin,
        )}&destination=${encodeURIComponent(query.destination)}&key=${this.apiKey}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.status === 'OK' && data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          const leg = route.legs[0];
          const distKm = parseFloat((leg.distance.value / 1000).toFixed(1));
          const durationMins = Math.ceil(leg.duration.value / 60);

          return {
            success: true,
            source: 'google',
            data: {
              origin: leg.start_address,
              destination: leg.end_address,
              originLat: leg.start_location.lat,
              originLng: leg.start_location.lng,
              destinationLat: leg.end_location.lat,
              destinationLng: leg.end_location.lng,
              distanceKm: distKm,
              durationText: `${durationMins} Minutes`,
              durationMinutes: durationMins,
              polyline: route.overview_polyline.points,
            },
          };
        }
      } catch (error) {
        this.logger.warn(`Google Directions API error: ${error.message}. Using fallback.`);
      }
    }

    // Ujjain Fallback Route Engine
    const originGeo = await this.geocode({ address: query.origin });
    const destGeo = await this.geocode({ address: query.destination });

    const oLat = originGeo.data.lat;
    const oLng = originGeo.data.lng;
    const dLat = destGeo.data.lat;
    const dLng = destGeo.data.lng;

    // Haversine distance calculation
    const R = 6371; // Earth radius in KM
    const dLatRad = ((dLat - oLat) * Math.PI) / 180;
    const dLngRad = ((dLng - oLng) * Math.PI) / 180;
    const a =
      Math.sin(dLatRad / 2) * Math.sin(dLatRad / 2) +
      Math.cos((oLat * Math.PI) / 180) *
        Math.cos((dLat * Math.PI) / 180) *
        Math.sin(dLngRad / 2) *
        Math.sin(dLngRad / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const straightDist = R * c;

    // Road distance factor (approx 1.35x straight line in Ujjain road network, min 2.5 KM)
    let roadDist = parseFloat((Math.max(2.5, straightDist * 1.35)).toFixed(1));
    if (query.origin.toLowerCase().includes('indore') || query.destination.toLowerCase().includes('indore')) {
      roadDist = Math.max(55.0, roadDist);
    } else if (query.origin.toLowerCase().includes('omkareshwar') || query.destination.toLowerCase().includes('omkareshwar')) {
      roadDist = Math.max(138.0, roadDist);
    }

    // Average travel time in Ujjain (~2.2 minutes per KM plus 5 mins traffic allowance)
    const durationMinutes = Math.round(roadDist * 2.2 + 5);

    // Simulated simple polyline string representing coordinates
    const simulatedPolyline = `enc_${oLat.toFixed(4)}_${oLng.toFixed(4)}_to_${dLat.toFixed(4)}_${dLng.toFixed(4)}`;

    return {
      success: true,
      source: 'fallback_engine',
      data: {
        origin: originGeo.data.address || query.origin,
        destination: destGeo.data.address || query.destination,
        originLat: oLat,
        originLng: oLng,
        destinationLat: dLat,
        destinationLng: dLng,
        distanceKm: roadDist,
        durationText: `${durationMinutes} Minutes`,
        durationMinutes: durationMinutes,
        polyline: simulatedPolyline,
      },
    };
  }
}
