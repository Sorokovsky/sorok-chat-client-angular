import {bootstrapApplication} from '@angular/platform-browser';
import {App} from '@/components/app/app';
import {appConfig} from '@/configs/app.config';

setup()

async function setup() {
  try {
    await bootstrapApplication(App, appConfig);
  } catch (error) {
    console.error(error);
  }
}
