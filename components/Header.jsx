import { useGlobalContext } from "@/lib/GlobalProvider";

const Header = () => {
    const { user, isLoading, logout } = useGlobalContext()
  return (
    <div className="w-full">
        {isLoading ? (''):(
            <div>
                <h1 className="font-extrabold text-5xl text-nyanza">Hello {user ? user.name : 'Stranger'}</h1>
                <button className="bg-tangerine text-xl px-4 py-2 rounded-md" onClick={logout}>Logout</button>
            </div>
        )}
    </div>
  )
}

export default Header