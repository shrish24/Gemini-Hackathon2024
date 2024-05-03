import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DataService {
  // private favBooks: Book[] = [
  //   { title: 'Principles' },
  //   { title: 'The Story of Success' },
  //   { title: 'Extreme Economies' },
  // ];

  private testSummary: any;
  private webPageImages: any;
  private improvedDesignImages: any;

  getTestSummary() {
    return this.testSummary;
    // let response = this.testSummary;
    // const result = Object.keys(response?.Average_UX_Rating).map(
    //   (designName) => ({
    //     designName,
    //     rating: response?.Average_UX_Rating[designName],
    //     resultSummary: response?.Result_Summary,
    //     imgSrc: 'data:image/png;base64,' + response?.Images[designName],
    //     scoreCard: Object.keys(response.Evaluation[designName]).map(
    //       (sectionName) => ({
    //         score: response.Evaluation[designName][sectionName].Score,
    //         description:
    //           response.Evaluation[designName][sectionName].Justification,
    //         sectionName,
    //       })
    //     ),
    //     strengths: response?.Strengths_and_Weaknesses[designName].Strengths,
    //     weaknesses: response?.Strengths_and_Weaknesses[designName].Weaknesses,
    //   })
    // );
    // return { summary: response?.Summary, data: result };
  }

  storeData(data: any) {
    this.testSummary = data;
  }

  setWebPageImages(data: any) {
    this.webPageImages = data;
  }

  getWebPageImages() {
    return this.webPageImages;
  }

  setImprovedDesignImages(data: any) {
    this.improvedDesignImages = data;
  }

  getImprovedDesignImages(data: any) {
    return this.improvedDesignImages;
  }
}
