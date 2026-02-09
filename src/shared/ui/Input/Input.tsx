import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import styles from './Input.module.css'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  label?: string
  error?: string
  rightSlot?: ReactNode
  className?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, rightSlot, className = '', id, ...props },
  ref
) {
  const inputId = id ?? `input-${Math.random().toString(36).slice(2)}`
  return (
    <div className={`${styles.wrap} ${className}`.trim()}>
      {label && (
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
      )}
      <div className={styles.inputWrap}>
        <input
          ref={ref}
          id={inputId}
          className={`${styles.input} ${error ? styles.inputError : ''}`.trim()}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {rightSlot && <span className={styles.rightSlot}>{rightSlot}</span>}
      </div>
      {error && (
        <p id={`${inputId}-error`} className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  )
})
