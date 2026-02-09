import { Navigate } from 'react-router-dom'
import { LoginForm } from '@/features/auth/ui/LoginForm'
import { useAuthStore } from '@/entities/auth'
import styles from './LoginPage.module.css'

export function LoginPage() {
  const token = useAuthStore((s) => s.token)
  if (token) return <Navigate to="/" replace />

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.inner}>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
