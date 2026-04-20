import { useState } from 'react'

export function Tooltip({ text }: { text: string }) {
  const [visible, setVisible] = useState(false)

  return (
    <span className="tooltip-wrap">
      <span
        className="tooltip-icon"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >
        ?
      </span>
      {visible && <span className="tooltip-bubble">{text}</span>}
    </span>
  )
}
