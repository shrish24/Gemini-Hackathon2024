import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatIconRegistry } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

// import { RippleGlobalOptions, MAT_RIPPLE_GLOBAL_OPTIONS } from "@angular/material/core";

import { DomSanitizer } from '@angular/platform-browser';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
  ],
  exports: [
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
  ],
})
export class MaterialModule {
  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon(
      'icon-close',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons_general/icon-close-new.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'icon-download',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons_general/icon-download.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'icon-chevron-left',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons_general/icon-chevron_left.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'icon-arrow-back',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons_general/icon-arrow_back.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'icon-restart-alt',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons_general/icon-restart_alt.svg'
      )
    );
  }
}
