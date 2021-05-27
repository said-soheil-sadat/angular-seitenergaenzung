import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import { FifoComponent } from './components/fifo/fifo.component';
import { LruComponent } from './components/lru/lru.component';
import { LfuComponent } from './components/lfu/lfu.component';
import { SecondchanceComponent } from './components/secondchance/secondchance.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    FifoComponent,
    LruComponent,
    LfuComponent,
    SecondchanceComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
