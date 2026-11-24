"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// The original template is 1200 x 1600. Keep this resolution for PNG exports.
// 元のテンプレートは1200 x 1600です。PNG形式で書き出す際は、この解像度を維持してください。
const CARD_WIDTH = 1200;
const CARD_HEIGHT = 1600;
const TEMPLATE_SRC = "/participation-card/template-utaite.png";

// Approximate locations measured from the official Utaite template.
// 公式の「歌い手」テンプレートから計測したおおよその位置。
// Adjust these numbers later if the text/checkmarks need small corrections.
// テキストやチェックマークに微調整が必​​要な場合は、後から数値を修正してください。
const PROFILE_X = 272;
const PROFILE_Y = 391;
const PROFILE_RADIUS_X = 222;
const PROFILE_RADIUS_Y = 208;

const PLATFORM_OPTIONS = [
  { value: "youtube", label: "YouTube", x: 578, y: 517 },
  { value: "niconico", label: "ニコニコ", x: 870, y: 519 },
  { value: "iriam", label: "IRIAM", x: 578, y: 553 },
  { value: "colorsing", label: "ColorSing", x: 870, y: 555 },
  { value: "other", label: "その他", x: 578, y: 589 },
] as const;

type Platform = (typeof PLATFORM_OPTIONS)[number]["value"];
type StageChoice = "yes" | "no" | "";
type AfterpartyChoice = "yes" | "no" | "what" | "";
type FavoriteType = "song" | "vocaloidP";
type FavoriteMarkStyle = "underline" | "check";

type CardValues = {
  name: string;
  profileImage: string | null;
  platforms: Platform[];
  otherPlatform: string;
  genre: string;
  favoriteSinger: string;
  favoriteSongOrVocaloidP: string;
  favoriteTypes: FavoriteType[];
  favoriteMarkStyle: FavoriteMarkStyle;
  stageChoice: StageChoice;
  afterpartyChoice: AfterpartyChoice;
  message: string;
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("画像を読み込めませんでした。"));
    image.src = src;
  });
}


function drawProfileImage(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
) {
  const width = PROFILE_RADIUS_X * 2;
  const height = PROFILE_RADIUS_Y * 2;

  const sourceSize = Math.min(image.width, image.height);
  const sourceX = (image.width - sourceSize) / 2;
  const sourceY = (image.height - sourceSize) / 2;

  ctx.save();

  // Match the slightly elliptical frame in the template.
  // テンプレート内の、わずかに楕円形のフレームに合わせる。
  ctx.beginPath();
  ctx.ellipse(
    PROFILE_X,
    PROFILE_Y,
    PROFILE_RADIUS_X,
    PROFILE_RADIUS_Y,
    0,
    0,
    Math.PI * 2,
  );
  ctx.clip();

  ctx.drawImage(
    image,
    sourceX,
    sourceY,
    sourceSize,
    sourceSize,
    PROFILE_X - PROFILE_RADIUS_X,
    PROFILE_Y - PROFILE_RADIUS_Y,
    width,
    height,
  );

  ctx.restore();
}


function drawCheck(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  ctx.strokeStyle = "#FF0208";
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(x - 11, y);
  ctx.lineTo(x - 3, y + 9);
  ctx.lineTo(x + 14, y - 13);
  ctx.stroke();
  ctx.restore();
}

function drawUnderline(
  ctx: CanvasRenderingContext2D,
  startX: number,
  endX: number,
  y: number,
) {
  ctx.save();

  ctx.strokeStyle = "#FF0208";
  ctx.lineWidth = 5;
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(startX, y);
  ctx.lineTo(endX, y);
  ctx.stroke();

  ctx.restore();
}

// Single-line text: use a smaller actual font size as needed, rather than horizontally squashing the characters with fillText(maxWidth).
// 1行のテキスト：fillText(maxWidth) を使って文字を横方向に押しつぶすのではなく、必要に応じて、実際のフォントサイズを小さくする。

function drawFittedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  centerY: number,
  maxWidth: number,
  initialSize: number,
  minSize: number,
) {
  if (!text.trim()) return;

  ctx.save();
  ctx.fillStyle = "#222222";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  let size = initialSize;

  while (size > minSize) {
    ctx.font = `bold ${size}px sans-serif`;
    if (ctx.measureText(text).width <= maxWidth) break;
    size -= 1;
  }

  ctx.font = `bold ${size}px sans-serif`;
  ctx.fillText(text, centerX, centerY, maxWidth);

  ctx.restore();
}


// Wrap text and center the entire text block within its white rectangle.
// テキストを折り返し、白い長方形の中でテキストブロック全体を中央に配置する。
// Reduce the actual font size if needed; do not stretch/squash characters.
// 必要に応じてフォントサイズを小さくすること。文字を引き伸ばしたり、押しつぶしたりしてはならない。
function drawCenteredWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  centerY: number,
  maxWidth: number,
  maxHeight: number,
  initialSize = 38,
  minSize = 18,
) {
  if (!text.trim()) return;

  ctx.save();
  ctx.fillStyle = "#222222";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  let size = initialSize;
  let lines: string[] = [];
  let lineHeight = 0;

  // Choose a font size that keeps the whole wrapped block in the box.
  // 折り返されたブロック全体がボックス内に収まるようなフォントサイズを選択してください。
  for (; size >= minSize; size--) {
    ctx.font = `bold ${size}px sans-serif`;
    lines = wrapLines(ctx, text, maxWidth);
    lineHeight = size * 1.3;
    if (lines.length * lineHeight <= maxHeight) break;
  }

  size = Math.max(size, minSize);
  ctx.font = `bold ${size}px sans-serif`;
  lines = wrapLines(ctx, text, maxWidth);
  lineHeight = size * 1.3;

  // Even at the minimum font size, never draw outside the text area.
  // 最小フォントサイズであっても、テキスト領域の外側には決して描画しないこと。
  const maxVisibleLines = Math.max(1, Math.floor(maxHeight / lineHeight));
  const visibleLines = lines.slice(0, maxVisibleLines);
  if (lines.length > maxVisibleLines) {
    const last = visibleLines.length - 1;
    let ending = visibleLines[last];
    while (ending && ctx.measureText(`${ending}…`).width > maxWidth) {
      ending = ending.slice(0, -1);
    }
    visibleLines[last] = `${ending}…`;
  }

  // Vertically center the whole group, not just the first line.
  // 最初の行だけでなく、グループ全体を垂直方向に中央揃えにする。
  const firstY = centerY - ((visibleLines.length - 1) * lineHeight) / 2;

  ctx.beginPath();
  ctx.rect(centerX - maxWidth / 2, centerY - maxHeight / 2, maxWidth, maxHeight);
  ctx.clip();

  visibleLines.forEach((line, index) => {
    ctx.fillText(line, centerX, firstY + index * lineHeight, maxWidth);
  });

  ctx.restore();
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const lines: string[] = [];
  for (const paragraph of text.split(/\r?\n/)) {
    let line = "";
    for (const char of Array.from(paragraph)) {
      const candidate = line + char;
      if (line && ctx.measureText(candidate).width > maxWidth) {
        lines.push(line);
        line = char;
      } else {
        line = candidate;
      }
    }
    lines.push(line);
  }
  return lines;
}

// Center the final message inside the large bottom white rectangle.
// 最後のメッセージを、下部にある大きな白い長方形の中央に配置する。
function drawMessage(ctx: CanvasRenderingContext2D, message: string) {
  drawCenteredWrappedText(ctx, message, 600, 1434, 1040, 166, 40, 22);
}

async function renderCard(
  canvas: HTMLCanvasElement,
  values: CardValues,
  isCancelled: () => boolean = () => false,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvasを使用できませんでした。");

  // Wait for all images/fonts before drawing, including on download.
  // 描画の前に、すべての画像やフォントが（ダウンロードを含め）揃うのを待つ。
  const [template, profile] = await Promise.all([
    loadImage(TEMPLATE_SRC),
    values.profileImage ? loadImage(values.profileImage) : Promise.resolve(null),
    document.fonts.ready,
  ]);

  if (isCancelled()) return;

  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;
  ctx.clearRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
  ctx.drawImage(template, 0, 0, CARD_WIDTH, CARD_HEIGHT);

  if (profile) drawProfileImage(ctx, profile);

  // お名前
  drawFittedText(ctx, values.name, 849, 340, 590, 48, 24);

  // 活動プラットフォーム（multiple selections）
  PLATFORM_OPTIONS.forEach((option) => {
    if (values.platforms.includes(option.value)) {
      drawCheck(ctx, option.x, option.y);
    }
  });
  if (values.platforms.includes("other")) {
    drawFittedText(ctx, values.otherPlatform, 845, 625, 450, 36, 24);
  }

  // My Favorite fields: centered in both directions, with automatic wrapping.
  // 「お気に入り」フィールド：縦横ともに中央揃えで、自動折り返しあり。
  // The white rectangles are x=38..585 / 628..1175 and y=756..894 / 960..1098.
  // 白い長方形の範囲は、x=38～585 / 628～1175、y=756～894 / 960～1098 です。
  drawCenteredWrappedText(ctx, values.genre, 311, 826, 490, 110, 38, 18);
  drawCenteredWrappedText(ctx, values.favoriteSinger, 902, 826, 490, 110, 38, 18);
  drawCenteredWrappedText(ctx, values.favoriteSongOrVocaloidP, 311, 1028, 490, 110, 38, 18);

  // Display either underlines or checkmarks.
  // 下線またはチェックマークのいずれかを表示する。
  if (values.favoriteMarkStyle === "underline") {
    if (values.favoriteTypes.includes("song")) {
      drawUnderline(ctx, 65, 251, 951);
    }

    if (values.favoriteTypes.includes("vocaloidP")) {
      drawUnderline(ctx, 350, 505, 951);
    }
  } else {
    if (values.favoriteTypes.includes("song")) {
      drawCheck(ctx, 247, 947);
    }

    if (values.favoriteTypes.includes("vocaloidP")) {
      drawCheck(ctx, 495, 947);
    }
  }

  // 無名歌唱ステージ参加（single choice）
  if (values.stageChoice === "yes") drawCheck(ctx, 672, 1002);
  if (values.stageChoice === "no") drawCheck(ctx, 672, 1039);

  // 本当のルーキー打ち上げ祭りに参加したいですか？（single choice）
  if (values.afterpartyChoice === "yes") drawCheck(ctx, 179, 1187);
  if (values.afterpartyChoice === "no") drawCheck(ctx, 179, 1223);
  if (values.afterpartyChoice === "what") drawCheck(ctx, 590, 1187);

  // 最後に意気込みを聞かせてください！
  drawMessage(ctx, values.message);
}

const fieldStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #b8bec7",
  borderRadius: 8,
  background: "white",
  color: "#20252b",
  fontSize: 16,
  boxSizing: "border-box",
};

const sectionStyle: React.CSSProperties = {
  display: "grid",
  gap: 8,
};

const choiceStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  cursor: "pointer",
};

export default function ParticipationCardPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [otherPlatform, setOtherPlatform] = useState("");
  const [genre, setGenre] = useState("");
  const [favoriteSinger, setFavoriteSinger] = useState("");
  const [favoriteSongOrVocaloidP, setFavoriteSongOrVocaloidP] = useState("");
  const [favoriteTypes, setFavoriteTypes] = useState<FavoriteType[]>([]);
  const [favoriteMarkStyle, setFavoriteMarkStyle] =
  useState<FavoriteMarkStyle>("underline");
  const [stageChoice, setStageChoice] = useState<StageChoice>("");
  const [afterpartyChoice, setAfterpartyChoice] = useState<AfterpartyChoice>("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);

  const values = useMemo<CardValues>(() => ({
    name,
    profileImage,
    platforms,
    otherPlatform,
    genre,
    favoriteSinger,
    favoriteSongOrVocaloidP,
    favoriteTypes,
    favoriteMarkStyle,
    stageChoice,
    afterpartyChoice,
    message,
  }), [name, profileImage, platforms, otherPlatform, genre, favoriteSinger,
      favoriteSongOrVocaloidP, favoriteTypes, favoriteMarkStyle, stageChoice, afterpartyChoice, message]);

  useEffect(() => {
    let cancelled = false;
    const canvas = canvasRef.current;
    if (!canvas) return;
    renderCard(canvas, values, () => cancelled).catch((err: unknown) => {
      if (!cancelled) {
        console.error("Preview rendering failed:", err);
        setError("プレビューを表示できませんでした。画像ファイルの配置を確認してください。");
      }
    });
    return () => { cancelled = true; };
  }, [values]);

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setError("PNG、JPG、WebP画像を選択してください。");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("画像サイズは5MB以下にしてください。");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setProfileImage(reader.result);
    };
    reader.onerror = () => setError("画像の読み込みに失敗しました。");
    reader.readAsDataURL(file);
  }

  function togglePlatform(platform: Platform) {
    setPlatforms((previous) =>
      previous.includes(platform)
        ? previous.filter((item) => item !== platform)
        : [...previous, platform],
    );
  }

  function toggleFavoriteType(type: FavoriteType) {
    setFavoriteTypes((previous) =>
      previous.includes(type)
        ? previous.filter((item) => item !== type)
        : [...previous, type],
    );
  }

  async function downloadCard() {
    setError("");
    setExporting(true);
    try {
      // Render again from current React state, not a potentially stale preview.
      // 古くなっている可能性があるプレビューではなく、現在のReact状態から再レンダリングする。
      const exportCanvas = document.createElement("canvas");
      await renderCard(exportCanvas, values);
      const blob = await new Promise<Blob>((resolve, reject) => {
        exportCanvas.toBlob((result) => {
          if (result) resolve(result);
          else reject(new Error("PNG画像を生成できませんでした。"));
        }, "image/png");
      });
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = "utaite-participation-card.png";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    } catch (err) {
      console.error("PNG export failed:", err);
      setError("PNG画像を保存できませんでした。");
    } finally {
      setExporting(false);
    }
  }

  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "32px 16px 64px", color: "inherit" }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 8 }}>
        歌い手祭り 参加表明カードメーカー
      </h1>
      <p style={{ marginBottom: 22 }}>
        情報を入力して、参加表明カードをPNG画像として保存できます。
      </p>

      <canvas
        ref={canvasRef}
        width={CARD_WIDTH}
        height={CARD_HEIGHT}
        role="img"
        aria-label="参加表明カードのプレビュー"
        style={{ width: "100%", height: "auto", display: "block", border: "1px solid #d0d0d0", borderRadius: 8, marginBottom: 28 }}
      />

      <div style={{ display: "grid", gap: 22 }}>
        <label style={sectionStyle}>
          <strong>お名前（最大30文字）</strong>
          <input style={fieldStyle} type="text" value={name} maxLength={30}
            onChange={(event) => setName(event.target.value)} placeholder="お名前を入力" />
        </label>

        <div style={sectionStyle}>
          <label htmlFor="utaite-avatar"><strong>プロフィール画像</strong></label>
          <input
            id="utaite-avatar"
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleImageUpload}
            className="w-full cursor-pointer rounded-lg border-2 border-base-content/30 bg-base-100 p-2 text-sm file:mr-4 file:cursor-pointer file:rounded-md file:border file:border-primary/40 file:bg-primary/10 file:px-4 file:py-2 file:font-semibold file:text-base-content hover:border-primary/70"
          />
          <small>PNG / JPG / WebP（最大5MB）</small>
          {profileImage && (
            <button type="button" onClick={() => {
              setProfileImage(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }} style={{ ...fieldStyle, width: "fit-content", cursor: "pointer" }}>
              画像を削除
            </button>
          )}
        </div>

        <fieldset style={{ ...sectionStyle, border: "1px solid #d0d0d0", borderRadius: 8, padding: 14 }}>
          <legend style={{ fontWeight: 700 }}>活動プラットフォーム（複数選択可）</legend>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 22px" }}>
            {PLATFORM_OPTIONS.map((option) => (
              <label key={option.value} style={choiceStyle}>
                <input type="checkbox" checked={platforms.includes(option.value)}
                  onChange={() => togglePlatform(option.value)} />
                {option.label}
              </label>
            ))}
          </div>
          {platforms.includes("other") && (
            <label style={sectionStyle}>
              <span>その他のプラットフォーム（最大25文字）</span>
              <input style={fieldStyle} value={otherPlatform} maxLength={25}
                onChange={(event) => setOtherPlatform(event.target.value)} placeholder="サービス名など" />
            </label>
          )}
        </fieldset>

        <label style={sectionStyle}>
          <strong>ジャンル（最大51文字）</strong>
          <input style={fieldStyle} value={genre} maxLength={51}
            onChange={(event) => setGenre(event.target.value)} />
        </label>
        <label style={sectionStyle}>
          <strong>好きな歌い手（最大51文字）</strong>
          <input
            style={fieldStyle}
            value={favoriteSinger}
            maxLength={51}
            onChange={(event) => setFavoriteSinger(event.target.value)}
          />
        </label>
        <div style={sectionStyle}>
          <strong>好きな曲 or ボカロP（最大51文字）</strong>

          
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px 20px",
          }}
        >
          <label style={choiceStyle}>
            <input
              type="checkbox"
              checked={favoriteTypes.includes("song")}
              onChange={() => toggleFavoriteType("song")}
            />
            好きな曲
          </label>

          <label style={choiceStyle}>
            <input
              type="checkbox"
              checked={favoriteTypes.includes("vocaloidP")}
              onChange={() => toggleFavoriteType("vocaloidP")}
            />
            ボカロP
          </label>

          <span style={{ marginLeft: "auto", fontSize: 14 }}>
            表示形式：
          </span>

          <label style={choiceStyle}>
            <input
              type="radio"
              name="favorite-mark-style"
              checked={favoriteMarkStyle === "underline"}
              onChange={() => setFavoriteMarkStyle("underline")}
            />
            下線
          </label>

          <label style={choiceStyle}>
            <input
              type="radio"
              name="favorite-mark-style"
              checked={favoriteMarkStyle === "check"}
              onChange={() => setFavoriteMarkStyle("check")}
            />
            チェック
          </label>
        </div>

          <input
            style={fieldStyle}
            value={favoriteSongOrVocaloidP}
            maxLength={51}
            onChange={(event) =>
              setFavoriteSongOrVocaloidP(event.target.value)
            }
            placeholder="好きな曲名やボカロP名を入力"
          />

          <small>両方選択できます。選択した表示形式でマークが付きます。</small>
        </div>

        <fieldset style={{ ...sectionStyle, border: "1px solid #d0d0d0", borderRadius: 8, padding: 14 }}>
          <legend style={{ fontWeight: 700 }}>無名歌唱ステージ参加</legend>
          <label style={choiceStyle}><input type="radio" name="stage" checked={stageChoice === "yes"}
            onChange={() => setStageChoice("yes")} />参加する</label>
          <label style={choiceStyle}><input type="radio" name="stage" checked={stageChoice === "no"}
            onChange={() => setStageChoice("no")} />参加しない</label>
          <button type="button" onClick={() => setStageChoice("")}
            style={{ ...fieldStyle, width: "fit-content", cursor: "pointer" }}>選択を解除</button>
        </fieldset>

        <fieldset style={{ ...sectionStyle, border: "1px solid #d0d0d0", borderRadius: 8, padding: 14 }}>
          <legend style={{ fontWeight: 700 }}>本当のルーキー打ち上げ祭りに参加したいですか？</legend>
          <label style={choiceStyle}><input type="radio" name="afterparty" checked={afterpartyChoice === "yes"}
            onChange={() => setAfterpartyChoice("yes")} />参加したい</label>
          <label style={choiceStyle}><input type="radio" name="afterparty" checked={afterpartyChoice === "no"}
            onChange={() => setAfterpartyChoice("no")} />参加できない</label>
          <label style={choiceStyle}><input type="radio" name="afterparty" checked={afterpartyChoice === "what"}
            onChange={() => setAfterpartyChoice("what")} />なにそれおいしいの？</label>
          <button type="button" onClick={() => setAfterpartyChoice("")}
            style={{ ...fieldStyle, width: "fit-content", cursor: "pointer" }}>選択を解除</button>
        </fieldset>

        <label style={sectionStyle}>
          <strong>最後に意気込みを聞かせてください！（最大160文字）</strong>
          <textarea style={{ ...fieldStyle, minHeight: 110, resize: "vertical" }}
            value={message} maxLength={160} rows={4}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="自由にメッセージを入力してください" />
          <small>{message.length}/160文字・自動改行（表示は最大4行）</small>
        </label>

        <button type="button" onClick={downloadCard} disabled={exporting}
          style={{ padding: "14px 20px", fontSize: 17, fontWeight: 700, border: 0,
            borderRadius: 8, background: "#176f35", color: "white",
            cursor: exporting ? "wait" : "pointer", opacity: exporting ? 0.65 : 1 }}>
          {exporting ? "PNG画像を作成中…" : "PNG画像を保存"}
        </button>
        {error && <p role="alert" style={{ color: "#b42318" }}>{error}</p>}
        <p style={{ fontSize: 13, opacity: 0.75, marginTop: -12 }}>
          画像と入力内容はブラウザ内で処理され、サーバーには送信されません。
        </p>
      </div>
    </main>
  );
}
