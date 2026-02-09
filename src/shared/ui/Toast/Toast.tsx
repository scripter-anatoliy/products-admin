import { useEffect } from 'react'
import styles from './Toast.module.css'

interface ToastProps {
  message: string
  onClose: () => void
  duration?: number
}

export function Toast({ message, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, duration)
    return () => clearTimeout(t)
  }, [onClose, duration])

  return (
    <div className={styles.toast} role="status" aria-live="polite">
      {message}
    </div>
  )
}
