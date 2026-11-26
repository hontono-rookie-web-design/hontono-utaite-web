
import Link from "next/link";
import Image from "next/image";

export default function ParticipationCardEntry() {
  return (
    <section className="w-full px-4 py-12">
      <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 text-center text-gray-900 shadow-md">
        <h2 className="mb-4 text-2xl font-bold">
          参加表明カードメーカー
        </h2>

        <p className="mb-6 text-gray-600">
          名前やプロフィール画像などを入力して、
          参加表明カードを簡単に作成できます！
        </p>

        <div className="flex flex-col items-center justify-center gap-8 md:flex-row md:gap-12">
          <Image
            src="/participation-card/template-utaite.png"
            alt="参加表明カードのサンプル"
            width={1200}
            height={1600}
            className="h-auto w-32 shrink-0 rounded-lg border border-gray-200 shadow-sm sm:w-40"
          />

          <Link
            href="/participation-card"
            className="inline-block rounded-lg bg-orange-500 px-6 py-3 font-bold text-white transition-colors hover:bg-orange-600"
          >
            参加表明カードを作成する
          </Link>
        </div>
      </div>
    </section>
  );
}
