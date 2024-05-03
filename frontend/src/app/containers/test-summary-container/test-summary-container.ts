import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/dataService';
import { HttpClient } from '@angular/common/http';
import * as FileSaver from 'file-saver';
import { environment } from '../../../environments/environment';
import { image2 } from 'src/app/model/base64-images';

@Component({
  selector: 'gemini-test-summary-container',
  templateUrl: './test-summary-container.html',
  styleUrls: ['./test-summary-container.scss'],
})
export class TestSummaryContainer implements OnInit {
  backendUrl = environment.backend_api_prefix + '/api/generate_variations';
  image2 = image2;
  responseData: any;

  improveDesignsLoading = false;
  improveDesignError = false;
  improveDesignErrorMsg = '';
  improveDesignDone = false;
  improvedDesignVariations: any;

  improvingDesignName = '';
  imgSrc = '';

  constructor(private dataService: DataService, private http: HttpClient) {}

  ngOnInit(): void {
    this.responseData = this.dataService.getTestSummary();
    console.log(this.responseData);
  }

  backToResults() {
    this.improvedDesignVariations = null;
    this.improveDesignsLoading = false;
    this.improveDesignError = false;
  }

  downloadImage(improvingDesignName: string, designVarition: string) {
    const byteCharacters = atob(designVarition);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/png' });
    FileSaver.saveAs(blob, improvingDesignName + '.png');
  }

  regenerateVariations() {
    this.improveDesignsLoading = true;
    this.improvedDesignVariations = null;
    this.improveDesignError = false;
    const imgSrc = this.imgSrc.replace('data:image/png;base64,', '');
    const requestBody = {
      Design: this.improvingDesignName,
      Image: imgSrc,
    };

    this.http
      .post(this.backendUrl, requestBody, { responseType: 'json' })
      .subscribe({
        next: (response: any) => {
          // this.isLoading = false;
          this.improveDesignsLoading = false;
          console.log('Post request successful:', response);

          this.improvedDesignVariations = response;
          // this.dataService.setImprovedDesignImages(response);
        },
        error: (error) => {
          console.error('Error submitting post request:', error);
          // Handle the error as needed
          this.improveDesignsLoading = false;
          this.improveDesignError = true;
          this.improveDesignErrorMsg = error.message;
        },
      });
  }

  getImproveDesign(event: { designName: string; ImageSrc: string }) {
    this.improveDesignsLoading = true;
    this.improvedDesignVariations = null;
    const { designName, ImageSrc } = event;
    this.improvingDesignName = designName;
    this.imgSrc = ImageSrc;

    // const url = 'http://10.159.106.213:9000/api/generate_variations';

    const imgSrc = ImageSrc.replace('data:image/png;base64,', '');
    const requestBody = {
      Design: designName,
      Image: imgSrc,
    };

    this.http
      .post(this.backendUrl, requestBody, { responseType: 'json' })
      .subscribe({
        next: (response: any) => {
          // this.isLoading = false;

          console.log('Post request successful:', response);
          this.improvedDesignVariations = response.Variations;
          this.improveDesignsLoading = false;
          this.dataService.setImprovedDesignImages(response);
        },
        error: (error) => {
          console.error('Error submitting post request:', error);
          // Handle the error as needed
          // this.isLoading = false;
          this.improveDesignsLoading = false;
          this.improveDesignError = true;
          this.improveDesignErrorMsg = error.message;
        },
      });
  }
}
