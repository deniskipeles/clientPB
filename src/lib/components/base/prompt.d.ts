interface SafetyRating {
    category: string;
    probability: string;
  }
  
  interface Part {
    text: string;
  }
  
  interface Content {
    parts: Part[];
    role: string;
  }
  
  interface Candidate {
    content: Content;
    finishReason: string;
    index: number;
    safetyRatings: SafetyRating[];
  }
  
  interface PromptFeedback {
    safetyRatings: SafetyRating[];
  }
  
  interface ResponseAi {
    candidates: Candidate[];
    promptFeedback: PromptFeedback;
  }
  