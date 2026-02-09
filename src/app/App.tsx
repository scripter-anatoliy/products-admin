import { lazy, Suspense } from "react";
import { App as AntApp, ConfigProvider } from "antd";
import ruRU from "antd/locale/ru_RU";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/entities/auth";
import { PageLoader } from "@/app/PageLoader";

const LoginPage = lazy(() =>
  import("@/pages/login").then((m) => ({ default: m.LoginPage }))
);
const ProductsPage = lazy(() =>
  import("@/pages/products").then((m) => ({ default: m.ProductsPage }))
);

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export function App() {
  return (
    <ConfigProvider
      locale={ruRU}
      theme={{
        token: { colorPrimary: "#242EDB", borderRadius: 6 },
      }}
    >
      <AntApp>
        <BrowserRouter basename="/products-admin">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <ProductsPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AntApp>
    </ConfigProvider>
  );
}
