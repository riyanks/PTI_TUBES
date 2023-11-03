from flask import Flask, jsonify
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from flask_cors import CORS
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By

app = Flask(__name__)
CORS(app)


@app.route('/sensor/status_acc', methods=['GET'])
def sensor_acc():
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
        wait = WebDriverWait(driver, 15)

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

        header_elements = wait.until(EC.presence_of_all_elements_located(
            (By.XPATH, '//*[@id="example"]//thead/tr/th')))
        headers = [header.text for header in header_elements]

        while True:
            rows = wait.until(EC.presence_of_all_elements_located(
                (By.XPATH, '//*[@id="example"]//tbody/tr')))
            for row in rows:
                cells = row.find_elements(By.TAG_NAME, "td")
                row_data = {}
                for header, cell in zip(headers, cells):
                    row_data[header] = cell.text.strip()
                all_table_data.append(row_data)

            try:
                next_button = WebDriverWait(driver, 10).until(
                    EC.element_to_be_clickable((By.XPATH, "//*[@id='example_next']")))
                if "disabled" in next_button.get_attribute("class"):
                    break
                driver.execute_script("arguments[0].click();", next_button)
                WebDriverWait(driver, 60).until_not(EC.text_to_be_present_in_element(
                    (By.XPATH, "//table[@id='example']//td[contains(text(), 'Loading...')]"), "Loading..."))
            except Exception as e:
                print(f"Error navigating to the next page: {e}")
                break

    return jsonify(all_table_data)


if __name__ == "__main__":
    app.run(port=3001, debug=True)
