import { Button } from '@mantine/core';

export interface ProcessingResultProps {
  zipURL: string;
}

export default function ProcessingResult(props: ProcessingResultProps) {
  const { zipURL } = props;
  return (
    <Button component='a' href={zipURL} download="zipTest.zip">Download</Button>
  );
}
