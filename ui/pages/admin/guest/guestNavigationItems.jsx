import { HomeIcon, Cog8ToothIcon } from '@heroicons/react/24/solid';

const guestNavigationItems = [
  { name: 'Home', href: '/default', icon: HomeIcon, category: 'Main' },
  { name: 'SettingPage', href: '/settings', icon: Cog8ToothIcon, category: 'Settings' },
   { name: 'GuerstProfilePage', href: '/profile:userId', icon: Cog8ToothIcon, category: 'Settings' },
];

export default guestNavigationItems;
