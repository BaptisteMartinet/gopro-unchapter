'use client'

import { rem, Group, Text, Box } from '@mantine/core';
import { Dropzone, DropzoneProps as MantineDropzoneProps, MIME_TYPES } from '@mantine/dropzone';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import { convertGigabytesToBytes } from '@/utils/bytes';

const MaxFiles = 999; // Arbitrary value
const MaxFileSize = convertGigabytesToBytes(8); // Arbitrary value. GoPro files shoud not be more than 4gb? Also FFmpeg will certainly run out of memory.
const AcceptedMIMETypes = [MIME_TYPES.mp4];

type DropzoneProps = Omit<MantineDropzoneProps, 'maxFiles' | 'maxSize' | 'accept' | 'multiple'>;

export default function DropZone(props: DropzoneProps) {
  return (
    <Dropzone
      maxFiles={MaxFiles}
      maxSize={MaxFileSize}
      accept={AcceptedMIMETypes}
      multiple
      bd="2px dashed grey"
      p={16}
      {...props}
    >
      <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
        <Dropzone.Accept>
          <IconUpload
            style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
            stroke={1.5}
          />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <IconX
            style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
            stroke={1.5}
          />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <IconPhoto
            style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
            stroke={1.5}
          />
        </Dropzone.Idle>

        <Box>
          <Text size="xl" inline>
            Drag videos here or click to select files
          </Text>
          <Text size="sm" c="dimmed" inline mt={7}>
            Add as many videos as you like
          </Text>
        </Box>
      </Group>
    </Dropzone>
  );
}