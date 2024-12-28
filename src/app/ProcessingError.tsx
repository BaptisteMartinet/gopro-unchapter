import { Text } from '@mantine/core';

export interface ProcessingErrorProps {
  message: string;
}

export default function ProcessingError(props: ProcessingErrorProps) {
  const { message } = props;
  return <Text>{message}</Text>;
}
