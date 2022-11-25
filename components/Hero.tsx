import {
  ActionIcon,
  Box,
  Image,
  Overlay,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { useState } from 'react';
import { BiX } from 'react-icons/bi';

export function Hero() {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(true);

  return (
    <>
      {opened && (
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <ActionIcon
            style={{
              position: 'absolute',
              top: '0.5rem',
              right: '0.5rem',
              fontSize: '2rem',
              zIndex: '1',
            }}
            onClick={() => {
              setOpened(false);
            }}
          >
            <BiX />
          </ActionIcon>
          <Image
            fit="cover"
            height={300}
            sx={{ width: '100%' }}
            src="https://static3.gamerantimages.com/wordpress/wp-content/uploads/2021/03/counter-strike-removed-steam.jpg"
            alt="Hero image"
          />
          <Overlay
            gradient={`linear-gradient(0deg, ${theme.black} 20%, #312f2f 50%, transparent 100%)`}
            zIndex="0"
          />
          <Title
            order={3}
            sx={{
              position: 'absolute',
              bottom: '1rem',
              padding: '1rem',
            }}
          >
            Trade virtual items with easier access
          </Title>
        </Box>
      )}
    </>
  );
}
