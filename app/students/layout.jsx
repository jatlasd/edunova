import Header from "@components/Header";

export default function RootLayout({ children }) {
  return (
      <div className="flex flex-col items-center justify-center">
        <Header />
        {children}
      </div>
  );
}
