import { AppContainer } from './app/app.container';
import { HeaderContainer } from './header/header-container';
import { FooterContainer } from './footer/footer-container';
import { HomeContainer } from './home/home-container';
import { GenerateWithAiContainer } from './generate-with-ai-container/generate-with-ai-container';
import { GenerateDesignsLoadingContainer } from './generate-designs-loading-container/generate-designs-loading-container';
import { TestSummaryContainer } from './test-summary-container/test-summary-container';
import { GeneratedDesignsWithAiContainer } from './generated-designs-with-ai-container/generated-designs-with-ai-container';

export const containers: any[] = [
  AppContainer,
  HeaderContainer,
  FooterContainer,
  HomeContainer,
  GenerateWithAiContainer,
  GenerateDesignsLoadingContainer,
  TestSummaryContainer,
  GeneratedDesignsWithAiContainer,
];

export * from './app/app.container';
export * from './header/header-container';
export * from './footer/footer-container';
export * from './home/home-container';
export * from './generate-with-ai-container/generate-with-ai-container';
export * from './generate-designs-loading-container/generate-designs-loading-container';
export * from './test-summary-container/test-summary-container';
export * from './generated-designs-with-ai-container/generated-designs-with-ai-container';
