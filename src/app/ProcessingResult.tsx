import { Button, Stack } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';

export interface ProcessingResultProps {
  zipURL: string;
  onReset: () => void;
}

export default function ProcessingResult(props: ProcessingResultProps) {
  const { zipURL, onReset } = props;

  return (
    <Stack align="center">
      <Button
        component="a"
        href={zipURL}
        download="zipTest.zip"
        size="lg"
        rightSection={<IconDownload />}
      >
        Download
      </Button>
      <Button onClick={onReset} variant="light">Reset</Button>
    </Stack>
  );
}
