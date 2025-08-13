/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Tailwind를 적용할 파일 경로 패턴
  ],
  theme: {
    extend: {}, // 테마 커스터마이징 영역
  },
  plugins: [], // 플러그인 추가 가능
};
