// Dialog screens
import Bridge from '@/components/screens/Bridge';
import Auth from '@/components/screens/Auth';
import Sign from '@/components/screens/Sign';
import User from '@/components/screens/User';
import Loader from '@/components/screens/Loader';
import SignPermission from '@/components/screens/SignPermission';
import NotFound from '@/components/screens/NotFound';
import LoginProvider from '@/components/screens/LoginProvider';

// Public screens
import PublicAuth from '@/components/screens/PublicAuth';

const routes = [
  {
    path: '/public/auth',
    name: 'PublicAuthScreen',
    component: PublicAuth,
  },
  {
    path: '/account',
    name: 'User',
    component: User,
    meta: {
      isDialog: true,
    },
  },
  {
    path: '/bridge',
    name: 'Bridge',
    component: Bridge,
  },
  {
    path: '/loader',
    name: 'Loader',
    component: Loader,
  },
  {
    path: '/permission',
    name: 'SignPermission',
    component: SignPermission,
    meta: {
      isDialog: true,
    },
  },
  {
    path: '/auth',
    name: 'AuthScreen',
    component: Auth,
    meta: {
      isDialog: true,
    },
  },
  {
    path: '/sign',
    name: 'SignScreen',
    component: Sign,
    meta: {
      isDialog: true,
    },
  },
  {
    path: '/login',
    name: 'LoginProvider',
    component: LoginProvider,
  },
  {
    path: '*',
    name: 'NotFound',
    component: NotFound,
  },
];

export default routes;
