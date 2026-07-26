import { Page } from "@playwright/test";

export const failNextStorageWrite = async (page: Page, storageKey: string) => {
  await page.evaluate((key) => {
    const originalSetItem = Storage.prototype.setItem;
    let failed = false;
    (globalThis as any).__failedStorageOperations = 0;

    Storage.prototype.setItem = function (itemKey, value) {
      if (!failed && itemKey === key) {
        failed = true;
        (globalThis as any).__failedStorageOperations++;
        throw new Error(`Injected storage write failure for ${key}`);
      }
      return originalSetItem.call(this, itemKey, value);
    };
  }, storageKey);
};

export const failNextStorageRemoval = async (
  page: Page,
  storageKey: string,
) => {
  await page.evaluate((key) => {
    const originalRemoveItem = Storage.prototype.removeItem;
    let failed = false;
    (globalThis as any).__failedStorageOperations = 0;

    Storage.prototype.removeItem = function (itemKey) {
      if (!failed && itemKey === key) {
        failed = true;
        (globalThis as any).__failedStorageOperations++;
        throw new Error(`Injected storage removal failure for ${key}`);
      }
      return originalRemoveItem.call(this, itemKey);
    };
  }, storageKey);
};

export const getFailedStorageOperationCount = (page: Page) =>
  page.evaluate(() => (globalThis as any).__failedStorageOperations ?? 0);

export const dispatchKeysDuringNextStorageWrite = async (
  page: Page,
  storageKey: string,
  keys: string[],
) => {
  await page.evaluate(
    ({ key, inputKeys }) => {
      const originalSetItem = Storage.prototype.setItem;
      let dispatched = false;

      Storage.prototype.setItem = function (itemKey, value) {
        if (!dispatched && itemKey === key) {
          dispatched = true;
          for (const inputKey of inputKeys) {
            globalThis.dispatchEvent(
              new KeyboardEvent("keydown", {
                key: inputKey,
                bubbles: true,
                cancelable: true,
              }),
            );
          }
        }
        return originalSetItem.call(this, itemKey, value);
      };
    },
    { key: storageKey, inputKeys: keys },
  );
};

export const recordStorageOperations = async (page: Page) => {
  await page.evaluate(() => {
    const originalSetItem = Storage.prototype.setItem;
    const originalRemoveItem = Storage.prototype.removeItem;
    (globalThis as any).__storageOperations = [];

    Storage.prototype.setItem = function (key, value) {
      (globalThis as any).__storageOperations.push(`set:${key}`);
      return originalSetItem.call(this, key, value);
    };
    Storage.prototype.removeItem = function (key) {
      (globalThis as any).__storageOperations.push(`remove:${key}`);
      return originalRemoveItem.call(this, key);
    };
  });
};

export const getStorageOperations = (page: Page): Promise<string[]> =>
  page.evaluate(() => (globalThis as any).__storageOperations ?? []);
