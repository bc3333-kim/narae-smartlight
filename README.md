# 나래 스마트조명 (Android 앱)

웹 앱(`www/index.html`)을 Capacitor로 감싼 안드로이드 앱입니다.
**블루투스 선택창 없이** `Narae-L1 ~ L4` 를 이름으로 찾아 한 번에 연결하고, 앱을 열 때마다 자동으로 다시 연결합니다.

## 구성
| 위치 | 내용 |
|---|---|
| `www/index.html` | 앱 화면과 제어 코드 (웹 브라우저에서도 동작: Web Bluetooth 사용) |
| `src/ble-native.js` | 네이티브 BLE 어댑터 (빌드 시 `www/ble-native.js` 로 묶임) |
| `android/` | 안드로이드 프로젝트 (아이콘/상태바 색 설정 포함) |
| `capacitor.config.json` | 앱 ID `kr.co.narae.smartlight`, 앱 이름 |
| `.github/workflows/build-apk.yml` | GitHub에서 APK를 자동으로 만드는 설정 |

## 방법 A. GitHub에서 APK 만들기 (PC에 아무것도 설치하지 않음)
1. GitHub에 새 저장소를 만들고 이 폴더의 파일 전체를 올립니다. (`.github` 폴더 포함, `node_modules` 는 올리지 않음)
2. 저장소의 **Actions** 탭 → **Build APK** → **Run workflow** (main 브랜치에 올리면 자동 실행됨)
3. 5~10분 뒤 실행 결과 화면 맨 아래 **Artifacts → narae-smartlight-apk** 를 내려받아 압축을 풉니다.
4. `app-debug.apk` 를 폰으로 옮겨 설치합니다. (처음 한 번 "출처를 알 수 없는 앱 설치" 허용 필요)
5. 앱을 처음 열면 **근처 기기(블루투스) 권한**을 허용하세요.

## 방법 B. 내 PC에서 만들기 (Android Studio)
1. Node 22 이상, Android Studio(JDK 21 포함) 설치
2. 이 폴더에서 `npm install` → `npm run sync`
3. `npx cap open android` → Android Studio에서 **Build → Build APK(s)**
   (또는 `android` 폴더에서 `gradlew assembleDebug`)

## 앱을 고쳤을 때
`www/index.html` 을 수정한 뒤 `npm run sync` 후 다시 빌드합니다. (GitHub이면 올리기만 하면 자동 빌드)

## 알아둘 점
- 이 APK는 **디버그 서명**이라 개인 설치용입니다. Play 스토어 등록용은 별도의 서명 키로 `assembleRelease` 를 해야 합니다.
- 보드 쪽 펌웨어는 그대로 쓰면 됩니다. (BLE 이름 `Narae-L1`~`L4`, 서비스 UUID 동일)
- 전등이 끊기면(보드 전원 재투입 등) 5초 뒤 자동으로 다시 찾아 연결합니다. 직접 "연결 해제"를 누른 전등은 다시 연결하지 않습니다.
- 안드로이드 12 이상은 "근처 기기", 11 이하는 "위치" 권한이 필요합니다. 위치 정보는 사용하지 않고 BLE 검색 규정상 필요한 권한입니다.
