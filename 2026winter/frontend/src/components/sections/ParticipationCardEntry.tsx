
import Link from "next/link";

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

        <Link
          href="/participation-card"
          className="inline-block rounded-lg bg-orange-500 px-6 py-3 font-bold text-white transition-colors hover:bg-orange-600"
        >
          参加表明カードを作成する
        </Link>
      </div>
    </section>
  );
}
