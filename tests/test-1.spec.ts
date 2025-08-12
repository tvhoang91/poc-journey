import { test, expect } from '@playwright/test'

test('test', async ({ page }) => {
  await page.goto('https://wordpress.test/wp-login.php')
  await page.getByRole('textbox', { name: 'Username or Email Address' }).fill('admin')
  await page.getByRole('textbox', { name: 'Password' }).fill('1')
  await page.getByRole('button', { name: 'Log In' }).click()

  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
})
