import { QueryClient, QueryClientProvider } from "react-query";
import Home from "./pages/Home";
import React from "react";

const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>
  );
};

export default App;
