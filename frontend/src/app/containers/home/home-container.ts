import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { image1, image2 } from '../../model/base64-images';
import { DataService } from '../../services/dataService';
import { environment } from '../../../environments/environment';

interface Image {
  url: string;
  img: string;
}

@Component({
  selector: 'gemini-home-container',
  templateUrl: './home-container.html',
  styleUrls: ['./home-container.scss'],
})
export class HomeContainer implements OnInit {
  includeRecommendations = true;
  testParams: string[] = [
    'Colour Contrast',
    'Hierarchy',
    'Clarity',
    'Accessibility',
    'Layout',
    'Consistency',
    'Balance',
    'Readability',
  ];

  isLoading: boolean = false;
  isError: boolean = false;
  errMessage = '';

  backendUrl = environment.backend_api_prefix + '/api/generate_report';

  requiredFileType: string = 'image/*';

  fileReader: FileReader = new FileReader();
  // fileReader.readAsDataURL(file);

  inititalImages: Image[] = [
    // { url: '../../../assets/img/general/placeholder.png', img: '' },
    // { url: '../../../assets/img/general/placeholder.png', img: '' },
    { url: '../../../assets/img/general/design1.png', img: image1 },
    { url: '../../../assets/img/general/design2.png', img: image2 },
  ];

  images: Image[] = [...this.inititalImages];

  projectNameFormControl = new FormControl('');
  testAreaFormControl = new FormControl('');
  targetUsersFormControl = new FormControl('');
  testObjectivesFormControl = new FormControl('');
  testParamsControl = new FormControl('');
  // includeRecommendtionsControl = new FormControl(true);
  // includeRecommendations = true;

  homePageFormGroup = new FormGroup({
    project_name: this.projectNameFormControl,
    test_area: this.testAreaFormControl,
    target_users: this.targetUsersFormControl,
    test_objectives: this.testObjectivesFormControl,
    test_parameters: this.testParamsControl,
    // include_recommendations: this.includeRecommendtionsControl,
  });

  constructor(
    private http: HttpClient,
    public router: Router,
    private dataService: DataService
  ) {}

  ngOnInit(): void {}

  onFileSelected(event: any, i: number) {
    const file: File = event.target.files[0];
    console.log(i);

    if (file) {
      const formData = new FormData();
      formData.append('thumbnail', file);

      const fileReader: FileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onloadend = () => {
        let img: any = document.getElementById('myfile-' + i);
        if (img instanceof HTMLImageElement) {
          let base64String = fileReader.result as string;
          this.images[i].img = base64String.replace(
            'data:image/png;base64,',
            ''
          );
          img.setAttribute('src', fileReader.result as string);
        }
      };
    }
  }

  launchFileUpload(id: any) {
    console.log(id);
    let fileInputControl = document.getElementById('fileUpload' + id);
    if (fileInputControl instanceof HTMLInputElement) {
      fileInputControl.click();
    }
  }

  addMoreImages() {
    this.images = [
      ...this.images,
      {
        url: '../../../assets/img/general/placeholder.png',
        img: '',
      },
      {
        url: '../../../assets/img/general/placeholder.png',
        img: '',
      },
    ];
  }

  addTestParam(testParam: string): void {
    if (
      testParam &&
      testParam.trim() !== '' &&
      !this.testParams.includes(testParam)
    ) {
      // this.testParams.push(testParam.trim());
      this.testParams = [...this.testParams, testParam];
    }
  }

  removeTestParam(index: number) {
    if (index >= 0) {
      this.testParams.splice(index, 1);
    }
  }

  removeChip(testParam: string): void {
    const chipIndex = this.testParams.indexOf(testParam);
    if (chipIndex > -1) {
      this.testParams.splice(chipIndex, 1);
    }
  }

  updateIncludeRecommendations(event: any) {
    this.includeRecommendations = event.checked;
  }

  submitForm() {
    this.isLoading = true;
    this.isError = false;
    this.errMessage = '';
    const imagesWithContent = this.images.filter((image) => image.img !== '');
    const imgArray = imagesWithContent.map((image) => image.img);
    let formValues = {
      ...this.homePageFormGroup.value,
      test_parameters: this.testParams,
      include_recommendations: this.includeRecommendations,
      images: imgArray,
    };

    // const url = 'http://10.159.106.213:9000/api/generate_report';
    const requestBody = formValues; // Replace with your request body

    this.http
      .post(this.backendUrl, requestBody, { responseType: 'json' })
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;
          console.log('Post request successful:', response);

          const result = Object.keys(response?.Average_UX_Rating ?? {}).map(
            (designName) => ({
              designName,
              rating: response?.Average_UX_Rating[designName],
              resultSummary: response?.Result_Summary,
              imgSrc: 'data:image/png;base64,' + response?.Images[designName],
              scoreCard: Object.keys(response.Evaluation[designName]).map(
                (sectionName) => ({
                  score: response.Evaluation[designName][sectionName].Score,
                  description:
                    response.Evaluation[designName][sectionName].Justification,
                  sectionName,
                })
              ),
              strengths:
                response?.Strengths_and_Weaknesses?.[designName]?.Strengths,
              weaknesses:
                response?.Strengths_and_Weaknesses[designName]?.Weaknesses,
            })
          );
          this.dataService.storeData({
            summary: response?.Summary,
            data: result,
          });
          // Handle the response as needed
          this.router.navigate(['/test-summary'], {
            state: { responseData: response },
          });
        },
        error: (error) => {
          console.error('Error submitting post request:', error);
          // Handle the error as needed
          this.isLoading = false;
          this.isError = true;
          this.errMessage = error.message;
        },
      });
  }

  resetForm() {
    this.images = [...this.inititalImages];
    this.homePageFormGroup.reset();
    this.includeRecommendations = true;
    this.isError = false;
    this.isLoading = false;
    this.errMessage = '';
  }
}
