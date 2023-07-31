import { test, expect } from '@playwright/test';
import { LoginPage } from '../../framework/pages/login.page';
import { NavigationElement } from '../../framework/elements/header-nav.element';
import { CamerasPage } from '../../framework/pages/admin/cameras.page';
import { archives, cameras, discoveryResponses, streams } from '../../framework/fixtures/devices.fixture'
import { Camera } from '../../framework/elements/data.manager';
import config from '../../framework/config/config';


test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  const navElement = new NavigationElement(page);
  await loginPage.login()
  await navElement.gotoAdmin()
});

test.describe('Cameras', () => {

  test('Empty cameras list', async ({ page }) => {
    const camPage = new CamerasPage(page);

    await expect(page).toHaveURL(camPage.url)

    await expect(camPage.mainContainer).toContainText('Сейчас в системе нет подключенных камер')
    await expect(camPage.addCamButton).toBeVisible()
  });

  test('Cameras list with cameras', async ({ page }) => {
    const camPage = new CamerasPage(page);
    const camera = new Camera(cameras.random())
    const createdCams = []
    const cam = await camera.create()
    const cameraIndicatorStream = await camPage.cameraIndicator(cam.id , 1)
    const cameraIndicatorArchive = await camPage.cameraIndicator(cam.id , 2)
    
    //create stream
    const stream = await camera.createStream(cam.id, streams.default())

    //create archive
    await camera.createArchive(cam.id, archives.default(stream))

    await expect(camPage.tableHeader).toBeVisible()

    await cameraIndicatorStream.hover()
    await expect(camPage.tooltip).toBeVisible()

    await camPage.goto()

    await cameraIndicatorArchive.hover()
    await expect(camPage.tooltip).toBeVisible()

    createdCams.push(cam.id)
    await camera.delete(createdCams)


  });

  test('Add camera manually: positive', async ({ page }) => {

    const camerasPage = new CamerasPage(page)
    const camera = new Camera (cameras.random())
    const cameraData = await camera.data()
    const addedCams = []    

    await camerasPage.addCamButton.click()
    await camerasPage.noMyCamButton.click()
    await camerasPage.advancedSettings.click()

    await camerasPage.cameraNameInput.fill(cameraData.name);
    await camerasPage.cameraHostInput.fill(cameraData.host);

    await camerasPage.vendorSelectInput.click()
    await camerasPage.otherVendorSelect.click();

    await camerasPage.furtherButton.click();

    await camerasPage.furtherButton.click();

    //Get id from created request

    const response = await page.waitForResponse(response => response.url().includes('/api/webclient/cameras/create') && response.status() === 200);
    const camId = (JSON.parse(await response.body())).id

    const camElement = await camerasPage.cameraElement(camId)
    addedCams.push(camId)

    await camerasPage.doneButton.click();

    // Modal window is closed

    await expect(camerasPage.modalWindow).not.toBeVisible()

    // Check if element with this id was created
    await expect(camElement).toBeVisible()

    await camera.delete(addedCams)

  });

  test('Go to camera settings', async ({ page }) => {
    const camPage = new CamerasPage(page);
    const camera = new Camera(cameras.random())
    const createdCams = []
    const cam = await camera.create()
    const cameraElement = await camPage.cameraElement(cam.id)
    createdCams.push(cam.id)

    await cameraElement.click()

    await expect(page).toHaveURL(`${config.baseUrl}/d/admin/cam/${cam.id}`)

    await camera.delete(createdCams)
    
  });

  test('Delete camera: one', async ({ page }) => {
    const camerasPage = new CamerasPage(page)
    const camera = new Camera(cameras.random())
    const createdCam = await camera.create()
    const cameraData = await camera.data()
    const camElement = await camerasPage.cameraElement(createdCam.id)
    const camDeleteButton = await camerasPage.cameraDeleteButton(createdCam.id)

    await camElement.hover()
    await camDeleteButton.click()

    // Modal window is open

    await expect(camerasPage.modalWindow).toBeVisible()

    // Modal contains text

    await expect(camerasPage.modalWindow).toHaveText(`Удалить камеру и стереть архив?Камера ${cameraData.name}(${cameraData.host}) будет удалена из Insentry. Все настройки камеры, включая видеоаналитику, будут сброшены. Если есть записанный архив этой камеры, он будет безвозвратно удалён из хранилища.ОтменаУдалить`)

    await camerasPage.modalDeleteButton.click()

    // Cam element is not visible
    await expect(camElement).not.toBeVisible()

    await expect(camerasPage.modalWindow).not.toBeVisible()


  });

  test('Delete cameras: bulk', async ({ page }) => {
    const camerasPage = new CamerasPage(page)
    let addedCams = []
    const camerasCount = 3

// Create cams with api

    for (let i = 0; i < camerasCount; i++){

      const camera = new Camera(cameras.random())
      const createdCam = await camera.create()
      addedCams.push(createdCam.id)
    }

// Marking cams

    for (let i = 0; i < camerasCount; i++){
      const camElementCheckbox = await camerasPage.cameraCheckbox(addedCams[i])
      await camElementCheckbox.click()

      await expect(page.getByText(`Выбрано: ${i+1}`)).toBeVisible()
    }

    await camerasPage.bulkDeleteButton.click()

    // Modal window is open

    await expect(camerasPage.modalWindow).toBeVisible()
    await expect(camerasPage.modalWindow).toHaveText(`Удалить камеры и стереть архив?(${camerasCount}) камер будет удалено из Insentry. Все настройки этих камер, включая видеоаналитику, будут сброшены. Если есть записанный архив этих камер, он будет безвозвратно удалён из хранилища.ОтменаУдалить`)

    await camerasPage.modalDeleteButton.click()


    await expect(camerasPage.modalWindow).not.toBeVisible()

    for (let i = 0; i < camerasCount; i++){
      const camElement = await camerasPage.cameraElement(addedCams[i])

      await expect(camElement).not.toBeVisible()
    }
    

  });
 
  test.describe('Choose cameras window', () => {

    test('Discovery cameras: no cameras', async ({ page }) => {
      const camerasPage = new CamerasPage(page)

      //    await camerasPage.interceptDiscoveryRequest(discoveryResponses.fullExistingCameras()) // можно ли вынести это в Page?

      await page.route('*/**/api/webclient/cameras/discovery', async route => {
        const response = await route.fetch();
        const json = discoveryResponses.empty();
        await route.fulfill({ response, json });
      });

      await camerasPage.addCamButton.click()

      await expect(camerasPage.observerNotFound).toHaveText('Камеры не найдены')
      await expect(camerasPage.continueButton).toBeDisabled()

      await expect(camerasPage.noMyCamButton).not.toBeDisabled()
      await expect(camerasPage.findButton).not.toBeDisabled()
      
    });

    test('Discovery cameras: 1 camera exist, 1 camera added', async ({ page }) => {
      const camerasPage = new CamerasPage(page)

      //     await camerasPage.interceptDiscoveryRequest(discoveryResponses.existingAddedCameras()) // можно ли вынести это в Page?
      const json = discoveryResponses.existingAddedCameras()
      await page.route('*/**/api/webclient/cameras/discovery', async route => {
        const response = await route.fetch();
        await route.fulfill({ response, json });
      });

      await camerasPage.addCamButton.click()

      await expect(await camerasPage.discoveryItem('127.0.0.28LTV CNE-920-581')).toBeVisible()
      await expect(page.getByText('1', { exact: true })).toBeVisible()

      await expect(await camerasPage.discoveryItem('127.0.0.96ONVIF onvif camera')).toBeVisible()

      console.log(json)
    });

  });
});
