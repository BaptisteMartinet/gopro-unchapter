import { Box, Progress, Text } from '@mantine/core';

export interface ProcessingProgressProps {
  step: number;
  steps: number;
  message: string;
}

export default function ProcessingProgress(props: ProcessingProgressProps) {
  const { step, steps, message } = props;
  const value = step / steps * 100;

  return (
    <Box>
      <Progress value={value} animated />
      <Text mt={8}>{message}</Text>
    </Box>
  );
}
