import ffmpegPath from "ffmpeg-static";
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";

const input = "download-upscaled.mp4";
const outputDir = "public/frames/first-video";

rmSync(outputDir, {
  recursive: true,
  force: true,
});

mkdirSync(outputDir, {
  recursive: true,
});

execFileSync(
  ffmpegPath,
  [
    "-i",
    input,

    "-c:v",
    "libwebp",

    "-quality",
    "100",

    "-compression_level",
    "6",

    `${outputDir}/frame-%03d.webp`,
  ],
  {
    stdio: "inherit",
  },
);

console.log("Frames extracted!");
