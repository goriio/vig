import {
  Avatar,
  Badge,
  Burger,
  Button,
  Container,
  createStyles,
  Group,
  Header,
  Menu,
  Text,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { Logo } from './Logo';
import {
  BiBox,
  BiBorderAll,
  BiArchiveOut,
  BiLogOut,
  BiShoppingBag,
  BiUser,
} from 'react-icons/bi';
import { useState } from 'react';
import { BiSearch } from 'react-icons/bi';
import { useMediaQuery } from '@mantine/hooks';
import { useRouter } from 'next/router';
import { ActiveLink } from './ActiveLink';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { OrderWithVirtualItem } from '@/pages/orders';

const useStyles = createStyles((theme) => ({
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: theme.colors.gray[6],
    fontSize: '1rem',
    fontWeight: 'bold',
    textDecoration: 'none',

    [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
      padding: '16px 12px',
    },

    '&.active': {
      color: theme.colors.blue[7],
      borderBottom: 'none',

      [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
        borderBottom: `2px solid ${theme.colors.blue[7]}`,
      },
    },
  },

  drawer: {
    position: 'fixed',
    top: 60,
    left: '-100%',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    gap: '1rem',
    padding: '2rem',
    transition: '200ms',

    [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
      position: 'static',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 60,
    },
  },

  active: {
    left: 0,
    right: 0,
    background: theme.colors.dark[8],
  },
}));

function getOrdersLength(orders: OrderWithVirtualItem[]) {
  let count = 0;

  orders.forEach((order) => {
    if (!order.approvedAt) {
      count += 1;
    }
  });

  return count;
}

export function Nav() {
  const [burgerOpened, setBurgerOpened] = useState(false);
  const [search, setSearch] = useState('');
  const { classes, cx } = useStyles();
  const { data: session, status } = useSession();
  const theme = useMantineTheme();
  const smallScreen = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px`);
  const router = useRouter();

  const { data: orders } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await fetch('/api/order');
      return await response.json();
    },
  });

  return (
    <Header fixed height={60} style={{ zIndex: '200' }}>
      <Container>
        <Group sx={{ height: 60 }} position="apart" align="center">
          <Burger
            opened={burgerOpened}
            onClick={() => setBurgerOpened((current) => !current)}
            size="sm"
            sx={{ display: smallScreen ? 'block' : 'none' }}
          />
          <Logo />
          <nav
            className={cx(classes.drawer, { [classes.active]: burgerOpened })}
            onClick={() => setBurgerOpened(false)}
          >
            <ActiveLink className={classes.navLink} href="/">
              <BiBox />
              <Text>Market</Text>
            </ActiveLink>
            <ActiveLink className={classes.navLink} href="/sell">
              <BiArchiveOut />
              <Text>Sell</Text>
            </ActiveLink>
            <ActiveLink className={classes.navLink} href="/inventory">
              <BiBorderAll />
              <Text>Inventory</Text>
            </ActiveLink>
          </nav>
          <form
            onSubmit={(event) => {
              event.preventDefault();

              if (search.trim() === '') {
                showNotification({
                  message: 'You did not input something',
                  color: 'red',
                });
                return;
              }

              router.push(`/search/${search}`);
              setSearch('');
            }}
          >
            <TextInput
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
              }}
              aria-label="Search"
              placeholder="Search for virtual items"
              icon={<BiSearch />}
              size="md"
              sx={{ display: smallScreen ? 'none' : 'block' }}
            />
          </form>
          {session ? (
            <Menu width={200} position="bottom-end">
              <Menu.Target>
                <Avatar
                  src={session?.user?.image}
                  radius="xl"
                  sx={{ cursor: 'pointer' }}
                />
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Account</Menu.Label>
                <Menu.Item icon={<BiUser />} component={Link} href="/profile">
                  Profile
                </Menu.Item>
                <Menu.Item
                  icon={<BiShoppingBag />}
                  component={Link}
                  href="/orders"
                >
                  <Group>
                    <Text>Orders</Text>
                    {orders && <Badge>{getOrdersLength(orders)}</Badge>}
                  </Group>
                </Menu.Item>
                <Menu.Item
                  icon={<BiLogOut />}
                  component="button"
                  onClick={() => signOut()}
                  color="red"
                >
                  Log out
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          ) : (
            <Group>
              <Button variant="default" component={Link} href="/login">
                Log in
              </Button>
              <Button
                variant="gradient"
                gradient={{ from: 'indigo', to: 'cyan' }}
                component={Link}
                href="/signup"
              >
                Sign up
              </Button>
            </Group>
          )}
        </Group>
      </Container>
    </Header>
  );
}
