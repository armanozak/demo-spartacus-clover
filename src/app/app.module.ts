import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import {
  RendererModule,
  TransferHttpCacheModule,
} from '@nguniversal/common/clover';
import { SERVER_REQUEST_ORIGIN, SERVER_REQUEST_URL } from '@spartacus/core';
import { AppRoutingModule } from '@spartacus/storefront';

import { AppComponent } from './app.component';
import { SpartacusModule } from './spartacus/spartacus.module';

@NgModule({
  imports: [
    BrowserModule.withServerTransition({
      appId: 'serverApp',
    }),
    RendererModule.forRoot(),
    TransferHttpCacheModule,
    HttpClientModule,
    AppRoutingModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    SpartacusModule,
  ],
  providers: [
    {
      provide: SERVER_REQUEST_ORIGIN,
      useFactory: () => location.origin,
    },
    {
      provide: SERVER_REQUEST_URL,
      useFactory: () => location.href,
    },
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
