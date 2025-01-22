import { useEffect, useRef, useState } from 'preact/hooks'

export default function DateTime() {
  const [date, setDate] = useState<Date | null>(null)
  const interval = useRef<number | null>(null)

  useEffect(() => {
    interval.current = setInterval(() => setDate(new Date()), 1000)
    return () => clearInterval(interval.current!)
  }, [])

  if (!date) {
    return null
  }

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const week = date.getDay()
  const weekName = ['日', '一', '二', '三', '四', '五', '六']
  return (
    <div>
      <p>
        今天是{year}年{month}月{day}日 星期{weekName[week]}{' '}
        {date.toLocaleTimeString()}
      </p>
    </div>
  )
}
