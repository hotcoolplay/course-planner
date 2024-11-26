import { PageLayout } from "@/components/Layouts";
import { AppProvider } from "./AppProvider";

function App() {
  return (
    <AppProvider>
      <PageLayout />
    </AppProvider>
  );
}

export default App;
