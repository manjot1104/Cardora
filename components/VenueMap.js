'use client';

export default function VenueMap({ venue, templateColors }) {
  // Encode venue name for URL
  const encodedVenue = encodeURIComponent(venue || '');

  // Google Maps API key (optional - can be set via environment variable)
  // Note: Google Maps Embed API requires an API key for production use
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  // Google Maps search URL (works without API key)
  const googleMapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodedVenue}`;
  
  // Google Maps embed URL (requires API key)
  const googleMapsEmbedUrl = googleMapsApiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${googleMapsApiKey}&q=${encodedVenue}`
    : null;

  // Open Google Maps in a new tab
  const openGoogleMaps = () => {
    window.open(googleMapsSearchUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full mt-4">
      <div className="w-full rounded-lg overflow-hidden shadow-lg border-2" style={{ borderColor: templateColors?.accent }}>
        {googleMapsEmbedUrl ? (
          <iframe
            width="100%"
            height="300"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={googleMapsEmbedUrl}
            title={`Map location for ${venue}`}
          />
        ) : (
          <div className="h-[300px] flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
            <div className="text-4xl mb-3">🗺️</div>
            <p className="text-gray-700 dark:text-gray-300 mb-2 font-semibold">Venue: {venue}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center px-4 mb-4">
              Click the button below to search for this venue on Google Maps
            </p>
          </div>
        )}
        <div className="p-3 bg-white/90 dark:bg-gray-900/90">
          <button
            onClick={openGoogleMaps}
            className="w-full px-4 py-2 rounded-lg font-semibold text-white hover:shadow-lg transform hover:scale-105 transition-all text-sm"
            style={{
              background: `linear-gradient(135deg, ${templateColors?.primary || '#4285f4'} 0%, ${templateColors?.accent || '#34a853'} 100%)`,
            }}
          >
            Open in Google Maps →
          </button>
        </div>
      </div>
    </div>
  );
}
