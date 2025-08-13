'use client'

import Link from "next/link";


export default function NavPage() {
    const MenuItems = [
        {
            title: "NAV",
            items: [
                {
                    icon: '/',
                    label: 'Utilisateur',
                    href: ''
                },
                  {
                    icon: '/',
                    label: 'Projet',
                    href: ''
                },
                  {
                    icon: '/',
                    label: 'ModelIA',
                    href: ''
                },
                  {
                    icon: '/',
                    label: 'Prompt',
                    href: ''
                },  {
                    icon: '/',
                    label: 'Contenu',
                    href: ''
                },
                  {
                    icon: '/',
                    label: 'Template',
                    href: ''
                },
                  {
                    icon: '/',
                    label: 'Configuration',
                    href: ''
                }
            ]
        }
    ]
    return(
        <div className="justify-center items-center  p-4 bg-gray-50">
            {MenuItems.map(i => (
                <div className="flex flex-col gap-2" key={ i.title}>
                    <span className="hidden lg:block text-gray-400 font-light my-4">{i.title}</span>
                {i.items.map(item=> (
                    <Link href={item.href} key={item.label}
                    className="max-w-md flex items-center justify-center bg-white text-blue-500 py-2 hover:text-blue-700  text-sm w-full shadow-md rounded-lg ">
                        <span>{item.label}</span>
                    </Link>
                ))}
                </div>
            ))}
        <div className="mt-5 text-sm">
            <Link href="/">
            <button className="text-sm text-blue-500 hover:text-blue-700  rounded-full ring-[2px] px-3">Profil</button>
            </Link>
        </div>

        </div>
    )
}
