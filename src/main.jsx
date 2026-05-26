import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Đăng ký Service Worker cho PWA (Mobile App) với cơ chế tự động cập nhật
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js")
      .then(reg => {
        console.log("PWA Service Worker registered successfully", reg);
        
        // Kiểm tra cập nhật định kỳ hoặc khi người dùng mở trang
        reg.onupdatefound = () => {
          const installingWorker = reg.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === "installed") {
                if (navigator.serviceWorker.controller) {
                  console.log("Phát hiện phiên bản mới, đang tải lại trang...");
                  // Trình duyệt tự kích hoạt SW mới (skipWaiting trong sw.js)
                }
              }
            };
          }
        };
      })
      .catch(err => console.error("PWA Service Worker registration failed", err));
  });

  // Tự động tải lại trang khi Service Worker mới kích hoạt thành công (Controller thay đổi)
  let refreshing = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!refreshing) {
      refreshing = true;
      window.location.reload();
    }
  });
}
