import { createRouter, RouterProvider } from "@tanstack/react-router";
import "./App.css";
import { routeTree } from "./routeTree.gen";
import { NotFound } from "./components/NotFound.tsx";
import { CssVarsProvider } from "@mui/joy";
import { theme } from "./theme.ts";

const router = createRouter({ routeTree, defaultNotFoundComponent: NotFound });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <CssVarsProvider theme={theme} defaultMode={"system"}>
      <RouterProvider router={router} />
    </CssVarsProvider>
  );
}

export default App;
