// Supabase를 연결하기 전까지 사이트가 사용하는 예시 데이터입니다.
// 실제 운영 데이터가 아니며, supabase/seed.sql 에 같은 내용의 초기 데이터가 있습니다.
import type {
  Activity,
  CalendarEvent,
  ChatMessage,
  CheerMessage,
  Faq,
  Inquiry,
  Notice,
  ProgramItem,
  Resource,
  Unit,
} from "./types";

export const SITE = {
  name: "3사 근무지원단 가족소통마당",
  org: "육군3사관학교 근무지원단",
  mission: "생도들의 일반학과·군사학 교육에 필요한 군수 분야를 근무대별로 지원합니다.",
  phone: "부대 대표 전화(추후 입력)",
};

export const UNITS: Unit[] = [
  {
    slug: "medical",
    name: "의무대대",
    tagline: "건강한 교육·훈련을 뒷받침하는 부대",
    missions: ["생도·장병 진료와 응급처치", "군사훈련 현장 의무 지원", "건강검진·예방접종"],
    corner: "건강 한 장 — 계절별 건강 수칙",
    examples: ["응급처치 교육", "건강검진 지원", "헌혈 캠페인"],
    caution: "환자 정보·진료 기록은 게시하지 않습니다.",
    color: "#c2410c",
    dailySchedule: [
      { time: "06:30", label: "기상·점호" },
      { time: "08:30", label: "외래 진료 준비" },
      { time: "09:00", label: "진료·훈련장 의무 지원" },
      { time: "13:00", label: "응급처치 교육·예방접종" },
      { time: "18:00", label: "개인 정비·자기계발" },
    ],
  },
  {
    slug: "hq",
    name: "본부대",
    tagline: "지원단의 교육 지원 업무를 총괄하는 부대",
    missions: ["지원단 행정·운영", "교육 행사 지원"],
    corner: "지원단 소식 브리핑",
    examples: ["교육 행사 준비", "체육대회", "포상·승진"],
    caution: "경계·당직 관련 내용은 게시하지 않습니다.",
    color: "#1d4ed8",
    dailySchedule: [
      { time: "06:30", label: "기상·점호" },
      { time: "08:30", label: "일과 회의" },
      { time: "09:00", label: "행정·행사 지원" },
      { time: "13:00", label: "부대 운영 지원" },
      { time: "18:00", label: "개인 정비·자기계발" },
    ],
  },
  {
    slug: "facility",
    name: "영선대",
    tagline: "강의실과 훈련장을 교육하기 좋게 만드는 부대",
    missions: ["강의동·생활관·훈련장 시설 유지보수", "교육 환경 개선"],
    corner: "비포·애프터 — 시설 개선 이야기",
    examples: ["생활관 보수", "환경 미화", "기술 교육"],
    caution: "시설 배치·외곽은 촬영하지 않습니다.",
    color: "#a16207",
    dailySchedule: [
      { time: "06:30", label: "기상·점호" },
      { time: "08:30", label: "작업 안전 교육" },
      { time: "09:00", label: "강의동·훈련장 보수" },
      { time: "13:00", label: "환경 개선 작업" },
      { time: "18:00", label: "개인 정비·자기계발" },
    ],
  },
  {
    slug: "supply",
    name: "보급대",
    tagline: "교육과 생활에 필요한 물자를 제때 공급하는 부대",
    missions: ["생도 급식·피복", "교육용 물자·훈련 물자 수령·저장·분배"],
    corner: "이번 주 식단·특식 소개",
    examples: ["특식·명절 음식", "피복 지급"],
    caution: "물자 수량·창고 위치는 게시하지 않습니다.",
    color: "#15803d",
    dailySchedule: [
      { time: "06:00", label: "기상·급식 준비" },
      { time: "08:30", label: "물자 수령" },
      { time: "10:00", label: "교육용 물자 분배" },
      { time: "14:00", label: "저장·정리" },
      { time: "18:00", label: "개인 정비·자기계발" },
    ],
  },
  {
    slug: "maintenance",
    name: "정비대",
    tagline: "교육·훈련용 차량과 장비를 준비된 상태로 유지하는 부대",
    missions: ["교육·훈련 차량 점검·정비", "훈련 장비 점검·정비"],
    corner: "자격증 도전기",
    examples: ["정비 기술 교육", "자격증 취득 소식"],
    caution: "장비 제원·보유 대수는 게시하지 않습니다.",
    color: "#475569",
    dailySchedule: [
      { time: "06:30", label: "기상·점호" },
      { time: "08:30", label: "차량 일일 점검" },
      { time: "09:30", label: "훈련 장비 정비" },
      { time: "14:00", label: "정비 기술 교육" },
      { time: "18:00", label: "자격증 공부" },
    ],
  },
  {
    slug: "band",
    name: "군악대",
    tagline: "음악으로 교육 행사와 의식을 빛내는 부대",
    missions: ["입학·졸업·임관식 등 의식·행사 연주", "생도 사기 진작 공연"],
    corner: "공연 영상 하이라이트",
    examples: ["행사 연주", "위문·대민 공연", "연습 현장"],
    caution: "일정은 공개 행사만 미리 알립니다.",
    color: "#7e22ce",
    dailySchedule: [
      { time: "06:30", label: "기상·점호" },
      { time: "09:00", label: "파트별 연습" },
      { time: "13:00", label: "합주 연습" },
      { time: "15:00", label: "행사 연주 지원" },
      { time: "18:00", label: "개인 연습·자기계발" },
    ],
  },
  {
    slug: "signal",
    name: "통신대",
    tagline: "강의와 훈련의 통신·전산을 연결하는 부대",
    missions: ["강의실 전산·통신망 운영", "군사훈련 통신 지원", "장비 유지"],
    corner: "IT 자기계발 이야기",
    examples: ["통신 기술 교육", "자격증 공부"],
    caution: "통신망 구성·장비·주파수 정보는 게시하지 않습니다.",
    color: "#0e7490",
    dailySchedule: [
      { time: "06:30", label: "기상·점호" },
      { time: "08:30", label: "강의실 전산 점검" },
      { time: "09:00", label: "통신 지원" },
      { time: "14:00", label: "통신 기술 교육" },
      { time: "18:00", label: "IT 자격증 공부" },
    ],
  },
];

export const ACTIVITIES: Activity[] = [
  { id: "a1", unit: "band", type: "행사", title: "생도 체육대회 개회식 연주", summary: "개회식 행진곡과 응원곡으로 생도들의 체육대회를 열었습니다. 한 달간 준비한 신곡도 처음 선보였습니다.", date: "2026-11-18", cheers: 42, comments: 7, status: "approved" },
  { id: "a2", unit: "supply", type: "교육지원", title: "동계 피복 지급 완료", summary: "겨울 교육 시즌을 앞두고 생도와 장병들에게 동계 피복을 지급했습니다. 치수 교환도 함께 진행했습니다.", date: "2026-11-17", cheers: 31, comments: 4, status: "approved" },
  { id: "a3", unit: "facility", type: "교육지원", title: "강의동 난방 설비 점검", summary: "겨울철 수업에 지장이 없도록 강의동 난방 설비를 점검하고 노후 배관을 교체했습니다.", date: "2026-11-16", cheers: 25, comments: 3, status: "approved" },
  { id: "a4", unit: "medical", type: "교육지원", title: "생도 대상 응급처치 교육", summary: "군사학 실습 전 생도들을 대상으로 심폐소생술과 지혈 교육을 지원했습니다.", date: "2026-11-14", cheers: 38, comments: 6, status: "approved" },
  { id: "a5", unit: "maintenance", type: "포상·승진", title: "정비 자격증 합격 소식", summary: "정비대 장병 4명이 자동차정비기능사에 합격했습니다. 일과 후 꾸준히 공부한 결과입니다.", date: "2026-11-13", cheers: 57, comments: 12, status: "approved" },
  { id: "a6", unit: "signal", type: "교육지원", title: "강의실 전산 장비 교체 지원", summary: "새 학기 원격 강의 수업을 위해 강의실 전산 장비 교체를 지원했습니다.", date: "2026-11-12", cheers: 19, comments: 2, status: "approved" },
  { id: "a7", unit: "hq", type: "체육·여가", title: "근무지원단 풋살 대회", summary: "7개 근무대가 참가한 풋살 대회가 열렸습니다. 우승은 보급대가 차지했습니다.", date: "2026-11-10", cheers: 48, comments: 9, status: "approved" },
  { id: "a8", unit: "supply", type: "행사", title: "수요일 특식 — 수제 버거", summary: "이번 주 수요일 특식은 수제 버거였습니다. 생도와 장병 모두 반응이 좋았습니다.", date: "2026-11-08", cheers: 64, comments: 15, status: "approved" },
  { id: "a9", unit: "medical", type: "봉사", title: "지역 헌혈 캠페인 참여", summary: "의무대대 장병들이 지역 헌혈 캠페인에 참여했습니다.", date: "2026-11-06", cheers: 33, comments: 5, status: "approved" },
  { id: "a10", unit: "band", type: "봉사", title: "지역 요양원 위문 공연", summary: "인근 요양원을 찾아 어르신들께 위문 공연을 했습니다.", date: "2026-11-04", cheers: 51, comments: 8, status: "approved" },
  { id: "a11", unit: "maintenance", type: "교육지원", title: "동계 훈련 대비 차량 점검", summary: "생도 동계 군사훈련에 쓸 교육 차량의 부동액과 타이어를 점검했습니다.", date: "2026-11-03", cheers: 22, comments: 1, status: "approved" },
  { id: "a12", unit: "facility", type: "훈련", title: "작업 안전 교육", summary: "고소 작업과 전기 작업 전 안전 수칙 교육을 실시했습니다.", date: "2026-11-02", cheers: 14, comments: 1, status: "approved" },
  // 관리자 화면의 승인 대기 예시
  { id: "a13", unit: "signal", type: "포상·승진", title: "11월 모범 장병 표창", summary: "통신 지원 유공으로 2명이 표창을 받았습니다.", date: "2026-11-19", cheers: 0, comments: 0, status: "review" },
  { id: "a14", unit: "hq", type: "행사", title: "신병 전입 환영식", summary: "11월 전입 신병 환영식을 진행했습니다.", date: "2026-11-19", cheers: 0, comments: 0, status: "review" },
];

export const EVENTS: CalendarEvent[] = [
  { id: "e1", unit: "all", title: "부모님 온라인 간담회(4분기)", date: "2026-11-27", time: "19:30", kind: "온라인", place: "화상 회의", description: "지원단장·근무대장과 질의응답. 다시보기 제공." },
  { id: "e2", unit: "band", title: "군악대 송년 음악회", date: "2026-12-10", time: "15:00", kind: "행사", place: "학교 강당", description: "가족 초청 공개 공연. 참석 신청 필요." },
  { id: "e3", unit: "all", title: "부대 개방 행사(가족 초청)", date: "2026-12-05", time: "10:00", kind: "면회·개방", place: "근무지원단 일대", description: "생활관 견학, 점심 식사, 근무대 소개." },
  { id: "e4", unit: "supply", title: "동지 특식(팥죽)", date: "2026-12-22", kind: "행사" },
  { id: "e5", unit: "all", title: "12월 전역자 축하 행사", date: "2026-12-18", time: "14:00", kind: "수료·전역", place: "근무지원단 회의실" },
  { id: "e6", unit: "medical", title: "동계 예방접종 주간", date: "2026-11-24", kind: "행사", description: "독감 예방접종 실시." },
];

export const NOTICES: Notice[] = [
  { id: "n1", unit: "all", title: "가족소통마당 이용 수칙 안내", date: "2026-11-19", pinned: true },
  { id: "n2", unit: "all", title: "12월 부대 개방 행사 참석 신청 안내", date: "2026-11-18" },
  { id: "n3", unit: "all", title: "1:1 문의 운영 시간 안내(평일 09~18시)", date: "2026-11-15" },
];

export const FAQS: Faq[] = [
  { id: "f1", category: "휴가·면회", question: "면회는 언제, 어떻게 신청하나요?", answer: "면회는 부대 운영 일정에 따라 가능하며, 자녀가 소속 근무대 담당 간부에게 신청합니다. 자세한 일정은 '일정' 메뉴와 근무대 소통방 공지를 확인해 주세요." },
  { id: "f2", category: "생활", question: "자녀와 연락은 언제 할 수 있나요?", answer: "일과 후 개인 정비 시간에 휴대폰 사용이 가능합니다. 훈련·당직 등 일정에 따라 달라질 수 있습니다." },
  { id: "f3", category: "건강", question: "자녀가 아프다고 하면 어떻게 하나요?", answer: "1:1 문의에서 '건강·의료'를 선택해 남겨 주세요. 담당 간부가 의무대대와 확인한 뒤 당일 안에 진료 상황을 안내드립니다." },
  { id: "f4", category: "소포", question: "소포를 보낼 수 있나요?", answer: "보낼 수 있습니다. 부대 주소와 반입 제한 품목은 자료실의 '생활 안내문'을 확인해 주세요." },
  { id: "f5", category: "사이트", question: "사진 속 우리 아이를 내려받아도 되나요?", answer: "개인 소장은 가능하지만, 보안을 위해 SNS 등 외부 공유는 삼가 주세요." },
];

export const RESOURCES: Resource[] = [
  { id: "r1", title: "근무지원단 생활 안내문", category: "생활 안내", date: "2026-11-01" },
  { id: "r2", title: "소포 반입 제한 품목 안내", category: "생활 안내", date: "2026-10-20" },
  { id: "r3", title: "부대 개방 행사 참석 신청서", category: "신청 양식", date: "2026-11-18" },
  { id: "r4", title: "면회 신청 안내", category: "신청 양식", date: "2026-10-05" },
  { id: "r5", title: "개인정보 처리방침", category: "운영 정책", date: "2026-11-19" },
  { id: "r6", title: "가족소통마당 이용 수칙", category: "운영 정책", date: "2026-11-19" },
];

export const CHAT_MESSAGES: ChatMessage[] = [
  { id: "c1", unit: "supply", author: "보급대 담당 간부", role: "staff", body: "안녕하세요, 보급대 소통방입니다. 이번 주 금요일에 동계 피복 지급 사진을 올려 드릴 예정입니다.", createdAt: "2026-11-19T09:05:00+09:00" },
  { id: "c2", unit: "supply", author: "○○○ 일병 어머님", role: "parent", body: "늘 감사합니다. 날이 추워져서 걱정했는데 다행이에요.", createdAt: "2026-11-19T09:20:00+09:00" },
  { id: "c3", unit: "supply", author: "○○○ 상병 아버님", role: "parent", body: "지난주 특식 사진 잘 봤습니다. 아들이 맛있었다고 하더라고요.", createdAt: "2026-11-19T10:02:00+09:00" },
  { id: "c4", unit: "band", author: "군악대 담당 간부", role: "staff", body: "12월 10일 송년 음악회에 가족분들을 초청합니다. '일정' 메뉴에서 참석 신청해 주세요.", createdAt: "2026-11-18T14:00:00+09:00" },
];

export const SAMPLE_INQUIRIES: Inquiry[] = [
  { id: "q1", unit: "supply", category: "휴가·면회·외출", title: "12월 면회 가능한 날짜 문의", body: "12월 중 면회 가능한 주말이 언제인지 알고 싶습니다.", status: "답변 완료", createdAt: "2026-11-15T20:10:00+09:00", answer: "12월 5일 부대 개방 행사 때 가족 면회가 가능합니다. 일정 메뉴에서 참석 신청해 주세요.", answeredBy: "보급대 행정보급관" },
  { id: "q2", unit: "supply", category: "생활·고충", title: "동계 내복 추가 지급 여부", body: "아이가 추위를 많이 타는데 내복을 따로 보내도 되는지요?", status: "확인 중", createdAt: "2026-11-18T21:30:00+09:00" },
];

export const SAMPLE_CHEERS: CheerMessage[] = [
  { id: "m1", unit: "supply", toName: "○○○", body: "아들, 추운데 감기 조심하고 밥 잘 챙겨 먹어. 엄마 아빠가 늘 응원해!", createdAt: "2026-11-12T22:00:00+09:00", delivered: true, reply: "엄마 아빠 저 잘 지내요. 특식 맛있었어요!" },
];

export const PROGRAMS: ProgramItem[] = [
  { name: "주간 활동 소식", cycle: "매주 금요일", content: "근무대별 이번 주 활동 사진과 3줄 요약", channel: "활동 피드 + 알림" },
  { name: "대장의 편지", cycle: "월 1회", content: "근무대장이 부모님께 보내는 부대 소식·당부", channel: "근무대 소통방" },
  { name: "이달의 우리 부대", cycle: "월 1회", content: "월간 활동 모음 소식지", channel: "활동 피드" },
  { name: "신병 전입 안내", cycle: "전입 시", content: "전입 사실, 담당 간부 소개, 생활 안내", channel: "가입 환영 메시지" },
  { name: "온라인 간담회", cycle: "분기 1회", content: "지원단장·근무대장과 화상 질의응답", channel: "화상 회의 + 다시보기" },
  { name: "행사 생중계", cycle: "행사 시", content: "군악대 공연, 체육대회 등 공개 가능한 행사", channel: "활동 피드(영상)" },
  { name: "만족도 설문", cycle: "분기 1회", content: "소통 만족도와 건의 사항", channel: "설문 페이지" },
];

export const SITUATIONS = [
  { situation: "자녀가 아프다고 했을 때", parent: "1:1 문의(건강·의료)", unit: "담당 간부가 의무대대와 확인 후 진료 상황 안내", target: "당일" },
  { situation: "휴가·면회 일정 문의", parent: "FAQ 확인 후 1:1 문의", unit: "제도 안내와 신청 방법 회신", target: "24시간" },
  { situation: "연락이 닿지 않아 걱정될 때", parent: "1:1 문의 또는 대표 전화", unit: "본인 안부 확인 후 연락 독려", target: "당일" },
  { situation: "부대 행사에 가고 싶을 때", parent: "일정 메뉴에서 참석 신청", unit: "출입 절차·주차·준비물 안내", target: "행사 1주 전" },
  { situation: "건의·민원", parent: "1:1 문의(기타)", unit: "담당 부서 검토 후 조치 결과 회신", target: "3영업일" },
  { situation: "긴급 상황", parent: "사이트가 아닌 대표 전화", unit: "당직 계통으로 즉시 대응", target: "즉시" },
];
