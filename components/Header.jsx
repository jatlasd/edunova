"use client"

import { useGlobalContext } from "@/lib/GlobalProvider";

const Header = () => {
    const { user } = useGlobalContext();
    const name = user?.name
    const firstName = name?.split(' ')[0];
    return (
        <div className="flex ml-10">
            <h1 className="text-4xl font-bold text-black-4">Hello,&nbsp;</h1>
            <h1 className="text-4xl font-bold text-primary">{firstName}</h1>
        </div>
    );
}

export default Header;