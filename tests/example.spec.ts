import { test, expect } from '@playwright/test'

test('login to wordpress admin', async ({ page }) => {
  await page.goto('https://wordpress.test/wp-admin/')

  await expect(page).toHaveTitle(/Log In/)

  await page.fill('#user_login', 'admin')
  await page.fill('#user_pass', '1')

  await page.click('#wp-submit')

  await expect(page).toHaveTitle(/Dashboard/)

  await page.getByRole('link', { name: 'WooCommerce' }).click()
})
