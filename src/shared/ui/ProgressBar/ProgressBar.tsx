import styles from './ProgressBar.module.css'

export function ProgressBar() {
  return (
    <div className={styles.wrap} role="progressbar" aria-valuenow={undefined} aria-busy>
      <div className={styles.bar} />
    </div>
  )
}
