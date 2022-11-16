import { ItemList } from '@/components/ItemList';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Search() {
  const [virtualItems, setVirtualItems] = useState<any>(null);
  const router = useRouter();
  const query = router.query.query as string;

  useEffect(() => {
    async function search(query: string) {
      const response = await fetch(`/api/search/${query}`);
      const data = await response.json();
      setVirtualItems(data);
    }

    search(query);
  }, [query]);

  return (
    <ItemList
      title={`Search results for: ${query}`}
      items={virtualItems}
      noItem={{
        message: `No results for ${query}`,
      }}
    />
  );
}
