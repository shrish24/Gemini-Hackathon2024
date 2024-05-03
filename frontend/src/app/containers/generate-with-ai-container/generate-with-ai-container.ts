import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DataService } from '../../services/dataService';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'gemini-generate-with-ai-container',
  templateUrl: './generate-with-ai-container.html',
  styleUrls: ['./generate-with-ai-container.scss'],
})
export class GenerateWithAiContainer implements OnInit {
  isLoading: boolean = false;
  isError: boolean = false;
  errMessage = '';

  backendUrl = environment.backend_api_prefix + '/api/generate_webpage';

  designingForFormControl = new FormControl('', Validators.required);
  targetUsersFormControl = new FormControl('', Validators.required);
  likeToIncludeFormControl = new FormControl('', Validators.required);

  generateWithAiFormGroup = new FormGroup({
    Designing_for: this.designingForFormControl,
    Target_users: this.targetUsersFormControl,
    Description: this.likeToIncludeFormControl,
  });
  constructor(
    private http: HttpClient,
    public router: Router,
    private dataService: DataService
  ) {}

  ngOnInit(): void {}

  submitForm() {
    this.isLoading = true;
    this.isError = false;
    this.errMessage = '';

    console.log(this.generateWithAiFormGroup.value);
    let formValues = this.generateWithAiFormGroup.value;

    // const url = 'http://10.159.106.213:9000/api/generate_webpage'; // Replace with your API endpoint URL
    const requestBody = formValues; // Replace with your request body

    this.http.post(this.backendUrl, requestBody).subscribe({
      next: (response: any) => {
        console.log('Post request successful:', response);
        // Handle the response as needed
        this.dataService.setWebPageImages(response?.Webpage_image);
        this.router.navigate(['/generated-designs-with-ai'], {
          state: { responseData: response },
        });
      },
      error: (error) => {
        console.error('Error submitting post request:', error);
        this.isLoading = false;
        this.isError = true;
        this.errMessage = error.message;
      },
    });
  }

  redirectHome() {
    this.router.navigate(['/home']);
  }

  resetForm() {
    this.isError = false;
    this.isLoading = false;
    this.errMessage = '';
    this.generateWithAiFormGroup.reset();
  }
}
