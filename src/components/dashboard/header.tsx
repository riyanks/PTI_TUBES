'use client';

import React from 'react';

import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';

import useScroll from '@/hooks/use-scroll';
import { cn } from '@/utils/utils';
import Image from 'next/image';
import Navbar from '../ui/Navbar';

const Header = () => {
    const scrolled = useScroll(5);
    const selectedLayout = useSelectedLayoutSegment();

    return (
        <div
            className={cn(
                `sticky inset-x-0 top-0 z-30 w-full transition-all border-b border-gray-200`,
                {
                    'border-b border-gray-200 bg-white/75 backdrop-blur-lg': scrolled,
                    'border-b border-gray-200 bg-white': selectedLayout,
                },
            )}
        >
            <div className="flex h-[47px] items-center justify-between px-4">
                <div className="flex items-center space-x-4">
                    <Link
                        href=""
                        className="flex flex-row space-x-3 items-center justify-center md:hidden"
                    >
                        <Image
                            src="/image/logo-bmkg.png"
                            alt='logobmkg'
                            width={30}
                            height={30}
                        />
                        <span className="font-bold text-md flex">Stasiun Geofisika Padang Panjang</span>
                    </Link>
                </div>

                <div className="hidden md:block">
                    <Navbar />
                </div>
            </div>
        </div>
    );
};

export default Header;