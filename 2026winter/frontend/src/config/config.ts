export const CONFIG = {
  event: {
    name: "本当のルーキー祭り2026秋",
  },

  ranking: {
    prelim_cutoff: 3,
    final_cutoff: null,
  },

  videosheets: {
    spreadsheetId: process.env.SPREADSHEET_ID_VIDEOS!,
    status: {
      rookie: { name: "ルーキー" },
    },
    stage: {
      preliminaries: { group_id: "prelim_group_id", rank: "prelim_rank", name: "予選" },
      finals: { group_id: "final_group_id", rank: "final_rank", name: "決勝" },
    },
  },

  voteformssheets: {
    spreadsheetId: process.env.SPREADSHEET_ID_VOTEFORM!,
    preliminaries: { name: "予選" },
    finals: { name: "決勝" },
  },

  images: {
    defaultIllustration: "/images/2026autumn_logo.png",
  },

  googleAnalyticsId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || "",

  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "",
};
