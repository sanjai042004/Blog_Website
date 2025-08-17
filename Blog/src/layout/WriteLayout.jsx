import { Outlet } from "react-router-dom";

export const WriteLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Optional custom navbar here */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};
