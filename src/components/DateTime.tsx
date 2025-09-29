import { useEffect, useRef, useState } from "preact/hooks";

export default function DateTime() {
  const [date, setDate] = useState<Date | null>(null);
  const [isDark, setIsDark] = useState(false);
  const interval = useRef<number | null>(null);

  useEffect(() => {
    interval.current = window.setInterval(() => setDate(new Date()), 1000);

    // 检查当前主题
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
    
    checkTheme()
    
    // 监听主题变化
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
    
    return () => {
      clearInterval(interval.current!);
      observer.disconnect();
    };
  }, []);

  if (!date) {
    return <div style={{ height: "50px", width: "300px" }}>拼命加载中...</div>;
  }
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const week = date.getDay();
  const weekName = ["日", "一", "二", "三", "四", "五", "六"];

  const updateProgress = () => {
    const now = new Date();
    const totalSecond = 24 * 60 * 60;
    const secondPassed =
      now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    return (secondPassed / totalSecond) * 100;
  };

  return (
    <div style={{ height: "50px", width: "300px" }}>
      <p class="time-text">
        今天是{year}年{month}月{day}日 星期{weekName[week]}{" "}
        {date.toLocaleTimeString()}
      </p>
      <div>
        <p style={{ padding: "0px" , margin: '5px,0px'}}>今日时间已使用：</p>
        <div
          style={{
            height: "20px",
            width: "100%",
            backgroundColor: isDark ? "#3a3a3a" : "#e0e0e0",
            borderRadius: "10px",
          }}
        >
          <div
            class="progress"
            style={{
              height: "100%",
              width: `${updateProgress()}%`,
              backgroundColor: isDark ? "#4a9eff" : "#76c7c0",
              borderRadius: "10px",
              transition: "width 1s",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
