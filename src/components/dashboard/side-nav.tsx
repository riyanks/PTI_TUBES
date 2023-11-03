'use client';

import React, { useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { SIDENAV_ITEMS } from '@/constants';
import { SideNavItem } from '@/types';
import Image from 'next/image';
import { ChevronDownIcon } from '@radix-ui/react-icons';

const SideNav = () => {
    return (
        <div className="md:w-60 bg-white h-screen flex-1 fixed border-r border-zinc-200 hidden md:flex">
            <div className="flex flex-col space-y-6 w-full">
                <Link
                    href="/"
                    className="flex flex-row space-x-3 items-center justify-center md:justify-start md:px-6 border-b border-zinc-200 h-12 w-full"
                >
                    <Image
                        src="/image/logo-bmkg.png"
                        alt='logobmkg'
                        width={30}
                        height={30}
                    />
                    <span className="font-extrabold text-sm flex">Stasiun Geofisika Padang Panjang</span>
                </Link>

                <div className="flex flex-col space-y-2  md:px-6 ">
                    {SIDENAV_ITEMS.map((item, idx) => {
                        return <MenuItem key={idx} item={item} />;
                    })}
                </div>
            </div>
        </div>
    );
};

export default SideNav;

const MenuItem = ({ item }: { item: SideNavItem }) => {
    const pathname = usePathname();
    const [subMenuOpen, setSubMenuOpen] = useState(false);
    const toggleSubMenu = () => {
        setSubMenuOpen(!subMenuOpen);
    };

    return (
        <div className="">
            {item.submenu ? (
                <>
                    <button
                        onClick={toggleSubMenu}
                        className={`flex flex-row items-center p-2 rounded-lg hover-bg-zinc-100 w-full justify-between hover:bg-zinc-200 ${pathname.includes(item.path) ? 'bg-zinc-100' : ''
                            }`}
                    >
                        <div className="flex flex-row space-x-4 items-center">
                            {item.icon}
                            <span className=" font-semibold text-md flex">{item.title}</span>
                        </div>

                        <div className={`${subMenuOpen ? 'rotate-180' : ''} flex`}>
                        </div>
                    </button>

                    {subMenuOpen && (
                        <div className="my-2 ml-12 flex flex-col space-y-4">
                            {item.subMenuItems?.map((subItem, idx) => {
                                return (
                                    <div className='flex flex-row items-center gap-2'>
                                        <div>
                                            {subItem.icon}
                                        </div>
                                        <Link
                                            key={idx}
                                            href={subItem.path}
                                            className={`${subItem.path === pathname ? 'font-extrabold' : ''
                                                }`}
                                        >
                                            <span className='text-sm'>{subItem.title}</span>
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            ) : (
                <Link
                    href={item.path}
                    className={`flex flex-row space-x-4 items-center p-2 rounded-lg hover:bg-zinc-100 ${item.path === pathname ? 'bg-zinc-100' : ''
                        }`}
                >
                    {item.icon}
                    <span className="font-semibold text-md flex">{item.title}</span>
                </Link>
            )}
        </div>
    );
};