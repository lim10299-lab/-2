# 3사 근무지원단 가족소통마당

육군3사관학교 근무지원단 7개 근무대(의무대대, 본부대, 영선대, 보급대, 정비대, 군악대, 통신대)와 부모님이 소통하는 웹사이트입니다.
「육군3사관학교 근무지원단 부모님 소통 웹사이트 기획서」를 바탕으로 만들었습니다.

- **기술 스택**: Next.js 15 (App Router) · React 19 · TypeScript · Supabase(연결 예정) · Vercel(배포 예정)
- **현재 상태**: Supabase 없이 예시 데이터로 동작하는 시연 버전입니다. 입력한 내용(소통방 글, 문의, 응원 메시지, 설정)은 브라우저에만 저장됩니다.

## 화면 구성

| 주소 | 메뉴 | 내용 |
| --- | --- | --- |
| `/` | 홈 | 7개 근무대, 최근 활동, 다가오는 일정, 공지 |
| `/units`, `/units/[근무대]` | 부대소개 | 지원단 임무, 근무대별 임무·고정 코너·우리 부대의 하루 |
| `/activities` | 주요활동 | 근무대·유형별 활동 피드, 응원해요 |
| `/talk` | 소통마당 | 근무대 소통방(실시간), 1:1 문의, 응원 메시지, FAQ, 상황별 안내, 정기 프로그램 |
| `/schedule` | 일정 | 달력, 행사 참석 신청 |
| `/resources` | 자료실 | 공지사항, 생활 안내·신청 양식·운영 정책 |
| `/my` | 내 정보 | 관심 근무대, 알림 설정 |
| `/login` | 로그인 | 휴대폰 인증 로그인, 가입 신청(가족 관계 승인제) |
| `/admin` | 관리자 | 보안 점검표 기반 게시 승인, 운영 현황 |

모바일에서는 하단 탭(홈·주요활동·소통마당·일정·내 정보)으로 한 손 사용이 가능하도록 했습니다.

## 내 컴퓨터에서 실행

```bash
npm install
npm run dev
# http://localhost:3000 접속
```

## 폴더 구조

```
src/
  app/                 페이지 (주소별 폴더)
  components/          화면 부품 (talk/ 는 소통마당)
  lib/
    types.ts           데이터 형태 (DB 테이블과 1:1)
    mock-data.ts       예시 데이터 ← Supabase 연결 전까지 사용
    repository.ts      데이터 읽기 함수 ← Supabase 연결 시 여기서 DB로 전환
    supabase/client.ts Supabase 클라이언트 (환경변수 있으면 자동 활성화)
    use-local-state.ts 시연용 브라우저 저장
supabase/
  schema.sql           테이블 + 보안 정책(RLS) + 실시간 설정
  seed.sql             예시 데이터 (npm run seed:sql 로 재생성)
```

## 연결 순서 (나중에)

### 1. GitHub

```bash
git init
git add .
git commit -m "가족소통마당 첫 버전"
git branch -M main
git remote add origin https://github.com/<계정>/3sa-family-site.git
git push -u origin main
```

`.env.local` 은 `.gitignore` 에 들어 있어 올라가지 않습니다. 키를 절대 커밋하지 마세요.

### 2. Supabase

1. supabase.com 에서 새 프로젝트 생성 (지역: Northeast Asia (Seoul))
2. SQL Editor 에서 `supabase/schema.sql` 실행 → 필요하면 `supabase/seed.sql` 실행
3. Project Settings > API 에서 `Project URL` 과 `anon public` 키 복사
4. `.env.example` 을 `.env.local` 로 복사하고 두 값을 붙여넣기
5. Authentication > Providers 에서 Phone(SMS) 로그인 설정, 또는 본인인증 서비스 연동

> 환경변수를 넣는 순간 사이트는 예시 데이터 대신 DB를 읽습니다. DB는 **승인된 회원만** 읽을 수 있도록 잠겨 있으므로(RLS),
> 로그인 기능을 붙이기 전에는 목록이 비어 보이는 것이 정상입니다.

**Supabase 연결 시 바꿀 곳**

| 기능 | 파일 | 할 일 |
| --- | --- | --- |
| 목록 읽기 | `src/lib/repository.ts` | 이미 구현됨 (환경변수만 있으면 동작) |
| 로그인 세션 | 새로 추가 | `@supabase/ssr` 설치 후 쿠키 기반 세션, `middleware.ts` 로 비로그인 접근 차단 |
| 로그인·가입 신청 | `components/LoginForm.tsx` | `auth.signInWithOtp`, `profiles` insert |
| 소통방 실시간 | `components/talk/ChatRoom.tsx` | `chat_messages` insert + Realtime 구독 (파일 상단 주석 참고) |
| 1:1 문의 | `components/talk/InquiryPanel.tsx` | `inquiries` insert/select |
| 응원 메시지 | `components/talk/CheerPanel.tsx` | `cheer_messages` insert/select |
| 응원해요 | `components/ActivityCard.tsx` | `activity_cheers` insert/delete |
| 알림 설정 | `components/MySettings.tsx` | `profiles.fav_units`, `notification_prefs` |
| 게시 승인 | `components/AdminPanel.tsx` | `activities` 상태 변경 + 알림 발송(Edge Function) |
| 사진·자료 | Storage | `activity-photos`, `resources` 버킷 (비공개 + 서명 URL 권장) |

### 3. Vercel

1. vercel.com 에서 **Add New > Project** → GitHub 저장소 선택 (프레임워크는 Next.js 자동 인식)
2. **Environment Variables** 에 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` 입력
3. Deploy. 이후 `main` 브랜치에 push 할 때마다 자동 배포됩니다.

Vercel 대시보드의 **Integrations > Supabase** 를 쓰면 환경변수가 자동으로 연결됩니다.

## 보안·운영 원칙 (기획서 6·7장)

- 폐쇄형 사이트: 가입 승인된 가족만 열람, 검색엔진 노출 차단(`robots: noindex`)
- 모든 활동 게시물은 보안 점검표 확인 → 관리자 승인 후 공개
- 1:1 문의·응원 메시지는 본인과 담당 근무대 간부만 열람 (DB 정책으로 강제)
- 긴급 상황은 사이트가 아닌 부대 대표 전화로 안내
- 운영 전 국방부·상급부대 인터넷 홈페이지 운영 지침과 보안부서 협의를 거치세요.

## 운영 전에 바꿔야 할 예시 내용

- `src/lib/mock-data.ts` 의 `SITE.phone` (부대 대표 전화)
- 지원단장·근무대장 인사말 (`src/app/units/...`)
- 근무대별 임무, 일과표, 활동·일정·공지 예시 데이터
