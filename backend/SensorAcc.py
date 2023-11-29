from flask import Flask, jsonify 
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from flask_cors import CORS
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from lxml import html
import concurrent.futures
import asyncio

app = Flask(__name__)
CORS(app)

timeout_in_milliseconds = 1000
timeout_in_seconds = timeout_in_milliseconds / 1000.0


def scrape_page(driver, page_number):
    try:
        next_button = WebDriverWait(driver, timeout_in_seconds).until(
            EC.element_to_be_clickable((By.XPATH, "//*[@id='example_next']")))

        if "disabled" in next_button.get_attribute("class"):
            return None

        driver.execute_script("arguments[0].click();", next_button)
        WebDriverWait(driver, timeout_in_seconds).until(
            EC.staleness_of(next_button))

        return page_number + 1

    except Exception as e:
        print(f"Error navigating to the next page: {e}")
        return None


def scrape_table_data(driver, all_table_data, page_number):
    page_source = driver.page_source
    tree = html.fromstring(page_source)

    headers = [header.strip() for header in tree.xpath(
        '//*[@id="example"]//thead/tr/th/text()')]

    rows = tree.xpath('//*[@id="example"]//tbody/tr')
    for row in rows:
        cells = row.xpath('td')
        row_data = {}
        for header, cell in zip(headers, cells):
            row_data[header] = cell.text_content().strip()
        all_table_data.append(row_data)

    return scrape_page(driver, page_number)


async def main():
    login_url = "https://simora.bmkg.go.id/simora/web/login_page"
    target_url = "https://simora.bmkg.go.id/simora/simora_upt/status_acc2"
    username = 'stageof.padangpanjang'
    password = '12345678'

    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")

    all_table_data = []

    with webdriver.Chrome(options=chrome_options) as driver:
        driver.get(login_url)
        wait = WebDriverWait(driver, timeout_in_seconds)

        username_input = wait.until(
            EC.presence_of_element_located((By.ID, 'exampleInputEmail')))
        password_input = wait.until(
            EC.presence_of_element_located((By.ID, 'exampleInputPassword')))
        login_button = wait.until(EC.presence_of_element_located(
            (By.XPATH, '//input[@name="login"]')))

        username_input.send_keys(username)
        password_input.send_keys(password)
        login_button.click()

        driver.get(target_url)

        page_number = 1
        with concurrent.futures.ThreadPoolExecutor() as executor:
            loop = asyncio.get_event_loop()
            while page_number is not None and page_number <= 10:
                future = loop.run_in_executor(
                    executor, scrape_table_data, driver, all_table_data, page_number)
                page_number = await future

    return jsonify(all_table_data)


@app.route('/sensor/status_acc', methods=['GET'])
def sensor_acc():
    result = asyncio.run(main())
    return result


if __name__ == "__main__":
    app.run(port=3001, debug=True)
