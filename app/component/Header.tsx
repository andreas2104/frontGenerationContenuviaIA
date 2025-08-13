'use client'

import Image from "next/image";
import Link from "next/link"

export default function HeaderPage() {

  return (
    <div className = "flex  items-center justify-between p-2 bg-white ">
        <div className="md:flex items-center gap-2  text-sm rounded-full ring-[5px] px-3">
            <Image src="/train.png" alt = "" width={12} height={12}/>
        </div>
        <div className="hidden  md:flex items-center gap-2 text-sm rounded-full ring-[1.5px] bg-white px-2">
            <Image src="/search.png" alt="" width={14} height={14}/>
            <input type="text" placeholder="search..." className="w-[200px] text-blue-500 p-1 bg-transparent outline-none"/>
        </div>
        {/* user part */}
        <div className="flex">

        </div>

        <div className="flex">
          <button className="w-full  text-left text-blue-500 px-4 py-2 text-sm hover:text-blue-700">
            Deconnexion
          </button>
        <Link href="/">
            <button className="text-blue-500  px-4 py-2 text-sm underline hover:text-blue-700 ">Connexion</button>
        </Link>
        </div>
    </div>
  )


}
