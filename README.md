# GoPro Unchapter

A simple static website to merge GoPro video chapters.  
Works 100% locally without any server.

### Chaptering look around
Gopro uses a technique called file chaptering for two main reasons:  
- Prevent file corruptions from deleting hours of recording.
- Respect the FAT32 4gb file size limitation.

A chapter can be created for two reason:
- The file size of 4gb has been reached.
- The GoPro is in loop mode and is auto chaptering files to make the loop work (eg. Creating segments of 1 minute and removing the first one each time a new one is added when GoPro is in 5 minutes loop mode).

## Tech Stack
- NextJS
- FFMpeg.wasm
- jszip

## TODO
- [ ] Re-encode in different format (eg. .mp4 -> .avi)
- [ ] Apply video compression (.eg Video resolution, bitrate, etc)

