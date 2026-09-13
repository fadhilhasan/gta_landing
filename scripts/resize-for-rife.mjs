import ffmpegPath from "ffmpeg-static";
import { execFileSync } from "node:child_process";

const input = "Jason_Duval_Video_Clip.mp4";
const output = "jason-720p.mp4";

execFileSync(
  ffmpegPath,
  [
    "-i",
    input,

    "-vf",
    "scale=1280:720",

    "-c:v",
    "libx264",

    "-crf",
    "15",

    "-preset",
    "slow",

    "-pix_fmt",
    "yuv420p",

    "-an",

    output,
  ],
  {
    stdio: "inherit",
  },
);

console.log("Done:", output);
