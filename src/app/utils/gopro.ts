import assert from "assert";
import { isStrNum } from "./string";
// Doc https://community.gopro.com/s/article/GoPro-Camera-File-Naming-Convention?language=en_US
const GoproFilenameRegex = /^G([HX])(\d\d|[A-Z][A-Z])(\d\d\d\d).MP4$/;

export function parseGoproFilename(filename: string) {
  const res = GoproFilenameRegex.exec(filename);
  if (!res)
    throw new Error(
      `Filename ${filename} does not match GOPRO file naming convention`
    );
  const rawEncoding = res.at(1);
  const rawChapter = res.at(2);
  const rawFileNumber = res.at(3);
  assert(rawEncoding && rawChapter && rawFileNumber);
  const encoding = rawEncoding === "H" ? "AVC" : "HEVC";
  const chapter = rawChapter;
  const fileNumber = Number(rawFileNumber);
  return {
    type: isStrNum(rawChapter) ? "chaptered" : "looping",
    encoding,
    chapter,
    fileNumber,
  } as const;
}
