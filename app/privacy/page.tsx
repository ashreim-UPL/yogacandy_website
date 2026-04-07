import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — YogaCandy',
  description: 'How YogaCandy collects, uses, and protects your personal data. GDPR compliant.',
};

export default function PrivacyPage() {
  const updated = '7 April 2026';
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-gray">
        <h1 className="text-4xl font-extrabold mb-2">Privacy Policy</h1>
        <p className="text-gray-400 text-sm mb-10">Last updated: {updated}</p>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-3">1. Who We Are</h2>
          <p className="text-gray-600 leading-relaxed">
            YogaCandy (&ldquo;we&rdquo;, &ldquo;our&rdquo;) operates yogacandy.info. We are committed to protecting your personal data
            and complying with the EU General Data Protection Regulation (GDPR) and applicable data
            protection laws.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-3">2. Data We Collect</h2>
          <ul className="text-gray-600 space-y-2 leading-relaxed list-disc list-inside">
            <li><strong>Account data:</strong> name, email address, role (teacher/student), and hashed password when you register.</li>
            <li><strong>Location data:</strong> approximate city and country, stored only in your browser (localStorage). Never sent to our servers unless you submit a form.</li>
            <li><strong>Usage data:</strong> anonymous page views via server logs (IP addresses are anonymised after 24 h).</li>
            <li><strong>Communications:</strong> messages you send via contact forms or the AI chat widget.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-3">3. Legal Basis (GDPR Art. 6)</h2>
          <ul className="text-gray-600 space-y-2 leading-relaxed list-disc list-inside">
            <li><strong>Consent (Art. 6.1.a):</strong> location detection and marketing communications. You may withdraw at any time.</li>
            <li><strong>Contract (Art. 6.1.b):</strong> account registration and service delivery.</li>
            <li><strong>Legitimate interests (Art. 6.1.f):</strong> security, fraud prevention, and anonymous analytics.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-3">4. On-Device AI</h2>
          <p className="text-gray-600 leading-relaxed">
            The style recommender runs entirely in your browser using Chrome&rsquo;s built-in AI (Gemini Nano).
            Your questionnaire answers are never transmitted to YogaCandy or any third party.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-3">5. Third-Party Services</h2>
          <ul className="text-gray-600 space-y-2 leading-relaxed list-disc list-inside">
            <li><strong>Supabase</strong> — authentication and database (EU region). Data Processing Agreement in place.</li>
            <li><strong>Google Maps</strong> — map embeds when you allow location access. Governed by Google&rsquo;s Privacy Policy.</li>
            <li><strong>Instagram</strong> — embedded posts from @yogacandyae. Governed by Meta&rsquo;s Privacy Policy.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-3">6. Your Rights (GDPR Art. 15–22)</h2>
          <p className="text-gray-600 leading-relaxed mb-3">You have the right to:</p>
          <ul className="text-gray-600 space-y-1 leading-relaxed list-disc list-inside">
            <li>Access your personal data (Art. 15)</li>
            <li>Correct inaccurate data (Art. 16)</li>
            <li>Erase your data — &ldquo;right to be forgotten&rdquo; (Art. 17)</li>
            <li>Restrict processing (Art. 18)</li>
            <li>Data portability (Art. 20)</li>
            <li>Object to processing (Art. 21)</li>
            <li>Withdraw consent at any time without affecting prior processing (Art. 7.3)</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-3">
            To exercise any right, email us at <a href="mailto:privacy@yogacandy.info" className="text-blue-600 hover:underline">privacy@yogacandy.info</a>.
            We will respond within 30 days.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-3">7. Data Retention</h2>
          <p className="text-gray-600 leading-relaxed">
            Account data is retained while your account is active and for 12 months after deletion, after
            which it is permanently erased. You may request immediate deletion at any time.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold mb-3">8. Contact & Complaints</h2>
          <p className="text-gray-600 leading-relaxed">
            Data Controller: YogaCandy · <a href="mailto:privacy@yogacandy.info" className="text-blue-600 hover:underline">privacy@yogacandy.info</a>
            <br />
            You have the right to lodge a complaint with your local supervisory authority (e.g., the ICO in the UK, UAETRA in the UAE).
          </p>
        </section>
      </div>
    </div>
  );
}
