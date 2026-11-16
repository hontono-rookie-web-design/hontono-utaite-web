import { CONFIG } from "@/config/config";
import { unstable_rethrow } from "next/navigation";

type SheetRow = Record<string, unknown>;

const SHEET_INDEX = 1;

function asString(value: unknown): string {
  return typeof value === "string" ? value : value == null ? "" : String(value);
}

function asOptionalNumber(value: unknown): number | undefined {
  if (value === "" || value == null) return undefined;

  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

function isExcluded(value: unknown): boolean {
  return value === true || asString(value).toUpperCase() === "TRUE";
}

function isDeleted(value: unknown): boolean {
  return value === true || asString(value).toUpperCase() === "TRUE";
}

async function fetchSheetRows(
  spreadsheetId: string,
  label: string,
  revalidate: number | false = false,
): Promise<SheetRow[]> {
  if (!spreadsheetId) {
    console.error(`${label}: spreadsheet ID is not configured`);
    return [];
  }

  try {
    const url = `https://opensheet.elk.sh/${spreadsheetId}/${SHEET_INDEX}`;
    const response = await fetch(url, { next: { revalidate } });

    if (!response.ok) {
      console.error(`${label}: request failed with status ${response.status}`);
      return [];
    }

    const data: unknown = await response.json();
    if (!Array.isArray(data)) {
      console.error(`${label}: unexpected response (not an array)`);
      return [];
    }

    return data.filter(
      (row): row is SheetRow => typeof row === "object" && row !== null && !Array.isArray(row),
    );
  } catch (error) {
    unstable_rethrow(error);
    console.error(`${label}: failed to fetch sheet`, error);
    return [];
  }
}

export type VideoStage = {
  group_id: string;
  rank: string;
};

export type VideoSheetItem = {
  videoId: string;
  title: string;
  creatorId: string;
  creator: string;
  publishedAt: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  group?: number;
  rank?: number;
};

export async function fetchVideosSheet(
  status: string,
  stage?: VideoStage,
): Promise<VideoSheetItem[]> {
  const data = await fetchSheetRows(CONFIG.videosheets.spreadsheetId, "fetchVideosSheet");

  return data
    .filter((row) => asString(row.status) === status)
    .filter((row) => !isExcluded(row.excluded))
    .filter((row) => !isDeleted(row.deleted))
    .map((row) => ({
      videoId: asString(row.video_id),
      title: asString(row.title),
      creatorId: asString(row.user_id),
      creator: asString(row.user_name),
      publishedAt: asString(row.posted_at).replace(/^'/, ""),
      description: asString(row.description),
      videoUrl: asString(row.video_url),
      thumbnailUrl: asString(row.thumbnail_url),
      group: stage ? asOptionalNumber(row[stage.group_id]) : undefined,
      rank: stage ? asOptionalNumber(row[stage.rank]) : undefined,
    }));
}

export type VoteSheetItem = {
  group: number;
  formUrl: string;
  mylistUrl: string;
  voteStartsAt?: string;
  voteEndsAt?: string;
};

export async function fetchVotesSheet(stage: string): Promise<VoteSheetItem[]> {
  const data = await fetchSheetRows(CONFIG.voteformssheets.spreadsheetId, "fetchVotesSheet");
  return data
    .filter((row) => asString(row.stage) === stage)
    .filter((row) => !isDeleted(row.deleted))
    .map((row) => ({
      group: asOptionalNumber(row.group_id) ?? 0,
      formUrl: asString(row.form_url),
      mylistUrl: asString(row.mylist_url),
      voteStartsAt: asString(row.vote_starts_at).replace(/^'/, "") || undefined,
      voteEndsAt: asString(row.vote_ends_at).replace(/^'/, "") || undefined,
    }))
    .filter((item) => item.group > 0);
}
