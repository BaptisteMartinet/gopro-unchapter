import { FileWithPath } from '@mantine/dropzone';
import { fetchFile } from "@ffmpeg/util";
import { BlobReader, BlobWriter, ZipWriter } from '@zip.js/zip.js';
import { indexMultipleArrayItems } from '@/utils/array';
import { saveFile } from '@/utils/saveFile';
import { parseGoproFilename } from '@/utils/gopro';
import { useFFmpeg } from '@/hooks';
import DropZone from './DropZone';

export default function VideoProcess() {
  const { ffmpeg, ensureFFmpegLoaded, loading, error } = useFFmpeg();

  const handleFiles = (files: Array<FileWithPath>) => {
    const _handleFiles = async () => {
      const filesWithInfo = Array.from(files).map((file) => ({
        file,
        info: parseGoproFilename(file.name),
      }));
      const indexedFiles = indexMultipleArrayItems(filesWithInfo, ({ info }) => {
        const { type, encoding, chapter } = info;
        return `${type}:${encoding}:${chapter}`;
      });
      console.log(`Concatenating ${filesWithInfo.length} files into ${indexedFiles.size} files.`);

      await ensureFFmpegLoaded();

      const zipFileWriter = new BlobWriter();
      const zipWriter = new ZipWriter(zipFileWriter);

      for (const indexedFile of indexedFiles.values()) {
        console.log(`Writing ${indexedFile.length} files.`);
        for (const file of indexedFile)
          await ffmpeg.writeFile(file.file.name, await fetchFile(file.file));
        console.log('Writing text content');
        const textContent = indexedFile.map(({ file }) => `file '${file.name}'`).join('\n');
        await ffmpeg.writeFile('copyContent.txt', textContent);
        console.log('Concatenating');
        await ffmpeg.exec(['-f', 'concat', '-safe', '0', '-i', 'copyContent.txt', '-c', 'copy', 'output.mp4']);
        console.log('Reading');
        const data = await ffmpeg.readFile("output.mp4");
        console.log('Blobing');
        const indexInfo = indexedFile[0].info;
        const chapterFilename = `${indexInfo.chapter}.mp4`;
        zipWriter.add(chapterFilename, new BlobReader(new Blob([data], { type: "video/mp4" })));
        console.log('Cleaning up');
        await ffmpeg.deleteFile('output.mp4');
        await ffmpeg.deleteFile('copyContent.txt');
        for (const file of indexedFile)
          await ffmpeg.deleteFile(file.file.name);
      }
      const zip = await zipWriter.close();
      saveFile(zip, 'test.zip');
    };

    if (files.length < 2)
      return;
    _handleFiles().catch(console.error);
  };

  if (loading)
    return <p>loading...</p>;

  if (error)
    return <p>{error.message}</p>;

  return (
    <DropZone onDrop={(files) => handleFiles(files)} />
  );
}
