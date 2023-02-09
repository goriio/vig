import { Group, Paper, Table, Text } from '@mantine/core';
import { Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';
import { forwardRef } from 'react';
import { Logo } from './Logo';

type SaleWithVirtualItem = Prisma.SaleGetPayload<{
  include: {
    buyer: true;
    virtualItem: true;
  };
}>;

type SalesReportTemplateProps = {
  sales: SaleWithVirtualItem[];
};

export const SalesReportTemplate = forwardRef<
  HTMLDivElement,
  SalesReportTemplateProps
>(({ sales }, ref) => {
  const { data } = useSession();

  return (
    <div style={{ overflow: 'hidden', height: 0 }}>
      <Paper
        ref={ref}
        px="xl"
        py="lg"
        radius="xs"
        sx={(theme) => ({
          color: theme.colors.dark[8],
          backgroundColor: theme.white,
        })}
      >
        <Group position="apart" mb="lg">
          <Logo />
          <Text fw={600} size="lg">
            Monthly sales report
          </Text>
        </Group>
        <Group position="apart">
          <Text>Sales report for {data?.user?.name}</Text>
          <Text>
            Total sales: PHP{' '}
            {sales
              .reduce((total, sale) => total + sale.virtualItem.price, 0)
              .toFixed(2)}
          </Text>
        </Group>
        <Group position="apart" mb="lg">
          <Text>{dayjs().format('MMM YYYY')}</Text>
          <Text>Count of sales: {sales.length}</Text>
        </Group>
        <Table sx={(theme) => ({ color: theme.colors.dark[9] })}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Buyer</th>
              <th>Reference no</th>
              <th>Virtual item</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id}>
                <td>{dayjs(sale.approvedAt).format('DD/MM/YYYY')}</td>
                <td>{sale.buyer.name}</td>
                <td>{sale.referenceNo}</td>
                <td>{sale.virtualItem.name}</td>
                <td>
                  <Text ta="right">
                    PHP {sale.virtualItem.price.toFixed(2)}
                  </Text>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Paper>
    </div>
  );
});

SalesReportTemplate.displayName = 'SalesReportTemplate';
