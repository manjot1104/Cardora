'use client';

import { getTemplateById } from '@/lib/templates';
import { getSignatureTemplateById } from '@/lib/signatureTemplates';

export default function WeddingTemplate({ user, templateId, cardType = 'wedding' }) {
  // Get template data - check signature templates first, then regular templates
  const signatureTemplate = getSignatureTemplateById(templateId);
  const regularTemplate = getTemplateById(templateId);
  const template = signatureTemplate || regularTemplate;

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Template not found</p>
        </div>
      </div>
    );
  }

  // Extract user data with fallbacks
  const groomName = user?.groomName || user?.name?.split(' & ')[0] || 'John';
  const brideName = user?.brideName || user?.name?.split(' & ')[1] || user?.name?.split(' & ')[0] || 'Jane';
  const weddingDate = user?.weddingDate || user?.address || 'December 15, 2024';
  const venue = user?.venue || user?.company || 'Grand Ballroom';
  const brideFatherName = user?.brideFatherName || '';
  const brideMotherName = user?.brideMotherName || '';
  const groomFatherName = user?.groomFatherName || '';
  const groomMotherName = user?.groomMotherName || '';
  const deceasedElders = user?.deceasedElders || '';

  // Determine event type emoji and title
  const eventType = cardType || 'wedding';
  const eventEmoji = eventType === 'engagement' ? '💍' : eventType === 'anniversary' ? '🎉' : '💒';
  const eventTitle = eventType === 'engagement' ? 'Engagement' : eventType === 'anniversary' ? 'Anniversary' : 'Wedding';

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-8"
      style={{
        background: `linear-gradient(135deg, ${template.colors.secondary} 0%, ${template.colors.primary} 100%)`,
      }}
    >
      <div 
        className="w-full max-w-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border-4"
        style={{ borderColor: template.colors.accent }}
      >
        {/* Header Section */}
        <div 
          className="text-center py-8 sm:py-12 px-4 sm:px-6"
          style={{
            background: `linear-gradient(135deg, ${template.colors.primary} 0%, ${template.colors.accent} 100%)`,
          }}
        >
          <div className="text-6xl sm:text-7xl mb-4">{eventEmoji}</div>
          <h1 
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2"
            style={{ color: template.colors.text }}
          >
            {eventTitle} Invitation
          </h1>
          <div 
            className="text-xl sm:text-2xl md:text-3xl font-semibold mt-4"
            style={{ color: template.colors.text }}
          >
            {groomName} & {brideName}
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 sm:px-8 md:px-12 py-8 sm:py-12">
          {/* Date and Venue */}
          <div className="text-center mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📅</span>
                <p className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200">
                  {weddingDate}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">📍</span>
                <p className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200">
                  {venue}
                </p>
              </div>
            </div>
          </div>

          {/* Parents Information (Traditional Indian Style) */}
          {(brideFatherName || brideMotherName || groomFatherName || groomMotherName || deceasedElders) && (
            <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-6 mt-6">
              <div className="text-center space-y-3">
                {deceasedElders && (
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 italic">
                    {deceasedElders}
                  </p>
                )}
                
                {(brideFatherName || brideMotherName) && (
                  <div>
                    <p className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">
                      Bride's Parents
                    </p>
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                      {brideFatherName && brideMotherName 
                        ? `${brideFatherName} & ${brideMotherName}`
                        : brideFatherName || brideMotherName}
                    </p>
                  </div>
                )}

                {(groomFatherName || groomMotherName) && (
                  <div>
                    <p className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">
                      Groom's Parents
                    </p>
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                      {groomFatherName && groomMotherName 
                        ? `${groomFatherName} & ${groomMotherName}`
                        : groomFatherName || groomMotherName}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Decorative Divider */}
          <div className="flex items-center justify-center my-8">
            <div 
              className="h-1 w-24 rounded-full"
              style={{ backgroundColor: template.colors.accent }}
            ></div>
            <div 
              className="mx-4 text-2xl"
              style={{ color: template.colors.primary }}
            >
              ✨
            </div>
            <div 
              className="h-1 w-24 rounded-full"
              style={{ backgroundColor: template.colors.accent }}
            ></div>
          </div>

          {/* Invitation Message */}
          <div className="text-center">
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 italic mb-4">
              "You are cordially invited to celebrate this special day with us"
            </p>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              We look forward to sharing this joyous occasion with you
            </p>
          </div>
        </div>

        {/* Footer */}
        <div 
          className="text-center py-4 px-4"
          style={{
            background: `linear-gradient(135deg, ${template.colors.accent} 0%, ${template.colors.primary} 100%)`,
          }}
        >
          <p 
            className="text-sm font-semibold"
            style={{ color: template.colors.text }}
          >
            {template.name}
          </p>
        </div>
      </div>
    </div>
  );
}
