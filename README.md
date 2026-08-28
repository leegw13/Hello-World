# HelloWorld

한국어 사용자를 위한 인도네시아어·베트남어 현장 회화 정적 PWA입니다. 별도 빌드 과정 없이 GitHub Pages에서 실행됩니다.

## 로컬 실행

ES 모듈과 JSON `fetch`를 사용하므로 파일을 직접 열지 말고 정적 서버로 실행합니다.

```sh
python -m http.server 8000
```

그다음 `http://localhost:8000`을 엽니다.

## 구조

```text
app.html                 공통 앱 셸
js/app.js                공통 UI와 상태 관리
js/config.js             언어별 메타데이터
js/services/             데이터·번역·기록 서비스
data/*.json              언어 콘텐츠의 단일 원본
indonesia/, vietnam/     기존 URL 호환 진입점
scripts/validate-data.mjs 데이터 스키마 검증
sw.js                    PWA 오프라인 캐시
```

## 데이터 검증

```sh
node scripts/validate-data.mjs
```

GitHub Actions에서도 모든 push와 pull request에 같은 검증을 실행합니다.

## 언어 추가

1. 기존 JSON과 같은 스키마의 `data/<language>.json`을 추가합니다.
2. `js/config.js`의 `LANGUAGES`에 언어 설정을 등록합니다.
3. 국가별 고정 URL이 필요하면 해당 디렉터리에 `app.html?lang=<code>`로 연결하는 진입점을 추가합니다.
4. `sw.js`의 사전 캐시 목록과 캐시 버전을 갱신합니다.
5. 데이터 검증을 실행합니다.
