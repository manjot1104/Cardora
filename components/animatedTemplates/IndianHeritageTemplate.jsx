'use client';

export default function IndianHeritageTemplate({ data }) {
  const groomName = data.groomName || 'Groom';
  const brideName = data.brideName || 'Bride';
  const weddingDate = data.weddingDate || 'Date TBA';
  const venue = data.venue || 'Venue TBA';

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-orange-50 to-yellow-50">
      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center relative overflow-hidden">
        <div 
          className="absolute inset-0 parallax-bg bg-cover bg-center"
          style={{
            backgroundImage: `url(${data.backgroundImage || '/images/wedding-backgrounds/traditional-wedding-couple.jpg'})`,
          }}
        >
          <div className="absolute inset-0 bg-red-900/50"></div>
        </div>

        <div className="relative z-10 text-center backdrop-blur-md bg-red-900/40 p-12 rounded-2xl border-4 border-yellow-400">
          <div className="text-6xl mb-4 fade-up">🕉️</div>
          <h1 className="text-6xl font-serif text-white mb-4 fade-up drop-shadow-2xl">
            {groomName} & {brideName}
          </h1>
          <p className="text-2xl text-yellow-200 mb-2 fade-up">Are getting married</p>
          <p className="text-xl text-yellow-100 fade-up">{weddingDate}</p>
        </div>
      </section>

      {/* Story Section */}
      <section className="min-h-screen flex flex-col justify-center items-center px-6 py-20 text-center bg-white/90">
        <h2 className="text-5xl font-serif text-red-900 mb-8 fade-up">Our Story</h2>
        <p className="max-w-2xl text-lg text-gray-700 leading-relaxed fade-up">
          {data.story || 'Two souls. One destiny. A love written in the stars and sealed with forever.'}
        </p>
      </section>

      {/* Event Details */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 py-20 bg-gradient-to-b from-red-50 to-orange-50">
        <h2 className="text-5xl font-serif text-red-900 mb-12 fade-up">Wedding Ceremony</h2>
        <div className="space-y-6 fade-up">
          <div className="text-2xl text-gray-800">
            <span className="text-3xl mr-2">📍</span>
            {venue}
          </div>
          <div className="text-2xl text-gray-800">
            <span className="text-3xl mr-2">🕕</span>
            {data.weddingTime || '6:00 PM onwards'}
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section className="h-screen flex flex-col justify-center items-center bg-red-900/10">
        <h2 className="text-4xl font-serif text-red-900 mb-8 fade-up">Will you join us?</h2>
        <button className="px-12 py-4 bg-red-600 text-white rounded-full text-xl font-semibold hover:bg-red-700 transition-all transform hover:scale-105 shadow-xl fade-up">
          Confirm Attendance
        </button>
      </section>
    </div>
  );
}
