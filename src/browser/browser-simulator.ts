import { chromium, Browser, Page } from 'playwright'

/**
 * Demo how playwright can be used to simulate a browser
 * Login, Open Coupons Page, Create a coupon
 */
export async function simulateBrowser() {
  const browser: Browser = await chromium.launch({ headless: false })
  const page: Page = await browser.newPage()

  try {
    // Navigate to WordPress admin login
    console.log('Navigating to WordPress admin...')
    await page.goto('https://wordpress.test/wp-admin')
    await page.waitForTimeout(2000)

    // Login
    console.log('Filling login credentials...')
    await page.fill('#user_login', USERNAME)
    await page.waitForTimeout(1000)
    await page.fill('#user_pass', PASSWORD)
    await page.waitForTimeout(1000)

    console.log('Clicking login button...')
    await page.click('#wp-submit')
    await page.waitForTimeout(2000)

    // Wait for login to complete
    await page.waitForURL('**/wp-admin/**')
    console.log('Login successful!')
    await page.waitForTimeout(2000)

    // Navigate to Coupons page
    console.log('Navigating to Coupons page...')
    await page.goto(PAGE_URL)
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)

    // Take screenshot of coupons page
    await page.screenshot({ path: 'screenshots/coupons-page.png' })
    console.log('Screenshot taken: coupons-page.png')
    await page.waitForTimeout(1500)

    // Click "Add New" coupon button
    console.log('Clicking Add New coupon button...')
    await page.click('.page-title-action')
    await page.waitForTimeout(2000)

    // Wait for create coupon form
    await page.waitForSelector('#title')
    console.log('Coupon form loaded')
    await page.waitForTimeout(1000)

    // Fill coupon details
    console.log('Filling coupon title...')
    await page.fill('#title', 'TEST_COUPON_' + Date.now())
    await page.waitForTimeout(1500)

    console.log('Filling coupon description...')
    await page.fill('#woocommerce-coupon-description', 'Test coupon created by automation')
    await page.waitForTimeout(1500)

    // Set discount type to percentage
    console.log('Setting discount type to percentage...')
    await page.selectOption('#discount_type', 'percent')
    await page.waitForTimeout(1000)

    console.log('Setting coupon amount to 10%...')
    await page.fill('#coupon_amount', '10')
    await page.waitForTimeout(1500)

    // Take screenshot before saving
    await page.screenshot({ path: 'screenshots/coupon-form-filled.png' })
    console.log('Screenshot taken: coupon-form-filled.png')
    await page.waitForTimeout(2000)

    // Save the coupon
    console.log('Saving the coupon...')
    await page.click('#publish')
    await page.waitForTimeout(2000)

    // Wait for success message
    await page.waitForSelector('.notice-success', { timeout: 10000 })
    console.log('Coupon saved successfully!')
    await page.waitForTimeout(1500)

    // Take final screenshot
    await page.screenshot({ path: 'screenshots/coupon-created.png' })
    console.log('Screenshot taken: coupon-created.png')

    console.log('Browser simulation completed successfully')
    console.log('Browser will remain open. Close the browser window to stop the Node.js process.')

    // Wait for the browser to be closed manually
    await page.waitForEvent('close')
  } catch (error) {
    console.error('Browser simulation failed:', error)
    await page.screenshot({ path: 'screenshots/error.png' })
    console.log('Browser will remain open for debugging. Close the browser window to stop the Node.js process.')

    // Wait for the browser to be closed manually even on error
    await page.waitForEvent('close')
  } finally {
    await browser.close()
  }
}

const PAGE_URL = 'https://wordpress.test/wp-admin/edit.php?post_type=shop_coupon'
const USERNAME = 'admin'
const PASSWORD = '1'
