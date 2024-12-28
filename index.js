const { chromium } = require("playwright");

(async () => {
  // Launch browser and create a new page
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Beeceptor URL
  const beeceptorURL = "https://beeceptor.com";
  const beeceptor = "https://app.beeceptor.com";

  // Login
  await page.goto(`${beeceptor}/login`);
  await page.fill('input[name="email"]', "arunsinghlko2001@gmail.com"); // Replace with your email
  await page.fill('input[name="password"]', "Anuj@2001"); // Replace with your password
  await page.click('button[type="submit"]');

  console.log("Creating a new mock server...");
  await page.fill('input[placeholder="Project Name"]', "mytestingserver"); // Replace with your preferred server name
  await page.click('button:has-text("Create Mock Server")');

  // Navigate to the Mock Rules page
  await page.waitForURL("https://app.beeceptor.com/console/mytestingserver");
  await page.click(`text=Mocking Rules (3)`); // Adjust if the locator differs

  // Create a new Proxy Rule
  await page.click(`text=Additional Rule Types`);
  await page.click(`text=Create Proxy or Callout`);

  // Configure "Do the following (for response)" section
  console.log("Configuring 'Do the following (for response)' form...");

  // Open the dropdown
  //   // Click the dropdown to open it
  //   await page.click('select[name="behavior"]');

  //   // Wait for the dropdown option to be visible
  //   await page.waitForSelector("text=Wait for target response (synchronous)", {
  //     state: "visible",
  //   });
  // Add a short wait before interacting with the dropdown
  //   await page.waitForTimeout(2000);

  // Open the dropdown
  //   await page.click(`select[name="behavior"]`);

  //   // Wait for the option to be visible
  //   await page.waitForSelector(`text=Wait for target response (synchronous)`, {
  //     state: "visible",
  //   });

  //   // Select the option
  //   await page.selectOption('select[name="behavior"]', { value: "wait" });

  //  // Set the method to POST (from a dropdown or input field)
  await page.selectOption('select[name="matchMethodProxy"]', "POST"); // Use selectOption for dropdown
  // If it's an input field instead, use this:
  // await page.fill('input[name="method"]', "POST");

  // Fill the target endpoint URL
  await page.fill(
    'input[placeholder="https://your-webhook-endpoint.com"]',
    "https://target-endpoint-url.com"
  );

  // Select "Forward original payload" from the dropdown
  //   await page.selectOption(
  //     'select[name="transform"]',
  //     { label: "Forward original payload" } // or use the value if label doesn't work
  //   );
  //   await page.selectOption(
  //     "select",
  //     { value: "no-transform" } // Replace "forwardOriginalPayload" with the actual value of the desired option
  //   );

  // Save the proxy rule
  console.log("Saving the proxy...");
  await page.click('button:has-text("Save Proxy")');

  // Wait for confirmation of successful save
  await page.waitForSelector("text=Proxy rule created successfully", {
    timeout: 30000, // Extend timeout if needed
  });
  console.log("Proxy rule created successfully!");

  // Validate rule appears in the rules list
  const ruleExists = await page.isVisible(
    "text=https://target-endpoint-url.com"
  );
  if (ruleExists) {
    console.log("Proxy Rule successfully created and validated.");
  } else {
    console.error("Proxy Rule creation failed.");
  }

  // Close browser
  await browser.close();
})();
