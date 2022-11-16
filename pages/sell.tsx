import { ItemList } from '@/components/ItemList';
import { Button, Group, Indicator } from '@mantine/core';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';

export default function Sell() {
  const router = useRouter();

  const { data: virtualItems } = useQuery({
    queryKey: ['sell'],
    queryFn: async () => {
      const data = await fetch('/api/sell');
      return await data.json();
    },
  });

  const { data: sales } = useQuery({
    queryKey: ['sales'],
    queryFn: async () => {
      const response = await fetch('/api/sale');
      return await response.json();
    },
  });

  return (
    <ItemList
      title="Sell"
      rightButton={
        <Group>
          <Button variant="subtle" onClick={() => router.push('/sales-report')}>
            View sales report
          </Button>
          <Indicator
            showZero={false}
            inline
            dot
            processing
            label={sales?.length}
            size={22}
          >
            <Button variant="light" onClick={() => router.push('/sales')}>
              Sales
            </Button>
          </Indicator>
        </Group>
      }
      items={virtualItems}
      noItem={{
        message: `You don't have items on sell`,
      }}
    />
  );
}
