import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';

function SEOContent() {
  const { t } = useTranslation();

  const stats = [
    { number: '1M+', label: t('seo.stats.verified') },
    { number: '99%', label: t('seo.stats.accuracy') },
    { number: '150M+', label: t('seo.stats.database') },
    { number: '<1s', label: t('seo.stats.speed') }
  ];

  const features = [
    {
      icon: '🔍',
      title: t('seo.features.detection.title'),
      description: t('seo.features.detection.desc')
    },
    {
      icon: '📚',
      title: t('seo.features.database.title'),
      description: t('seo.features.database.desc')
    },
    {
      icon: '⚡',
      title: t('seo.features.speed.title'),
      description: t('seo.features.speed.desc')
    }
  ];

  const faqs = [
    {
      question: t('seo.faq.q1'),
      answer: t('seo.faq.a1')
    },
    {
      question: t('seo.faq.q2'),
      answer: t('seo.faq.a2')
    },
    {
      question: t('seo.faq.q3'),
      answer: t('seo.faq.a3')
    },
    {
      question: t('seo.faq.q4'),
      answer: t('seo.faq.a4')
    }
  ];

  return (
    <div className="space-y-16 py-16">
      {/* Stats Section */}
      <section className="text-center">
        <h2 className="text-2xl font-bold mb-8">{t('seo.trustedBy')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="space-y-2">
              <div className="text-3xl font-bold text-primary">{stat.number}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section>
        <h2 className="text-2xl font-bold text-center mb-8">{t('seo.howItWorks')}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section>
        <h2 className="text-2xl font-bold text-center mb-8">{t('seo.faqTitle')}</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <details key={index} className="group rounded-lg border p-4 hover:bg-accent/50 transition-colors">
              <summary className="font-medium cursor-pointer list-none flex justify-between items-center">
                {faq.question}
                <svg className="w-4 h-4 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Academic Warning */}
      <section className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-6 text-center">
        <h3 className="font-semibold mb-2">{t('seo.warning.title')}</h3>
        <p className="text-sm text-muted-foreground mb-4">{t('seo.warning.desc')}</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <a href="/how-to-check-citations" className="text-sm text-primary hover:underline">
            {t('seo.warning.learnHow')} →
          </a>
          <a href="/ai-hallucination-detector" className="text-sm text-primary hover:underline">
            {t('seo.warning.whyHappen')} →
          </a>
        </div>
      </section>

      {/* Citation Styles */}
      <section className="text-center">
        <h2 className="text-2xl font-bold mb-8">{t('seo.styles.title')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          <div className="p-4 rounded-lg bg-secondary">
            <div className="font-semibold">APA</div>
            <div className="text-xs text-muted-foreground">{t('seo.styles.apa')}</div>
          </div>
          <div className="p-4 rounded-lg bg-secondary">
            <div className="font-semibold">MLA</div>
            <div className="text-xs text-muted-foreground">{t('seo.styles.mla')}</div>
          </div>
          <div className="p-4 rounded-lg bg-secondary">
            <div className="font-semibold">Chicago</div>
            <div className="text-xs text-muted-foreground">{t('seo.styles.chicago')}</div>
          </div>
          <div className="p-4 rounded-lg bg-secondary">
            <div className="font-semibold">Harvard</div>
            <div className="text-xs text-muted-foreground">{t('seo.styles.harvard')}</div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="text-center border-t pt-8">
        <div className="flex justify-center items-center gap-8 flex-wrap text-sm text-muted-foreground">
          <span>✓ {t('seo.trust.free')}</span>
          <span>✓ {t('seo.trust.noLogin')}</span>
          <span>✓ {t('seo.trust.instant')}</span>
          <span>✓ {t('seo.trust.accurate')}</span>
        </div>
      </section>
    </div>
  );
}

export default SEOContent;