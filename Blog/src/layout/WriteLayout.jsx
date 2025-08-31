import { Outlet } from "react-router-dom";

export const WriteLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
    
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};
