import React from 'react';
import { Icons } from './icons';

export const SidebarItems = [
    {
        href: "/",
        title: "Home",
        icon: <Icons.home/>
    },
    {
        href: "/household",
        title: "Household",
        icon: <Icons.user/>
    },
    {
        href: "/tasks",
        title: "Tasks",
        icon: <Icons.listChecks/>
    }
];
