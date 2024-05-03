import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/dataService';

interface Image {
  url: string;
  src: string;
}

@Component({
  selector: 'gemini-generated-designs-with-ai-container',
  templateUrl: './generated-designs-with-ai-container.html',
  styleUrls: ['./generated-designs-with-ai-container.scss'],
})
export class GeneratedDesignsWithAiContainer implements OnInit {
  // images: Image[] = [
  //   { url: '../../../assets/img/general/placeholder.png', src: '' },
  //   { url: '../../../assets/img/general/placeholder.png', src: '' },
  // ];
  images: string[] = [];
  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.images = this.dataService.getWebPageImages();
  }

  download(id: number) {
    console.log(id);
  }
}
