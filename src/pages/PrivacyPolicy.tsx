import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Shield } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

const PrivacyPolicy = () => {
  const { t, isRTL } = useTranslations();

  const currentDate = new Date().toLocaleDateString(isRTL ? 'he-IL' : 'en-US', {
    year: 'numeric',
    month: isRTL ? 'long' : 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link 
          to="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
        >
          <ArrowLeft className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t('pp.backToHome')}
        </Link>

        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardContent className="p-8 md:p-12">
            <div className="flex items-center justify-center mb-8">
              <Shield className="h-16 w-16 text-blue-600" />
            </div>
            
            <h1 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t('pp.title')}
            </h1>
            
            <p className="text-center text-gray-600 mb-8">
              {t('pp.subtitle')}
            </p>

            <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-green-800 text-sm">
                  <strong>{t('pp.lastUpdated')}</strong> {currentDate} | 
                  <strong>{t('pp.effectiveFrom')}</strong> {t('pp.fromFirstUse')}
                </p>
              </div>

              {/* Introduction */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('pp.intro.title')}</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t('pp.intro.content')}
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p><strong>{t('pp.intro.companyDetails')}</strong></p>
                  <p>{t('pp.intro.company')}</p>
                  <p>{t('pp.intro.email')}</p>
                  <p>{t('pp.intro.website')}</p>
                </div>
              </section>

              {/* Data Collection */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('pp.collection.title')}</h2>
                <p className="text-gray-700 mb-3">
                  {t('pp.collection.intro')}
                </p>
                
                <div className="space-y-4">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('pp.collection.personal.title')}</h3>
                    <ul className={`list-disc ${isRTL ? 'pr-6' : 'pl-6'} space-y-2 text-gray-700`}>
                      <li>{t('pp.collection.personal.fullName')}</li>
                      <li>{t('pp.collection.personal.email')}</li>
                      <li>{t('pp.collection.personal.phone')}</li>
                      <li>{t('pp.collection.personal.account')}</li>
                    </ul>
                  </div>

                  {/* Social Media Information */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('pp.collection.social.title')}</h3>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="text-blue-900 font-semibold mb-2">{t('pp.collection.social.intro')}</p>
                      <ul className={`list-disc ${isRTL ? 'pr-6' : 'pl-6'} space-y-1 text-blue-800 text-sm`}>
                        <li><strong>{t('pp.collection.social.publicName')}</strong> {t('pp.collection.social.publicNameDesc')}</li>
                        <li><strong>{t('pp.collection.social.emailTitle')}</strong> {t('pp.collection.social.emailDesc')}</li>
                        <li><strong>{t('pp.collection.social.profilePic')}</strong> {t('pp.collection.social.profilePicDesc')}</li>
                        <li><strong>{t('pp.collection.social.userId')}</strong> {t('pp.collection.social.userIdDesc')}</li>
                      </ul>
                      <p className="text-blue-700 text-xs mt-3">
                        <strong>{t('pp.collection.social.important')}</strong> {t('pp.collection.social.importantText')}
                      </p>
                    </div>
                  </div>

                  {/* Marketing Content */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('pp.collection.marketing.title')}</h3>
                    <ul className={`list-disc ${isRTL ? 'pr-6' : 'pl-6'} space-y-2 text-gray-700`}>
                      <li>{t('pp.collection.marketing.videos')}</li>
                      <li>{t('pp.collection.marketing.campaigns')}</li>
                      <li>{t('pp.collection.marketing.budgets')}</li>
                    </ul>
                  </div>

                  {/* Technical Information */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('pp.collection.technical.title')}</h3>
                    <ul className={`list-disc ${isRTL ? 'pr-6' : 'pl-6'} space-y-2 text-gray-700`}>
                      <li>{t('pp.collection.technical.ip')}</li>
                      <li>{t('pp.collection.technical.browser')}</li>
                      <li>{t('pp.collection.technical.usage')}</li>
                      <li>{t('pp.collection.technical.cookies')}</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* How We Use Data */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('pp.usage.title')}</h2>
                
                <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
                  <p className="text-green-900 font-semibold mb-2">{t('pp.usage.purposesTitle')}</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">{t('pp.usage.auth.title')}</h3>
                    <ul className={`list-disc ${isRTL ? 'pr-6' : 'pl-6'} space-y-1 text-gray-700 text-sm`}>
                      <li>{t('pp.usage.auth.create')}</li>
                      <li>{t('pp.usage.auth.verify')}</li>
                      <li>{t('pp.usage.auth.save')}</li>
                      <li>{t('pp.usage.auth.secure')}</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">{t('pp.usage.services.title')}</h3>
                    <ul className={`list-disc ${isRTL ? 'pr-6' : 'pl-6'} space-y-1 text-gray-700 text-sm`}>
                      <li>{t('pp.usage.services.provide')}</li>
                      <li>{t('pp.usage.services.create')}</li>
                      <li>{t('pp.usage.services.manage')}</li>
                      <li>{t('pp.usage.services.reports')}</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">{t('pp.usage.communication.title')}</h3>
                    <ul className={`list-disc ${isRTL ? 'pr-6' : 'pl-6'} space-y-1 text-gray-700 text-sm`}>
                      <li>{t('pp.usage.communication.updates')}</li>
                      <li>{t('pp.usage.communication.support')}</li>
                      <li>{t('pp.usage.communication.notify')}</li>
                      <li>{t('pp.usage.communication.important')}</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">{t('pp.usage.improvement.title')}</h3>
                    <ul className={`list-disc ${isRTL ? 'pr-6' : 'pl-6'} space-y-1 text-gray-700 text-sm`}>
                      <li>{t('pp.usage.improvement.improve')}</li>
                      <li>{t('pp.usage.improvement.develop')}</li>
                      <li>{t('pp.usage.improvement.analyze')}</li>
                      <li>{t('pp.usage.improvement.research')}</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">{t('pp.usage.security.title')}</h3>
                    <ul className={`list-disc ${isRTL ? 'pr-6' : 'pl-6'} space-y-1 text-gray-700 text-sm`}>
                      <li>{t('pp.usage.security.prevent')}</li>
                      <li>{t('pp.usage.security.protect')}</li>
                      <li>{t('pp.usage.security.comply')}</li>
                      <li>{t('pp.usage.security.defend')}</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mt-4">
                  <p className="text-yellow-900 text-sm">
                    <strong>{t('pp.usage.importantNote')}</strong> {t('pp.usage.importantText')}
                  </p>
                </div>
              </section>

              {/* Data Sharing */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('pp.sharing.title')}</h2>
                <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-4">
                  <p className="text-red-800 font-semibold text-lg">
                    {t('pp.sharing.noSell')}
                  </p>
                </div>
                
                <p className="text-gray-700 mb-3 font-semibold">{t('pp.sharing.mayShare')}</p>

                <div className="space-y-4">
                  {/* Service Providers */}
                  <div className={`border-${isRTL ? 'r' : 'l'}-4 border-blue-500 ${isRTL ? 'pr-4' : 'pl-4'}`}>
                    <h3 className="font-semibold text-gray-800 mb-2">{t('pp.sharing.providers.title')}</h3>
                    <p className="text-gray-700 text-sm mb-2">
                      {t('pp.sharing.providers.intro')}
                    </p>
                    <ul className={`list-disc ${isRTL ? 'pr-6' : 'pl-6'} space-y-1 text-gray-700 text-sm`}>
                      <li><strong>{t('pp.sharing.providers.firebase')}</strong> {t('pp.sharing.providers.firebaseDesc')}</li>
                      <li><strong>{t('pp.sharing.providers.mongodb')}</strong> {t('pp.sharing.providers.mongodbDesc')}</li>
                      <li><strong>{t('pp.sharing.providers.payment')}</strong> {t('pp.sharing.providers.paymentDesc')}</li>
                      <li><strong>{t('pp.sharing.providers.hosting')}</strong> {t('pp.sharing.providers.hostingDesc')}</li>
                    </ul>
                    <p className="text-xs text-gray-600 mt-2 italic">
                      {t('pp.sharing.providers.note')}
                    </p>
                  </div>

                  {/* Social Media Platforms */}
                  <div className={`border-${isRTL ? 'r' : 'l'}-4 border-purple-500 ${isRTL ? 'pr-4' : 'pl-4'}`}>
                    <h3 className="font-semibold text-gray-800 mb-2">{t('pp.sharing.social.title')}</h3>
                    <p className="text-gray-700 text-sm mb-2">
                      {t('pp.sharing.social.intro')}
                    </p>
                    <ul className={`list-disc ${isRTL ? 'pr-6' : 'pl-6'} space-y-1 text-gray-700 text-sm`}>
                      <li><strong>{t('pp.sharing.social.facebook')}</strong> {t('pp.sharing.social.facebookDesc')}</li>
                      <li><strong>{t('pp.sharing.social.google')}</strong> {t('pp.sharing.social.googleDesc')}</li>
                      <li><strong>{t('pp.sharing.social.tiktok')}</strong> {t('pp.sharing.social.tiktokDesc')}</li>
                    </ul>
                    <p className="text-xs text-gray-600 mt-2 italic">
                      {t('pp.sharing.social.note')}
                    </p>
                  </div>

                  {/* AI Services */}
                  <div className={`border-${isRTL ? 'r' : 'l'}-4 border-green-500 ${isRTL ? 'pr-4' : 'pl-4'}`}>
                    <h3 className="font-semibold text-gray-800 mb-2">{t('pp.sharing.ai.title')}</h3>
                    <p className="text-gray-700 text-sm mb-2">
                      {t('pp.sharing.ai.intro')}
                    </p>
                    <ul className={`list-disc ${isRTL ? 'pr-6' : 'pl-6'} space-y-1 text-gray-700 text-sm`}>
                      <li><strong>{t('pp.sharing.ai.openai')}</strong> {t('pp.sharing.ai.openaiDesc')}</li>
                      <li><strong>{t('pp.sharing.ai.vision')}</strong> {t('pp.sharing.ai.visionDesc')}</li>
                      <li><strong>{t('pp.sharing.ai.speech')}</strong> {t('pp.sharing.ai.speechDesc')}</li>
                    </ul>
                    <p className="text-xs text-gray-600 mt-2 italic">
                      {t('pp.sharing.ai.note')}
                    </p>
                  </div>

                  {/* Legal */}
                  <div className={`border-${isRTL ? 'r' : 'l'}-4 border-gray-500 ${isRTL ? 'pr-4' : 'pl-4'}`}>
                    <h3 className="font-semibold text-gray-800 mb-2">{t('pp.sharing.legal.title')}</h3>
                    <p className="text-gray-700 text-sm">
                      {t('pp.sharing.legal.text')}
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-4">
                  <p className="text-blue-900 text-sm">
                    <strong>{t('pp.sharing.commitment')}</strong> {t('pp.sharing.commitmentText')}
                  </p>
                </div>
              </section>

              {/* Security */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('pp.security.title')}</h2>
                <p className="text-gray-700 mb-4">
                  {t('pp.security.intro')}
                </p>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                  <p className="text-blue-800 font-semibold mb-2">{t('pp.security.measuresTitle')}</p>
                  <ul className={`list-disc ${isRTL ? 'pr-6' : 'pl-6'} space-y-1 text-blue-700 text-sm`}>
                    <li>{t('pp.security.ssl')}</li>
                    <li>{t('pp.security.database')}</li>
                    <li>{t('pp.security.firebase')}</li>
                    <li>{t('pp.security.access')}</li>
                    <li>{t('pp.security.backups')}</li>
                    <li>{t('pp.security.monitoring')}</li>
                  </ul>
                </div>
              </section>

              {/* User Rights */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('pp.rights.title')}</h2>
                <p className="text-gray-700 mb-3">{t('pp.rights.intro')}</p>

                <div className="space-y-3">
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-1">{t('pp.rights.access.title')}</h3>
                    <p className="text-sm text-gray-700">
                      {t('pp.rights.access.text')}
                    </p>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-1">{t('pp.rights.rectification.title')}</h3>
                    <p className="text-sm text-gray-700">
                      {t('pp.rights.rectification.text')}
                    </p>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-1">{t('pp.rights.erasure.title')}</h3>
                    <p className="text-sm text-gray-700 mb-2">
                      {t('pp.rights.erasure.text')}
                    </p>
                    <div className="bg-red-50 p-3 rounded border border-red-200 mt-2">
                      <p className="text-red-800 font-semibold text-xs mb-2">{t('pp.rights.erasure.howToTitle')}</p>
                      <ol className={`list-decimal ${isRTL ? 'pr-4' : 'pl-4'} space-y-1 text-red-700 text-xs`}>
                        <li>{t('pp.rights.erasure.step1')}</li>
                        <li>{t('pp.rights.erasure.step2')}</li>
                        <li>{t('pp.rights.erasure.step3')}</li>
                        <li>{t('pp.rights.erasure.step4')}</li>
                      </ol>
                      <p className="text-red-600 text-xs mt-2">
                        <strong>{t('pp.rights.erasure.or')}</strong> {t('pp.rights.erasure.email')}
                      </p>
                      <p className="text-red-700 text-xs mt-2 font-semibold">
                        {t('pp.rights.erasure.timeline')}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-1">{t('pp.rights.object.title')}</h3>
                    <p className="text-sm text-gray-700">
                      {t('pp.rights.object.text')}
                    </p>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-1">{t('pp.rights.portability.title')}</h3>
                    <p className="text-sm text-gray-700">
                      {t('pp.rights.portability.text')}
                    </p>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-1">{t('pp.rights.restriction.title')}</h3>
                    <p className="text-sm text-gray-700">
                      {t('pp.rights.restriction.text')}
                    </p>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-1">{t('pp.rights.withdraw.title')}</h3>
                    <p className="text-sm text-gray-700">
                      {t('pp.rights.withdraw.text')}
                    </p>
                  </div>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mt-4">
                  <p className="text-yellow-800 font-semibold mb-2">
                    {t('pp.rights.exercise')}
                  </p>
                  <ul className="text-yellow-700 text-sm space-y-1">
                    <li>• {t('pp.rights.emailUs')} <strong>{t('pp.rights.emailAddress')}</strong></li>
                    <li>• {t('pp.rights.specify')}</li>
                    <li>• {t('pp.rights.response')}</li>
                  </ul>
                </div>
              </section>

              {/* Data Deletion */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('pp.deletion.title')}</h2>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                  <p className="text-blue-900 font-semibold mb-2">{t('pp.deletion.fbDisconnect')}</p>
                  <ol className={`list-decimal ${isRTL ? 'pr-6' : 'pl-6'} space-y-2 text-blue-800 text-sm`}>
                    <li>
                      <strong>{t('pp.deletion.fromLookAtMe')}</strong>
                      <ul className={`list-disc ${isRTL ? 'pr-4' : 'pl-4'} mt-1 space-y-1`}>
                        <li>{t('pp.deletion.lookAtMeStep1')}</li>
                        <li>{t('pp.deletion.lookAtMeStep2')}</li>
                        <li>{t('pp.deletion.lookAtMeStep3')}</li>
                      </ul>
                    </li>
                    <li>
                      <strong>{t('pp.deletion.fromFacebook')}</strong>
                      <ul className={`list-disc ${isRTL ? 'pr-4' : 'pl-4'} mt-1 space-y-1`}>
                        <li>{t('pp.deletion.fbStep1')}</li>
                        <li>{t('pp.deletion.fbStep2')}</li>
                        <li>{t('pp.deletion.fbStep3')}</li>
                        <li>{t('pp.deletion.fbStep4')}</li>
                      </ul>
                    </li>
                  </ol>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <p className="text-purple-900 font-semibold mb-2">{t('pp.deletion.whatHappens')}</p>
                  <ul className={`list-disc ${isRTL ? 'pr-6' : 'pl-6'} space-y-1 text-purple-800 text-sm`}>
                    <li>{t('pp.deletion.personal')}</li>
                    <li>{t('pp.deletion.active')}</li>
                    <li>{t('pp.deletion.history')}</li>
                    <li>{t('pp.deletion.access')}</li>
                    <li>{t('pp.deletion.fb')}</li>
                  </ul>
                  <p className="text-purple-700 text-xs mt-3">
                    <strong>{t('pp.deletion.note')}</strong> {t('pp.deletion.noteText')}
                  </p>
                </div>
              </section>

              {/* Children's Privacy */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('pp.children.title')}</h2>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <p className="text-orange-900 font-semibold mb-2">
                    {t('pp.children.protectionTitle')}
                  </p>
                  <p className="text-orange-800 text-sm mb-3">
                    {t('pp.children.intro')}
                  </p>
                  <p className="text-orange-700 text-sm">
                    <strong>{t('pp.children.discovered')}</strong><br/>
                    {t('pp.children.discoveredText')}
                  </p>
                </div>
              </section>

              {/* Cookies */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('pp.cookies.title')}</h2>
                <p className="text-gray-700 mb-3">
                  {t('pp.cookies.intro')}
                </p>
                <ul className={`list-disc ${isRTL ? 'pr-6' : 'pl-6'} space-y-2 text-gray-700`}>
                  <li>{t('pp.cookies.save')}</li>
                  <li>{t('pp.cookies.analyze')}</li>
                  <li>{t('pp.cookies.improve')}</li>
                  <li>{t('pp.cookies.personalize')}</li>
                </ul>
                <p className="text-gray-600 text-sm mt-3">
                  {t('pp.cookies.manage')}
                </p>
              </section>

              {/* Retention */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('pp.retention.title')}</h2>
                <ul className={`list-disc ${isRTL ? 'pr-6' : 'pl-6'} space-y-2 text-gray-700`}>
                  <li><strong>{t('pp.retention.account')}</strong> {t('pp.retention.accountText')}</li>
                  <li><strong>{t('pp.retention.marketing')}</strong> {t('pp.retention.marketingText')}</li>
                  <li><strong>{t('pp.retention.payment')}</strong> {t('pp.retention.paymentText')}</li>
                  <li><strong>{t('pp.retention.logs')}</strong> {t('pp.retention.logsText')}</li>
                  <li><strong>{t('pp.retention.analytics')}</strong> {t('pp.retention.analyticsText')}</li>
                </ul>
              </section>

              {/* International Transfer */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('pp.transfer.title')}</h2>
                <p className="text-gray-700">
                  {t('pp.transfer.text')}
                </p>
              </section>

              {/* Policy Changes */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('pp.changes.title')}</h2>
                <p className="text-gray-700">
                  {t('pp.changes.text')}
                </p>
              </section>

              {/* Contact */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('pp.contact.title')}</h2>
                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                  <p className="text-purple-800 mb-4">
                    <strong>{t('pp.contact.intro')}</strong>
                  </p>
                  <div className="space-y-2 text-purple-700">
                    <p>{t('pp.contact.email')} <strong>{t('pp.contact.emailAddress')}</strong></p>
                    <p>{t('pp.contact.website')} <strong>{t('pp.contact.websiteUrl')}</strong></p>
                    <p>{t('pp.contact.address')} <strong>{t('pp.contact.addressText')}</strong></p>
                  </div>
                  <p className="text-purple-600 text-sm mt-4">
                    {t('pp.contact.response')}
                  </p>
                </div>
              </section>

              {/* Compliance */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('pp.compliance.title')}</h2>
                <p className="text-gray-700 mb-3">
                  {t('pp.compliance.intro')}
                </p>
                <ul className={`list-disc ${isRTL ? 'pr-6' : 'pl-6'} space-y-1 text-gray-700`}>
                  <li>{t('pp.compliance.gdpr')}</li>
                  <li>{t('pp.compliance.ccpa')}</li>
                  <li>{t('pp.compliance.israel1')}</li>
                  <li>{t('pp.compliance.israel2')}</li>
                </ul>
              </section>

              {/* Footer */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border-2 border-blue-200 mt-8">
                <p className="text-center text-gray-700 font-semibold text-lg">
                  {t('pp.footer.commitment')}
                </p>
                <p className="text-center text-gray-600 text-sm mt-2">
                  {t('pp.footer.lastUpdated')} {currentDate}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
