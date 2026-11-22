interface NavItem {
    title: string;
    href: string;
    children?: NavItem[];
}

export const navitems: NavItem[] = [
    {
        title: "Hjem",
        href: "/"
    },
    {
        title: "Tjenester",
        href: "/tjenester",
        children: [
            {
                title: "Webutvikling",
                href: "/tjenester/webutvikling"
            },
            {
                title: "Legetjenester",
                href: "/tjenester/legetjenester"
            },
            {
                title: "Kursvirksomhet",
                href: "/tjenester/kurs"
            }
        ]
    },
    {
        title: "Om oss",
        href: "/om-oss"
    },
    {
        title: "Priser",
        href: "/priser"
    },
    {
        title: "Kontakt oss",
        href: "/kontakt"
    }
];