import { Button, Stack, Text } from '@mantine/core';

export interface ProcessingErrorProps {
  message: string;
  onReset: () => void;
}

export default function ProcessingError(props: ProcessingErrorProps) {
  const { message, onReset } = props;

  return (
    <Stack align="center">
      <Text c="red">{message}</Text>
      <Button onClick={onReset} variant="light">Reset</Button>
    </Stack>
  );
}
