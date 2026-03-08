export interface Payload {
  // مشترك
  pressure?: string;
  psychologicalSafety?: string;

  // جلسة فردية
  support?: string;
  whySeekingAdvice?: string[];
  howFeelingLately?: string[];

  // جلسة زوجية / عائلية
  numberIndividuals?: string;
  whoParticipating?: string;
  reasonForConsultation?: string;
  whatHappeningFamily?: string;
  purposeSessions?: string;

  childAge?: string;
  reasonForAssistance?: string;
  behaviorAndFeelings?: string[];
  school?: string;
  psychologicalSafetyForChild?: string;
}
