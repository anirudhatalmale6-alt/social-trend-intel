import { RawSignal } from "./trendEngine";

const now = Date.now();
const h = (n: number) => now - n * 3600000;

export const MOCK_TIKTOK_SIGNALS: RawSignal[] = [
  {
    id: "tt-1", title: "Stanley cup aesthetic going viral again — every creator is using it", source: "tiktok",
    score: 284000, comments: 12400, timestamp: h(0.5),
    body: "The Stanley cup trend is back with a vengeance. Influencers are calling it the must-have drinkware of the season.",
  },
  {
    id: "tt-2", title: "AI art tool MidJourney v7 blowing up — users saying it replaces Adobe", source: "tiktok",
    score: 512000, comments: 32100, timestamp: h(1),
    body: "MidJourney's new AI model is all over TikTok. Designers sharing side-by-side comparisons, many saying Adobe's days are numbered.",
  },
  {
    id: "tt-3", title: "Ozempic face trend: TikTok users sharing dramatic before/after weight loss results", source: "tiktok",
    score: 890000, comments: 65000, timestamp: h(1.5),
    body: "GLP-1 drugs like Ozempic and Wegovy are dominating FYP. The term 'Ozempic face' has 800M+ views on TikTok.",
  },
  {
    id: "tt-4", title: "\"De-influencing\" trend hits luxury brands — creators telling followers NOT to buy", source: "tiktok",
    score: 340000, comments: 28000, timestamp: h(2),
    body: "A counter-trend to influencer culture is gaining momentum. Luxury goods brands seeing backlash as creators promote minimalism.",
  },
  {
    id: "tt-5", title: "Roblox for adults? Gen Z developers building full game studios on the platform", source: "tiktok",
    score: 178000, comments: 9200, timestamp: h(3),
    body: "Roblox is no longer just for kids. Adult developers are building monetized games and earning six figures on the platform.",
  },
  {
    id: "tt-6", title: "Tesla Cybertruck goes viral for all the wrong reasons — multiple breakdowns filmed", source: "tiktok",
    score: 1200000, comments: 95000, timestamp: h(0.8),
    body: "Multiple TikTokers have posted videos of their Cybertrucks breaking down. Bearish sentiment growing around Tesla's flagship truck.",
  },
  {
    id: "tt-7", title: "EV charging horror stories trending — 'range anxiety' hashtag exploding", source: "tiktok",
    score: 445000, comments: 41000, timestamp: h(4),
    body: "Drivers sharing frustrating EV charging experiences. The hashtag #rangeAnxiety has over 500M views this week.",
  },
  {
    id: "tt-8", title: "Claude AI going viral — users saying it's smarter than ChatGPT for coding", source: "tiktok",
    score: 620000, comments: 48000, timestamp: h(2.5),
    body: "Anthropic's Claude is trending on TikTok with developers showcasing coding capabilities. Amazon-backed AI is gaining fast.",
  },
];

export const MOCK_TWITTER_SIGNALS: RawSignal[] = [
  {
    id: "tw-1", title: "BREAKING: NVIDIA announces next-gen Blackwell Ultra GPU — AI training costs drop 40%", source: "twitter",
    score: 145000, comments: 28000, timestamp: h(0.3),
    body: "Massive announcement from NVDA. Blackwell Ultra promises 40% cost reduction in AI training. Stock already moving pre-market.",
  },
  {
    id: "tw-2", title: "Apple Vision Pro getting spatial computing SDK for developers — huge update", source: "twitter",
    score: 89000, comments: 15000, timestamp: h(1.2),
    body: "Apple's visionOS developer SDK just dropped with 200+ new APIs. Spatial computing apps about to explode.",
  },
  {
    id: "tw-3", title: "Novo Nordisk oral GLP-1 pill beats Wegovy in Phase 3 trial — game changer for obesity treatment", source: "twitter",
    score: 234000, comments: 43000, timestamp: h(0.7),
    body: "NVO's oral semaglutide shows superior efficacy vs injectable. This could 10x the addressable market for weight loss drugs.",
  },
  {
    id: "tw-4", title: "Bitcoin ETF hits $50B AUM — institutional inflows accelerating", source: "twitter",
    score: 167000, comments: 31000, timestamp: h(2),
    body: "BlackRock's IBIT reaches $50B assets under management in record time. Bitcoin demand from institutions at all-time high.",
  },
  {
    id: "tw-5", title: "Google Gemini Ultra 2 benchmarks leaked — crushes GPT-4 on every test", source: "twitter",
    score: 298000, comments: 54000, timestamp: h(1.8),
    body: "Internal benchmarks for Gemini Ultra 2 leaked. Shows significant improvements in coding, math, and multimodal tasks.",
  },
  {
    id: "tw-6", title: "Amazon Prime Day reportedly moving to March — retailers scrambling to respond", source: "twitter",
    score: 78000, comments: 12000, timestamp: h(5),
    body: "Reports suggest Amazon is considering shifting Prime Day to Q1. Walmart and Target expected to respond with competing sales.",
  },
  {
    id: "tw-7", title: "CrowdStrike wins $2B DOD cybersecurity contract — stock surging", source: "twitter",
    score: 112000, comments: 19000, timestamp: h(3),
    body: "CRWD secures massive federal cybersecurity deal. Sentiment extremely bullish. Defense spending on cyber accelerating.",
  },
  {
    id: "tw-8", title: "DoorDash expands grocery delivery to 500 new cities — competition with Instacart intensifies", source: "twitter",
    score: 56000, comments: 8900, timestamp: h(6),
    body: "DASH announces major grocery expansion. Food delivery wars heating up as market matures and companies fight for profitability.",
  },
];
