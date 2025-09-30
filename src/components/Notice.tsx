import { useState, useEffect } from "preact/hooks";

export default function Notice() {
  const [isVisiable, setIsVisiable] = useState(
    localStorage.getItem("popClosed") === null
  );
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // 检查当前主题
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    checkTheme();

    // 监听主题变化
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  function closeNotice() {
    setIsVisiable(false);
    localStorage.setItem("popClosed", "");
  }

  return (
    isVisiable && (
      <div style={styles.overlay}>
        <div style={isDark ? styles.popupDark : styles.popup}>
          <p>站点正在升级施工中，部分功能给您带来不便，敬请谅解</p>
          <button style={styles.button} onClick={closeNotice}>
            点击进入
          </button>
        </div>
      </div>
    )
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  popup: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    width: "300px",
  },
  popupDark: {
    backgroundColor: "#2a2a2a",
    color: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
    textAlign: "center",
    width: "300px",
  },
  button: {
    marginTop: "10px",
    padding: "10px 20px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};
