import { ItemList } from '@/components/ItemList';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useState } from 'react';

export default function Search() {
  const router = useRouter();
  const { query } = router.query;
  const [items, setItems] = useState(null);
  const [filtered, setFiltered] = useState(null);
  const currentUser = false;

  //   useEffect(() => {
  //     (async () => {
  //       const items = currentUser
  //         ? await getDocs(
  //             query(
  //               collection(db, 'items'),
  //               where('inMarket', '==', true),
  //               where('owner.id', '!=', currentUser.uid)
  //             )
  //           )
  //         : await getDocs(
  //             query(collection(db, 'items'), where('inMarket', '==', true))
  //           );
  //       setItems(items);
  //     })();
  //   }, [currentUser]);

  //   useEffect(() => {
  //     if (items?.docs) {
  //       const filteredItems = items?.docs.filter((item) => {
  //         const { title } = item.data();
  //         if (title.toLowerCase().includes(string.toLowerCase())) {
  //           return item;
  //         }
  //       });
  //       setFiltered({ docs: filteredItems });
  //     }
  //   }, [string, items]);

  return (
    <ItemList
      title={`Search results for: ${query}`}
      items={filtered}
      noItem={{
        message: `No results for ${query}`,
      }}
    />
  );
}
