"use client";

import Header from "@/components/Header";
import { useGlobalContext } from "@/lib/GlobalProvider";

const Home = () => {
  const { user, isLoading, isLoggedIn } = useGlobalContext();

  return (
    <div className="flex gap-10">
      <button onClick={() => console.log(isLoggedIn)}>
        click
      </button>
    </div>
  );
};

export default Home;
