import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "عن الموقع",
};

export default function AboutPage() {
  return (
    <article className="mx-auto w-full max-w-3xl py-8">
      <h1 className="text-2xl font-semibold text-text">عن الموقع</h1>
      <p className="mt-4 text-base text-text">
        تعلّم القبطي موقع مجاني لتعليم الحروف القبطية البحيرية بالعربي. من غير
        حساب، ومن غير تحميل.
      </p>

      <h2 className="mt-10 text-xl font-semibold text-text">الخطوط</h2>
      <p className="mt-4 text-base text-text-dim">
        من فوق تقدر تختار خط القبطي: سيريف، سانس، أو أثناسيوس. الافتراضي يونيكود
        (سيريف). أثناسيوس خط مخطوط اختياري، بمفتاح لاتيني.
      </p>
      <ul className="mt-4 flex flex-col gap-3 text-base text-text">
        <li>
          <span dir="ltr" className="inline-block">
            GNU FreeSerif
          </span>
          {" — "}
          رخصة{" "}
          <span dir="ltr" className="inline-block">
            GPL-3.0
          </span>
          {" مع "}
          <span dir="ltr" className="inline-block">
            Font-exception-2.0
          </span>
          . ده الخط السيريف اللي بيعرض الحروف القبطية.
        </li>
        <li>
          <span dir="ltr" className="inline-block">
            Noto Sans Coptic
          </span>
          {" — "}
          رخصة{" "}
          <span dir="ltr" className="inline-block">
            SIL OFL 1.1
          </span>
          . احتياطي لو حرف مش موجود في{" "}
          <span dir="ltr" className="inline-block">
            FreeSerif
          </span>
          .
        </li>
        <li>
          <span dir="ltr" className="inline-block">
            Cairo
          </span>
          {" — "}
          رخصة{" "}
          <span dir="ltr" className="inline-block">
            SIL OFL 1.1
          </span>
          . ده خط العربي.
        </li>
        <li>
          <span dir="ltr" className="inline-block">
            Athanasius Plain
          </span>
          {" — "}
          خط مخطوط اختياري (أثناسيوس في القائمة). مش يونيكود: بيعرض مفتاح
          الحرف المخزّن. النسخ من زر الحرف يفضل يونيكود. الملف من المشروع
          القديم، وصاحب الموقع صرّح بنشره في ٣١ أغسطس ٢٠٢٦. طلب الرخصة من{" "}
          <span dir="ltr" className="inline-block">
            copticchurch.net
          </span>{" "}
          في ٢٩ أغسطس ٢٠٢٦ لسه مش تصريح مكتوب.
        </li>
        <li>
          خطوط{" "}
          <span dir="ltr" className="inline-block">
            CS
          </span>{" "}
          التانية مش على الجهاز، فمش هتتضاف لحد ما الملف يبقى في المستودع:
          <ul className="mt-2 flex flex-col gap-1">
            <li>
              <span dir="ltr" className="inline-block">
                CS Avva Shenouda
              </span>
            </li>
            <li>
              <span dir="ltr" className="inline-block">
                Pope Shenouda III
              </span>
            </li>
            <li>
              <span dir="ltr" className="inline-block">
                CS Pishoi
              </span>
            </li>
            <li>
              <span dir="ltr" className="inline-block">
                CS New Athanasius
              </span>
            </li>
          </ul>
        </li>
        <li>
          <span dir="ltr" className="inline-block">
            Antinoou
          </span>
          : اتبعت طلب لـ{" "}
          <span dir="ltr" className="inline-block">
            Michael Everson / Evertype
          </span>
          {" "}
          في ٢٩ أغسطس ٢٠٢٦. الطلب مش تصريح، والملف مش في المستودع.
        </li>
      </ul>

      <h2 className="mt-10 text-xl font-semibold text-text">الصوت</h2>
      <p className="mt-4 text-base text-text">
        نطق الحروف من فيديوهات{" "}
        <a
          href="https://www.copticliteracy.org/letter-names-and-sounds/"
          dir="ltr"
          className="inline-block text-text underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none"
        >
          Coptic Literacy
        </a>
        {" — "}
        أسماء الحروف. صاحب الموقع صرّح باستخدامها كمواد كنسية في ١ سبتمبر
        ٢٠٢٦. الكلمات من غير تسجيل — مش جزء من المرحلة دي.
      </p>

      <h2 className="mt-10 text-xl font-semibold text-text">الصلوات</h2>
      <p className="mt-4 text-base text-text-dim">
        الربانية وصلاة الشكر من{" "}
        <a
          href="https://copticforall.com/hymn-library/"
          dir="ltr"
          className="inline-block text-text underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none"
        >
          Coptic for All
        </a>
        . المزمور الخمسون قبطي من{" "}
        <span dir="ltr" className="inline-block">
          Coptic SCRIPTORIUM
        </span>
        {" "}
        (بحيري،{" "}
        <span dir="ltr" className="inline-block">
          CC BY 4.0
        </span>
        ) والعربي من الأجبية على{" "}
        <a
          href="https://agpeya.org/prime/"
          dir="ltr"
          className="inline-block text-text underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none"
        >
          agpeya.org
        </a>
        . النص وحده درس كامل — التسجيل المتزامن لسه مش موجود.
      </p>

      <h2 className="mt-10 text-xl font-semibold text-text">المحتوى والكود</h2>
      <ul className="mt-4 flex flex-col gap-3 text-base text-text">
        <li>
          النصوص والدروس:{" "}
          <span dir="ltr" className="inline-block">
            CC BY-SA 4.0
          </span>
        </li>
        <li>
          كلمات القاموس الزيادة من قاموس أندرياس المقاري (بحيري)، نسخة{" "}
          <a
            href="https://github.com/pishoyg/coptic"
            dir="ltr"
            className="inline-block text-text underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none"
          >
            remnqymi / pishoyg
          </a>
          {" "}
          برخصة{" "}
          <span dir="ltr" className="inline-block">
            CC BY-SA 4.0
          </span>
          . المعنى عربي من المصدر. النطق العربي فاضي لحد ما يتكتب يدوي.
        </li>
        <li>
          الكود:{" "}
          <span dir="ltr" className="inline-block">
            MIT
          </span>
          . خط{" "}
          <span dir="ltr" className="inline-block">
            FreeSerif
          </span>{" "}
          رخصته منفصلة (فوق)، ومش بيخلّي الموقع كله{" "}
          <span dir="ltr" className="inline-block">
            GPL
          </span>
          .
        </li>
      </ul>

      <h2 className="mt-10 text-xl font-semibold text-text">تساهم؟</h2>
      <p className="mt-4 text-base text-text">
        المصدر مفتوح على{" "}
        <a
          href="https://github.com/Jovo-Jovi/learn-coptic"
          dir="ltr"
          className="inline-block text-text underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-text focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:outline-none"
        >
          GitHub
        </a>
        . البيانات في ملفات{" "}
        <span dir="ltr" className="inline-block">
          JSON
        </span>
        ، مش من الصفحة. ابعت تعديل أو ملاحظة من هناك.
      </p>
    </article>
  );
}
