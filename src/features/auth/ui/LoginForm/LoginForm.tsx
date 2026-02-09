import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Checkbox, Button } from 'antd'
import { LoginIcon } from './LoginIcon'
import { PasswordEyeIcon } from './PasswordEyeIcon'
import { ClearIcon } from './ClearIcon'
import { LockIcon } from './LockIcon'
import { MailIcon } from './MailIcon'
import { useAuthStore } from '@/entities/auth'
import { login, ApiError } from '@/entities/auth/api/login'
import styles from './LoginForm.module.css'

type FieldType = { username: string; password: string; remember?: boolean }

export function LoginForm() {
  const navigate = useNavigate()
  const setToken = useAuthStore((s) => s.setToken)
  const [form] = Form.useForm<FieldType>()
  const [loading, setLoading] = useState(false)

  const onFinish = async (values: FieldType) => {
    setLoading(true)
    try {
      const res = await login({
        username: values.username.trim(),
        password: values.password,
      })
      setToken(res.accessToken, !!values.remember)
      navigate('/', { replace: true })
    } catch (err) {
      form.setFields([
        {
          name: 'password',
          errors: [err instanceof ApiError ? err.message : 'Ошибка входа. Проверьте данные.'],
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <LoginIcon className={styles.headerIcon} />
        <div className={styles.headerText}>
          <h1 className={styles.title}>Добро пожаловать!</h1>
          <p className={styles.subtitle}>Пожалуйста, авторизируйтесь</p>
        </div>
      </div>

      <div className={styles.formBlock}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          initialValues={{ remember: false }}
          className={styles.form}
        >
        <Form.Item<FieldType>
          label="Почта"
          name="username"
          rules={[{ required: true, message: 'Обязательное поле' }]}
          className={styles.inputRow}
        >
          <Input
            prefix={<span className={styles.inputIcon}><MailIcon /></span>}
            placeholder="test@mail.com"
            allowClear={{ clearIcon: <ClearIcon /> }}
            autoComplete="username"
            className={styles.input}
          />
        </Form.Item>

        <Form.Item<FieldType>
          label="Пароль"
          name="password"
          rules={[{ required: true, message: 'Обязательное поле' }]}
          className={styles.inputRow}
        >
          <Input.Password
            prefix={<span className={styles.inputIcon}><LockIcon /></span>}
            placeholder="••••••••••"
            autoComplete="current-password"
            className={styles.input}
            iconRender={(visible) => <PasswordEyeIcon visible={visible} />}
          />
        </Form.Item>

        <Form.Item<FieldType> name="remember" valuePropName="checked" className={styles.rememberItem}>
          <Checkbox className={styles.checkbox}>Запомнить данные</Checkbox>
        </Form.Item>

        <Form.Item className={styles.submitItem}>
          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={loading}
            className={styles.submitBtn}
          >
            Войти
          </Button>
        </Form.Item>
      </Form>

        <div className={styles.separator}>
          <span className={styles.separatorLine} />
          <span className={styles.separatorText}>или</span>
          <span className={styles.separatorLine} />
        </div>

        <p className={styles.footer}>
          Нет аккаунта?{' '}
          <a href="#" className={styles.link} onClick={(e) => e.preventDefault()}>
            Создать
          </a>
        </p>
      </div>
    </div>
  )
}
