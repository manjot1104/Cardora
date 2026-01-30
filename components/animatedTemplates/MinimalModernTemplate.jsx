'use client';

export default function MinimalModernTemplate({ data }) {
  const groomName = data.groomName || 'Groom';
  const brideName = data.brideName || 'Bride';
  const weddingDate = data.weddingDate || 'Date TBA';
  const venue = data.venue || 'Venue TBA';

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-7xl font-light text-gray-900 mb-4 fade-up">
            {groomName} & {brideName}
          </h1>
          <div className="w-24 h-0.5 bg-gray-400 mx-auto mb-4 fade-up"></div>
          <p className="text-xl text-gray-600 mb-2 fade-up">Are getting married</p>
          <p className="text-lg text-gray-500 fade-up">{weddingDate}</p>
        </div>
      </section>

      {/* Story Section */}
      <section className="min-h-screen flex flex-col justify-center items-center px-6 py-20 text-center bg-gray-50">
        <h2 className="text-4xl font-light text-gray-900 mb-8 fade-up">Our Story</h2>
        <p className="max-w-2xl text-lg text-gray-600 leading-relaxed fade-up">
          {data.story || 'Two souls. One destiny. A love written in the stars and sealed with forever.'}
        </p>
      </section>

      {/* Event Details */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 py-20">
        <h2 className="text-4xl font-light text-gray-900 mb-12 fade-up">Wedding Ceremony</h2>
        <div className="space-y-6 fade-up">
          <div className="text-xl text-gray-700">
            <span className="mr-2">📍</span>
            {venue}
          </div>
          <div className="text-xl text-gray-700">
            <span className="mr-2">🕕</span>
            {data.weddingTime || '6:00 PM onwards'}
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section className="h-screen flex flex-col justify-center items-center bg-gray-50">
        <h2 className="text-3xl font-light text-gray-900 mb-8 fade-up">Will you join us?</h2>
        <button className="px-12 py-4 bg-gray-900 text-white rounded-full text-lg font-light hover:bg-gray-800 transition-all transform hover:scale-105 fade-up">
          Confirm Attendance
        </button>
      </section>
    </div>
  );
}
