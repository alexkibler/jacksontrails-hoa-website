// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock environment variables for tests
process.env.POCKETBASE_URL = 'http://localhost:8090'
process.env.PUBLIC_SITE_URL = 'http://localhost:3000'
process.env.PUBLIC_SITE_NAME = 'Jackson Trails HOA'
process.env.SMTP_HOST = 'smtp.gmail.com'
process.env.SMTP_PORT = '587'
process.env.SMTP_SECURE = 'false'
process.env.SMTP_USER = 'test@example.com'
process.env.SMTP_PASS = 'test-password'
process.env.FROM_EMAIL = 'test@example.com'
process.env.BOARD_EMAIL = 'board@example.com'
