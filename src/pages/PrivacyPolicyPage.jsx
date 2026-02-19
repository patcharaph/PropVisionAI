import { Link } from 'react-router-dom'
import { useI18n } from '../context/I18nContext'

const EFFECTIVE_DATE = 'February 19, 2026'
const CONTACT_EMAIL = 'support@propvisionai.app'

function EnglishPolicy() {
  return (
    <div className="space-y-6 text-sm leading-7 text-gray-200">
      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-white">1. Overview</h2>
        <p>
          PropVisionAI provides AI-powered virtual staging services. This Privacy Policy explains
          what data we collect, how we use it, and your choices.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-white">2. Data We Collect</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Photos you upload for virtual staging</li>
          <li>Usage events (for example: upload, generate, share, timeout, feedback)</li>
          <li>Feedback data (rating and optional comment)</li>
          <li>Technical request data necessary for service operation and security</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-white">3. How We Use Data</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Generate staged images you request</li>
          <li>Apply daily quota and monitor reliability/performance</li>
          <li>Improve model quality and user experience</li>
          <li>Prevent abuse and maintain service security</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-white">4. Data Sharing</h2>
        <p>
          We may use infrastructure and AI service providers to process data on our behalf strictly
          to provide app functionality. We do not sell personal data.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-white">5. Data Retention</h2>
        <p>
          We retain data only as long as necessary for service delivery, analytics, legal
          obligations, and security. Data retention periods may change based on operational needs.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-white">6. Security</h2>
        <p>
          We use reasonable safeguards, including encrypted transport (HTTPS), access controls, and
          operational monitoring.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-white">7. Children</h2>
        <p>
          This service is not intended for children under the minimum digital consent age
          applicable in your jurisdiction.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-white">8. Your Rights and Data Deletion</h2>
        <p>
          You can request access or deletion of your data by contacting us at{' '}
          <a className="text-gold hover:underline" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-white">9. Policy Updates</h2>
        <p>We may update this policy from time to time. Material changes will be reflected here.</p>
      </section>
    </div>
  )
}

function ThaiPolicy() {
  return (
    <div className="space-y-6 text-sm leading-7 text-gray-200">
      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-white">1. ภาพรวม</h2>
        <p>
          PropVisionAI เป็นบริการตกแต่งภาพอสังหาริมทรัพย์ด้วย AI เอกสารนี้อธิบายว่ามีการเก็บ
          ใช้ และดูแลข้อมูลอย่างไร
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-white">2. ข้อมูลที่เราเก็บ</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>รูปภาพที่คุณอัปโหลดเพื่อใช้งาน virtual staging</li>
          <li>ข้อมูลการใช้งาน เช่น อัปโหลด สร้างภาพ แชร์ ฟีดแบ็ก และเหตุการณ์ระบบ</li>
          <li>ข้อมูลฟีดแบ็ก เช่น คะแนนและข้อความเพิ่มเติม (ถ้ามี)</li>
          <li>ข้อมูลทางเทคนิคที่จำเป็นต่อการให้บริการและความปลอดภัยของระบบ</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-white">3. วัตถุประสงค์การใช้ข้อมูล</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>สร้างภาพตกแต่งตามคำขอของผู้ใช้</li>
          <li>จัดการโควต้ารายวันและติดตามเสถียรภาพของบริการ</li>
          <li>พัฒนาคุณภาพผลลัพธ์และประสบการณ์ใช้งาน</li>
          <li>ป้องกันการใช้งานที่ไม่เหมาะสมและเพิ่มความปลอดภัยของระบบ</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-white">4. การเปิดเผยข้อมูล</h2>
        <p>
          เราอาจใช้ผู้ให้บริการโครงสร้างพื้นฐานและผู้ให้บริการ AI เพื่อประมวลผลข้อมูลแทนเรา
          เฉพาะเท่าที่จำเป็นต่อการให้บริการ และจะไม่ขายข้อมูลส่วนบุคคล
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-white">5. ระยะเวลาจัดเก็บข้อมูล</h2>
        <p>
          เราจัดเก็บข้อมูลเท่าที่จำเป็นต่อการให้บริการ การวิเคราะห์ การปฏิบัติตามกฎหมาย
          และความปลอดภัยของระบบ โดยอาจปรับตามความเหมาะสมเชิงปฏิบัติการ
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-white">6. ความมั่นคงปลอดภัย</h2>
        <p>
          เราใช้มาตรการด้านความปลอดภัยที่เหมาะสม เช่น การเข้ารหัสระหว่างส่งข้อมูล (HTTPS)
          การจำกัดสิทธิ์เข้าถึง และการเฝ้าระวังระบบ
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-white">7. เด็กและเยาวชน</h2>
        <p>
          บริการนี้ไม่ได้ออกแบบสำหรับเด็กที่มีอายุต่ำกว่าเกณฑ์ความยินยอมทางดิจิทัลตามกฎหมายที่ใช้บังคับ
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-white">8. สิทธิของเจ้าของข้อมูลและการลบข้อมูล</h2>
        <p>
          หากต้องการขอเข้าถึงหรือขอลบข้อมูล กรุณาติดต่อ{' '}
          <a className="text-gold hover:underline" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-white">9. การปรับปรุงนโยบาย</h2>
        <p>เราอาจปรับปรุงนโยบายนี้เป็นระยะ โดยจะแสดงฉบับล่าสุดไว้ในหน้านี้</p>
      </section>
    </div>
  )
}

export default function PrivacyPolicyPage() {
  const { language } = useI18n()

  return (
    <main className="mx-auto w-full max-w-4xl px-6 pb-16">
      <div className="mb-6">
        <Link to="/" className="text-sm text-gold hover:underline">
          ← Back to Home
        </Link>
      </div>

      <header className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
        <p className="text-sm text-gray-400">Effective date: {EFFECTIVE_DATE}</p>
      </header>

      {language === 'th' ? <ThaiPolicy /> : <EnglishPolicy />}
    </main>
  )
}
