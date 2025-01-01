import React from 'react';
import { Button, Stack } from '@mantine/core';
import { useTimeout } from '@mantine/hooks';
import { IconDownload } from '@tabler/icons-react';

function formatDatePart(part: number) {
  return part.toString().padStart(2, '0');
}

function makeZipFilename() {
  const now = new Date();
  const year = now.getFullYear();
  const month = formatDatePart(now.getMonth() + 1);
  const day = formatDatePart(now.getDate());
  const hours = formatDatePart(now.getHours());
  const minutes = formatDatePart(now.getMinutes());
  return `${year}-${month}-${day}_${hours}-${minutes}_gopro-unchapter.zip`;
}

export interface ProcessingResultProps {
  zipURL: string;
  onReset: () => void;
}

export default function ProcessingResult(props: ProcessingResultProps) {
  const { zipURL, onReset } = props;
  const [downloading, setDownloading] = React.useState(false);
  const downloadTimeoutHandlers = useTimeout(() => setDownloading(false), 5000);

  const handleDownload = () => {
    setDownloading(true);
    downloadTimeoutHandlers.start();
  };

  return (
    <Stack align="center">
      <Button
        component="a"
        href={zipURL}
        download={makeZipFilename()}
        onClick={handleDownload}
        size="lg"
        rightSection={<IconDownload />}
        loading={downloading}
      >
        Download
      </Button>
      <Button onClick={onReset} variant="light">Reset</Button>
    </Stack>
  );
}
