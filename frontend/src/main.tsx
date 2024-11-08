import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/home/home";
import { Login } from "./pages/login/login";
import { Register } from "./pages/register/register";
import "bootstrap/dist/css/bootstrap.css";
import { QueryClientProvider } from "react-query";
import { queryClient } from "./configs/queryClient";
import { AuthContextProvider } from "./utils/authContext/authContext";
import { SocketProvider } from "./utils/socketContext/socketContext";
import { ModalProvider } from "./components/modal/ModalContext";

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <ModalProvider>
      <BrowserRouter>
        <AuthContextProvider>
          <SocketProvider>
            <Routes>
              <Route path="home/*" element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Routes>
          </SocketProvider>
        </AuthContextProvider>
      </BrowserRouter>
    </ModalProvider>
  </QueryClientProvider>
);
