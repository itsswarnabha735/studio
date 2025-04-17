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
    },
    {
        href: "/maintenance",
        title: "Maintenance",
        icon: <Icons.settings/>
    },
    {
        href: "/care",
        title: "Care",
        icon: <Icons.plant/>,
        subMenuItems: [
            {
                href: "/care/pets",
                title: "Pets",
                icon: <Icons.dog/>
            },
            {
                href: "/care/plants",
                title: "Plants",
                icon: <Icons.plant/>
            }
        ]
    },
    {
        href: "/planning",
        title: "Planning",
        icon: <Icons.calendar/>
    }
];
