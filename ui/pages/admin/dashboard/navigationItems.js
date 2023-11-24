import { HomeIcon, UserGroupIcon, ChartPieIcon, AcademicCapIcon, PhotoIcon, InboxArrowDownIcon, Cog8ToothIcon, NewspaperIcon } from '@heroicons/react/24/solid';

const navigationItems = [
  { name: 'Home', href: '/default', icon: HomeIcon, category: 'Main' },
   { name: 'Subscribers', href: '/subscribers', icon: UserGroupIcon, category: 'Email' },
   { name: 'ContactList', href: '/contact-list', icon: InboxArrowDownIcon, category: 'Email' }, 
   { name: 'AlbumForm', href: '/album-form', icon: PhotoIcon, category: 'Forms' },
   { name: 'NewPostForm', href: '/new-post', icon: NewspaperIcon, category: 'Forms' },
   { name: 'ExpenseIncome', href: '/expense-income', icon: NewspaperIcon, category: 'Transactions' },
   { name: 'TransactionChart', href: '/transaction-chart', icon: NewspaperIcon, category: 'Charts' },
    { name: 'MainAnalytics', href: '/main-analytics', icon: ChartPieIcon, category: 'Charts' },
   { name: 'SettingPage', href: '/settings', icon: Cog8ToothIcon, category: 'Settings'},
    { name: 'AdminProfilePage', href: '/profile:userId', icon: Cog8ToothIcon, category: 'Settings' },
];

export default navigationItems;
