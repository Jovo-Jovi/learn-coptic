/**
 * Download Coptic Literacy letter-name MP4s and encode 64 kbps mono MP3
 * into public/audio/letters/. Owner authorized church reuse 2026-09-01.
 *
 *   node scripts/import-letter-audio.mjs <ffmpeg.exe>
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, existsSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const tmp = join(root, ".tmp", "letter-mp4");
const outDir = join(root, "public", "audio", "letters");
mkdirSync(tmp, { recursive: true });
mkdirSync(outDir, { recursive: true });

const clips = [
  ["alpha", "2018/06/alpha_post.mp4"],
  ["vida", "2018/06/veeta_post.mp4"],
  ["gamma", "2018/06/gamma_post.mp4"],
  ["dalda", "2018/06/delta_post.mp4"],
  ["ei", "2018/06/eey_post.mp4"],
  ["sou", "2018/06/so-oo_post.mp4"],
  ["zeta", "2018/06/zeeta_post.mp4"],
  ["eta", "2018/06/eeta_post.mp4"],
  ["theta", "2018/06/theeta_post.mp4"],
  ["iota", "2018/06/yota_post.mp4"],
  ["kappa", "2018/06/kappa_post.mp4"],
  ["lola", "2018/06/lavla_post.mp4"],
  ["mi", "2018/06/mey_post.mp4"],
  ["ni", "2018/06/ney_post.mp4"],
  ["eksi", "2018/06/eksi_post.mp4"],
  ["o", "2018/06/o_post.mp4"],
  ["pi", "2018/07/pee_post.mp4"],
  ["ro", "2018/07/ro_post.mp4"],
  ["sima", "2018/07/seema_post.mp4"],
  ["tav", "2018/07/tav_post.mp4"],
  ["epsilon", "2018/07/epsilon_post.mp4"],
  ["fi", "2018/07/fey_post.mp4"],
  ["khi", "2018/07/key_post.mp4"],
  ["epsi", "2018/07/epsi_post.mp4"],
  ["oou", "2018/07/oo_post.mp4"],
  ["shai", "2018/07/shai_post.mp4"],
  ["fai", "2018/07/fai_post.mp4"],
  ["khai", "2018/07/khai_post.mp4"],
  ["hori", "2018/07/hori_post.mp4"],
  ["janja", "2018/07/ganga_post.mp4"],
  ["cheema", "2018/07/cheema_post.mp4"],
  ["ti", "2018/07/tee_post.mp4"],
];

const base = "https://www.copticliteracy.org/wp-content/uploads";

async function download(id, rel) {
  const dest = join(tmp, `${id}.mp4`);
  if (existsSync(dest) && statSync(dest).size > 1000) return dest;
  const url = `${base}/${rel}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
  return dest;
}

function durationSec(ffmpeg, file) {
  let err = "";
  try {
    execFileSync(ffmpeg, ["-i", file], {
      encoding: "utf8",
      stdio: ["ignore", "ignore", "pipe"],
    });
  } catch (e) {
    err = String(e.stderr ?? "");
  }
  const m = /Duration: (\d+):(\d+):(\d+\.\d+)/.exec(err);
  if (!m) return undefined;
  return Number(
    (Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3])).toFixed(2),
  );
}

const ffmpeg = process.argv[2];
if (!ffmpeg) {
  console.error("usage: node scripts/import-letter-audio.mjs <ffmpeg.exe>");
  process.exit(1);
}

const durations = {};
for (const [id, rel] of clips) {
  process.stdout.write(`${id}… `);
  const mp4 = await download(id, rel);
  const mp3 = join(outDir, `${id}.mp3`);
  execFileSync(
    ffmpeg,
    ["-y", "-i", mp4, "-vn", "-ac", "1", "-ar", "44100", "-b:a", "64k", mp3],
    { stdio: "ignore" },
  );
  durations[id] = durationSec(ffmpeg, mp3);
  console.log(`${durations[id]}s  ${statSync(mp3).size}b`);
}

writeFileSync(join(tmp, "durations.json"), JSON.stringify(durations, null, 2) + "\n");
console.log("done", Object.keys(durations).length);
