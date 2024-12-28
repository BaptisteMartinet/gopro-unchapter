'use client'

import React from 'react';
import { Anchor, Box, Center, Group, Text, Tooltip } from '@mantine/core';
import VideoProcess from './VideoProcess';

export default function Home() {
  return (
    <Center pos="relative" w="100%" h="100dvh">
      <Group gap="xl">
        <Box maw={400}>
          <Text fz="h1" c="white" fw={500} mb={8}>GoPro Unchapter</Text>
          <Text size="lg">
            Easily reconcile GoPro video chapters to only get the videos you need.
            <br />
            Everything happens in the browser. Files are not sent to any server.
          </Text>
          <br />
          <Tooltip label="GoPro documentation ↗">
            <Anchor
              href="https://community.gopro.com/s/article/GoPro-Camera-File-Chaptering-Information"
              target="_blank"
            >
              What is file chaptering?
            </Anchor>
          </Tooltip>
        </Box>
        <VideoProcess />
      </Group>
      <Text pos="absolute" bottom={16} left={0} w="100%" ta="center">
        {'Made by '}
        <Tooltip label="LinkedIn ↗">
          <Anchor
            href="https://www.linkedin.com/in/baptiste-martinet/"
            target="_blank"
          >
            Baptiste Martinet
          </Anchor>
        </Tooltip>
        {' - '}
        <Tooltip label="GitHub ↗">
          <Anchor
            href="https://github.com/BaptisteMartinet/gopro-unchapter"
            target="_blank"
          >
            Source code
          </Anchor>
        </Tooltip>
      </Text>
    </Center>
  );
}
