import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'gemini-design-test-summary',
  templateUrl: './design-test-summary.component.html',
  styleUrls: ['./design-test-summary.component.scss'],
})
export class DesignTestSummaryComponent implements OnInit {
  @Input() designTestSummary: any;
  @Output() getImproveDesign: EventEmitter<{
    designName: string;
    ImageSrc: string;
  }> = new EventEmitter();

  improveDesignError = false;
  errMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  improveDesign(designName: string, ImageSrc: string) {
    this.getImproveDesign.emit({ designName, ImageSrc });
  }
}
