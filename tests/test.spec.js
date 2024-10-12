const { test, expect } = require('@playwright/test');
const testDataProfile = require('./fixtures/profile.json');


async function login(page, username, password) {
    await page.fill('#firstname', username);
    await page.fill('#password', password);
}

// ตั้งค่า viewport และเข้าหน้าเว็บก่อนทุกการทดสอบ
test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1500, height: 1500 });
    await page.goto('https://www.shopist.io');
});

// ทดสอบ tc-01: สินค้าหมด
test('TC01 - Product is sold out', async ({ page }) => {
    await page.click('.sofas > .menu-item-large-container > .menu-item-large');
    await page.waitForTimeout(5000);  // รอการโหลด
    await page.click(':nth-child(7) > :nth-child(1) > .product-card > img');
    await page.waitForTimeout(5000);
    const modalTitle = page.locator('.modal-title');
    await expect(modalTitle).toHaveText('Oops! This item is sold out.');
    await page.click('.modal-button');
});

// ทดสอบ tc-02: อัปเดตโปรไฟล์
test('TC02 - Update Profile', async ({ page }) => {
    await page.click('.profile > .menu-item-large-container > .menu-item-large');
    await page.waitForTimeout(5000);  // รอโหลดหน้า
    await page.click('.button');

    await page.fill('#firstname', testDataProfile.firstname);
    await page.fill('#lastname', testDataProfile.lastname);
    await page.fill('#address1', testDataProfile.address1);
    await page.fill('#address2', testDataProfile.address2);
    await page.fill('#addressCity', testDataProfile.addressCity);
    await page.fill('#addressZipcode', testDataProfile.addressZipcode);
    await page.fill('#phone', testDataProfile.phone);

    await page.click('.inverted');  // บันทึกข้อมูล
    await page.click('.inline-link');  // กลับไปยังหน้าโปรไฟล์

    const updatedName = page.locator('section.profile > .profile > :nth-child(1) > :nth-child(2)');
    await expect(updatedName).toHaveText('Pothiwat Chaisena');
});

// ทดสอบ tc-04: การสั่งซื้อ
test('TC04 - Purchase Product', async ({ page }) => {
    await page.click('.jumbotron-large > a > .jumbotron-box > :nth-child(3)');
    await page.waitForTimeout(5000);  // รอโหลดหน้า
    await page.click(':nth-child(5) > :nth-child(1) > a > .product-card > img');
    await page.click('.purchase-button');
    await page.waitForTimeout(3000);

    await page.click('.cart > .menu-item-large-container > .menu-item-large');
    await page.click('.checkout');
    await page.waitForTimeout(5000);
    const checkoutTitle = page.locator('.checkout-title');
    await expect(checkoutTitle).toHaveText('Thank you!');
});
