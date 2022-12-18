import {
  ActionIcon,
  Button,
  Card,
  Grid,
  Group,
  Select,
  Skeleton,
  Stack,
  Table,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { Sale, User, VirtualItem } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Line } from 'react-chartjs-2';
import {
  BiCoinStack,
  BiLeftArrow,
  BiLineChart,
  BiRightArrow,
} from 'react-icons/bi';
import { BsBoxSeam, BsFileEarmarkSlides } from 'react-icons/bs';
import { useState } from 'react';

type SaleWithBuyerAndVirtualItem = Sale & {
  buyer: User;
  virtualItem: VirtualItem;
};

function pesoFormat(price: number) {
  return `PHP ${price.toFixed(2)}`;
}

function getTotalSales(sales: SaleWithBuyerAndVirtualItem[]) {
  return sales.reduce((total, sale) => {
    return total + sale.virtualItem.price;
  }, 0);
}

function getAverageSale(sales: SaleWithBuyerAndVirtualItem[]) {
  return getTotalSales(sales) / sales.length || 0;
}

function getPreviousDays({
  numberOfDays,
  currentDate = 0,
}: {
  numberOfDays: number;
  currentDate?: number;
}) {
  const result = [];

  for (
    let index = numberOfDays - 1 + currentDate;
    index >= currentDate;
    index--
  ) {
    const date = new Date();
    date.setDate(date.getDate() - index);

    result.push(date);
  }

  return result;
}

function getSales(days: Date[], sales: SaleWithBuyerAndVirtualItem[]) {
  return days.map((day) => {
    let count = 0;

    sales.forEach((sale) => {
      if (dayjs(day).isSame(sale.approvedAt, 'day')) {
        count += 1;
      }
    });

    return count;
  });
}

function Loading() {
  return (
    <Grid columns={4} align="stretch">
      <Grid.Col sm={3} span={4}>
        <Skeleton height={393} />
      </Grid.Col>
      <Grid.Col sm={1} span={4}>
        <Stack>
          <Skeleton height={120} />
          <Skeleton height={120} />
          <Skeleton height={120} />
        </Stack>
      </Grid.Col>
    </Grid>
  );
}

export default function SalesReport() {
  const { status, data } = useSession();
  const router = useRouter();
  const [frequency, setFrequency] = useState<string | null>('7');
  const [currentIndexDate, setCurrentIndexDate] = useState(0);

  if (status === 'unauthenticated') {
    router.push('/signup');
  }

  const { data: sales } = useQuery<SaleWithBuyerAndVirtualItem[]>({
    queryKey: ['salesReport'],
    queryFn: async () => {
      const response = await fetch('/api/salesReport');
      return await response.json();
    },
  });

  return (
    <>
      <Group position="apart" mb="md">
        <Title order={4}>Sales report for {data?.user?.name}</Title>
        <Button variant="subtle" onClick={() => router.push('/')}>
          Go home
        </Button>
      </Group>

      {!sales ? (
        <Loading />
      ) : (
        <Grid columns={4} align="stretch">
          <Grid.Col sm={3} span={4}>
            <Card sx={{ height: '100%' }}>
              <Group position="apart" align="center" mb="md">
                <Title size="h6">Sales recap statistics</Title>
                <Group>
                  <Select
                    value={frequency}
                    onChange={setFrequency}
                    data={[
                      { value: '7', label: 'Weekly' },
                      { value: '30', label: 'Monthly' },
                    ]}
                    size="xs"
                  />
                  <ActionIcon
                    onClick={() =>
                      setCurrentIndexDate(
                        (current) => current + Number(frequency)
                      )
                    }
                    title="Previous"
                  >
                    <BiLeftArrow />
                  </ActionIcon>
                  <ActionIcon
                    onClick={() =>
                      setCurrentIndexDate(
                        (current) => current - Number(frequency)
                      )
                    }
                    title="Next"
                  >
                    <BiRightArrow />
                  </ActionIcon>
                </Group>
              </Group>
              <Line
                options={{
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        stepSize: 1,
                      },
                    },
                  },
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                      position: 'top',
                    },
                  },
                }}
                data={{
                  labels: getPreviousDays({
                    numberOfDays: Number(frequency),
                    currentDate: currentIndexDate,
                  }).map((day) => dayjs(day).format('MMM D')),
                  datasets: [
                    {
                      label: 'Sales',
                      data: getSales(
                        getPreviousDays({
                          numberOfDays: Number(frequency),
                          currentDate: currentIndexDate,
                        }),
                        sales
                      ),
                      borderColor: 'rgb(53, 162, 235)',
                      backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    },
                  ],
                }}
              />
            </Card>
          </Grid.Col>

          <Grid.Col sm={1} span={4}>
            <Stack>
              {[
                {
                  color: 'blue',
                  icon: <BiLineChart />,
                  text: 'Total Sales',
                  data: pesoFormat(getTotalSales(sales)),
                },
                {
                  color: 'yellow',
                  icon: <BiCoinStack />,
                  text: 'Average Sale',
                  data: pesoFormat(getAverageSale(sales)),
                },
                {
                  color: 'green',
                  icon: <BsBoxSeam />,
                  text: 'Count of Sales',
                  data: sales.length,
                },
              ].map((card, index) => (
                <Card key={index}>
                  <ThemeIcon
                    variant="light"
                    size="lg"
                    radius="xl"
                    mb="md"
                    color={card.color}
                  >
                    {card.icon}
                  </ThemeIcon>
                  <Text size="sm">{card.text}</Text>
                  <Title order={4}>{card.data}</Title>
                </Card>
              ))}
            </Stack>
          </Grid.Col>

          <Grid.Col>
            <Card>
              <Title order={6} mb="sm">
                Recently sold virtual items
              </Title>
              <Table>
                <thead>
                  <tr>
                    <th>Virtual Item</th>
                    <th>Approved Date</th>
                    <th>Price</th>
                    <th>Reference no.</th>
                  </tr>
                </thead>
                <tbody>
                  {sales?.map((sale) => (
                    <tr key={sale.id}>
                      <td>{sale.virtualItem.name}</td>
                      <td>
                        {dayjs(sale.approvedAt).format('MMM D, YYYY h:mm A')}
                      </td>
                      <td>{pesoFormat(sale.virtualItem.price)}</td>
                      <td>{sale.referenceNo}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </Grid.Col>
        </Grid>
      )}
    </>
  );
}
