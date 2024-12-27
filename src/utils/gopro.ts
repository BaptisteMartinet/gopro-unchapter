import assert from "assert";
import { isStrNum } from "./string";
// Doc https://community.gopro.com/s/article/GoPro-Camera-File-Naming-Convention?language=en_US
const GoproFilenameRegex = /^G([HX])(\d\d|[A-Z][A-Z])(\d\d\d\d).(mp4|MP4)$/;

export function parseGoproFilename(filename: string) {
  const res = GoproFilenameRegex.exec(filename);
  if (!res)
    throw new Error(
      `Filename ${filename} does not match GOPRO file naming convention`
    );
  const rawEncoding = res.at(1);
  const rawChapter = res.at(2);
  const rawFileNumber = res.at(3);
  const rawMimeType = res.at(4);
  assert(
    rawEncoding && rawChapter && rawFileNumber,
    `Filename: ${filename}, Encoding: ${rawEncoding}, chapter: ${rawChapter}, fileNumber: ${rawFileNumber}, mimeType: ${rawMimeType}`
  );
  const encoding = rawEncoding === "H" ? "AVC" : "HEVC";
  const chapter = rawChapter;
  const fileNumber = Number(rawFileNumber);
  const mimeType = rawMimeType;
  return {
    type: isStrNum(rawChapter) ? "chaptered" : "looping",
    encoding,
    chapter,
    fileNumber,
    mimeType,
  } as const;
}
