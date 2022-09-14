import { Builder, Capabilities, By, until } from 'selenium-webdriver'

jest.useFakeTimers() // tests with setTimeout will error without this

const driver = new Builder().withCapabilities(Capabilities.chrome()).build()

beforeEach(async () => {
  driver.get('http://localhost:3000/')
})

afterAll(async () => {
  driver.quit()
})

test('Title shows up when page loads', async () => {
  const title = await driver.findElement(By.id('title'))
  const displayed = await title.isDisplayed() // bool, true if displayed
  expect(displayed).toBe(true)
})

test('Clicking the Draw button displays the div with id = “choices”', async () => {
  driver.findElement(By.id('draw')).click()
  const divChoices = await driver.findElement(By.id('choices'))
  const displayed = await divChoices.isDisplayed() // bool, true if displayed
  expect(displayed).toBe(true)
})

test('Clicking an “Add to Duo” button displays the div with id = “player-duo”', async () => {
  driver.findElement(By.id('draw')).click()
  // no idea why driver.sleep() hangs, but this works fine
  // jest.useFakeTimers() makes this possible
  setTimeout(async () => {
    await driver.findElement(By.linkText('Add to Duo')).click()
  }, 5000) // wait, then click add to duo
  const divPlayerDuo = await driver.findElement(By.id('choices')) // grab the div
  const displayed = await divPlayerDuo.isDisplayed() // bool, true if displayed
  expect(displayed).toBe(true)
})

test('When a bot is “Removed from Duo”, that it goes back to “choices”', async () => {
  await driver.findElement(By.id('draw')).click() //simulate draw button click
  // see what our choices are
  const arrayBeforeAddToDuo = await driver.findElements(
    By.xpath("//div[@id='choices']//div[@class='bot-card outline']//h3")
  ) // returns an array of promises, xpath points to bot name

  // convert array of promises to array of bot names
  const choicesBeforeAddToDuo = await Promise.all(
    arrayBeforeAddToDuo.map(async (promise) => {
      // get the text value from the selected promise
      return promise.getAttribute('textContent')
    })
  )

  await driver
    .findElement(By.xpath("//button[contains(., 'Add to Duo')]"))
    .click() // simulate adding a bot
  await driver
    .findElement(By.xpath("//button[contains(., 'Remove from Duo')]"))
    .click() // simulate removing a bot

  // see what our choices are
  const arrayAfterRemoveFromDuo = await driver.findElements(
    By.xpath("//div[@id='choices']//div[@class='bot-card outline']//h3")
  ) // returns an array of promises

  // convert array of promises to array of bot names
  const choicesAfterRemoveFromDuo = await Promise.all(
    arrayAfterRemoveFromDuo.map(async (promise) => {
      // get the text value from the selected promise
      return promise.getAttribute('textContent')
    })
  )
  // order the bot names alphabetically into sets and compare the sets
  expect(new Set(choicesBeforeAddToDuo)).toEqual(
    new Set(choicesAfterRemoveFromDuo)
  )
})
