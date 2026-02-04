import time
from playwright.sync_api import sync_playwright

def verify(page):
    page.goto("http://localhost:3000")

    # Wait for entrance animation
    print("Waiting for entrance...")
    page.wait_for_timeout(3500)

    # Screenshot 1: Main View
    page.screenshot(path="verification_main.png")
    print("Main view captured.")

    # Hover first item
    first_item = page.locator("#attraction-list li").first
    first_item.hover()
    page.wait_for_timeout(500)
    page.screenshot(path="verification_hover.png")
    print("Hover view captured.")

    # Click item
    first_item.click()

    # Wait for detail panel
    page.wait_for_timeout(2000)

    # Screenshot 2: Detail View
    page.screenshot(path="verification_detail.png")
    print("Detail view captured.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1280, "height": 800})
        verify(page)
        browser.close()
