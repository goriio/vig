import { Hero } from '@/components/Hero';
import { ItemList } from '@/components/ItemList';
import { useQuery } from '@tanstack/react-query';

export default function Home() {
  const { data: virtualItems } = useQuery({
    queryKey: ['market'],
    queryFn: async () => {
      const data = await fetch('/api/market');
      return await data.json();
    },
  });

  return (
    <>
      <Hero />
      <ItemList
        title="Market"
        items={virtualItems}
        noItem={{ message: 'There are no virtual items yet.' }}
      />
    </>
  );
}
