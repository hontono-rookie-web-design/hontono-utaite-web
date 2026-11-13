"use client";

import { Home, Menu, Music, Vote } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Navigation({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const closeDrawer = () => setIsOpen(false);

  return (
    <div className="drawer lg:drawer-open">
      <input
        id="main-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={isOpen}
        onChange={(e) => setIsOpen(e.target.checked)}
      />

      <div className="drawer-content flex flex-col min-h-screen relative">
        {/* Navbar */}

        <div className="navbar backdrop-blur-md sticky top-0 z-50 px-4">
          <div className="flex-none lg:hidden">
            <label
              htmlFor="main-drawer"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost text-secondary"
            >
              <Menu size={24} />
            </label>
          </div>

          <div className="flex-1 lg:ml-4">
            <Link
              href="/"
              prefetch={false}
              className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
            >
              本当のルーキー祭り
            </Link>
          </div>
        </div>
        {/* Page Content */}
        <main className="flex-1 flex flex-col">{children}</main>
      </div>

      <div className="drawer-side z-[100]">
        <label htmlFor="main-drawer" aria-label="close sidebar" className="drawer-overlay"></label>

        <ul className="menu p-4 w-72 min-h-full bg-base-100 text-base-content border-r border-primary/10 shadow-sm">
          <div className="mb-6 mt-2 px-2">
            <h2 className="text-2xl font-bold text-slate-800">
              本当のルーキー祭り
              <br />
              <span className="text-lg text-secondary">2026秋</span>
            </h2>
          </div>

          <li className="mb-2">
            <Link href="/" prefetch={false} onClick={closeDrawer} className="font-semibold">
              <Home className="w-5 h-5 mr-3 text-slate-400" />
              トップページ
            </Link>
          </li>

          <li className="menu-title mt-4 text-secondary font-bold tracking-widest text-xs uppercase">
            投稿作品
          </li>

          <li>
            <Link href="/submissions/songs/rookie" prefetch={false} onClick={closeDrawer}>
              <Music className="w-4 h-4 mr-3 text-slate-400" />
              楽曲一覧 ルーキー
            </Link>
          </li>

          <li className="menu-title mt-4 text-accent font-bold tracking-widest text-xs uppercase">
            人気投票
          </li>

          <li>
            <Link href="/submissions/vote/preliminaries" prefetch={false} onClick={closeDrawer}>
              <Vote className="w-4 h-4 mr-3 text-slate-400" />
              人気投票 予選
            </Link>
          </li>

          <li>
            <Link href="/submissions/vote/finals" prefetch={false} onClick={closeDrawer}>
              <Vote className="w-4 h-4 mr-3 text-slate-400" />
              人気投票 決勝
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
