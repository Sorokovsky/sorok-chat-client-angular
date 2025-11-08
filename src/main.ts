import {bootstrapApplication} from '@angular/platform-browser';
import {App} from '@/components/app/app';
import {appConfig} from '@/configs/app.config';

setup().then((result: void): void => result)

async function setup(): Promise<void> {
  try {
    await bootstrapApplication(App, appConfig);
  } catch (error) {
    console.error(error);
  }
}
