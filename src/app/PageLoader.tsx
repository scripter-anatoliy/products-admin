import { Spin } from "antd";

/**
 * Fallback для Suspense при lazy-загрузке страниц.
 * Показывается, пока подгружается чанк маршрута.
 */
export function PageLoader() {
  return (
    <div
      className="app-page-loader"
      role="status"
      aria-live="polite"
      aria-label="Загрузка страницы"
    >
      <Spin size="large" />
    </div>
  );
}
