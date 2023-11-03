
import { CheckboxIcon, DashboardIcon, DotFilledIcon, TargetIcon } from '@radix-ui/react-icons';
import { SideNavItem } from './types';

export const SIDENAV_ITEMS: SideNavItem[] = [
    {
        title: 'Dashboard',
        path: '/dashboard',
        icon: <DashboardIcon />,
    },
    {
        title: 'Sensors',
        path: '/sensor',
        icon: <TargetIcon />,
        submenu: true,
        subMenuItems: [
            { title: 'Sismon WRS', path: '/sensor/sismon_wrs', icon: <DotFilledIcon /> },
            { title: 'Accelerograph', path: '/sensor/status_acc', icon: <DotFilledIcon /> },
            { title: 'Intensitymeter', path: '/sensor/status_int', icon: <DotFilledIcon /> },
        ],
    },
    {
        title: 'Status Sensors',
        path: '/status_sensor',
        icon: <CheckboxIcon />,
        submenu: true,
        subMenuItems: [
            { title: 'Sismon WRS', path: '/status_sensor/sensor/sismon_wrs' },
            { title: 'Accelerograph', path: '/status_sensor/sensor/status_acc' },
            { title: 'Intensitymeter', path: '/status_sensor/sensor/status_int' },
        ],
    },
];