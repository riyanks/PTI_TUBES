import { CheckboxIcon, DashboardIcon, DotFilledIcon, TargetIcon } from '@radix-ui/react-icons';
import { SideNavItem } from './types';

// Fungsi helper untuk menentukan gaya huruf
const getIconStyle = (size: number) => ({
  width: `${20}px`,
  height: `${20}px`,
});

export const SIDENAV_ITEMS: SideNavItem[] = [
    {
        title: 'Dashboard',
        path: '/dashboard',
        icon: <DashboardIcon style={getIconStyle(24)} />,
    },
    {
        title: 'Sensors',
        path: '/sensor',
        icon: <TargetIcon style={getIconStyle(24)} />,
        submenu: true,
        subMenuItems: [
            { title: 'Sismon WRS', path: '/sensor/sismon_wrs', icon: <DotFilledIcon style={getIconStyle(16)} /> },
            { title: 'Accelerograph', path: '/sensor/status_acc', icon: <DotFilledIcon style={getIconStyle(16)} /> },
            { title: 'Intensitymeter', path: '/sensor/status_int', icon: <DotFilledIcon style={getIconStyle(16)} /> },
        ],
    },
    {
        title: 'Status Sensors',
        path: '/status_sensor',
        icon: <CheckboxIcon style={getIconStyle(24)} />,
        submenu: true,
        subMenuItems: [
            { title: 'Sismon WRS', path: '/status_sensor/sensor/sismon_wrs' },
            { title: 'Accelerograph', path: '/status_sensor/sensor/status_acc' },
            { title: 'Intensitymeter', path: '/status_sensor/sensor/status_int' },
        ],
    },
];
