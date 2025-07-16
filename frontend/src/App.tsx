import queryClient from "./lib/query";
import { QueryClientProvider } from "@tanstack/react-query";
import { AppRouter } from "./router";



function App() {

  return (
    <QueryClientProvider client={queryClient}>
     <AppRouter/>
    </QueryClientProvider>
  )
}

export default App
