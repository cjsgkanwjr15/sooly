"""
Sooly 명함 v1.1 빌드 스크립트.

입력:
  - sooly-ko.png (web/public/logo/) → base64 임베드
  - QR 코드 (sooly.co.kr) → path data inline embed

출력:
  - v1.1-front.svg
  - v1.1-back.svg

향후 텍스트 (이름·직함·이메일·IG) 수정 시 이 파일 수정 후 `python build.py` 재실행.
"""
import base64
import re
from pathlib import Path
import qrcode
import qrcode.image.svg

HERE = Path(__file__).parent
LOGO_PNG = HERE / "../../web/public/logo/sooly-ko.png"

# ---- 1. Sooly 로고 PNG → base64 ----
with open(LOGO_PNG, "rb") as f:
    logo_b64 = base64.b64encode(f.read()).decode("ascii")

# ---- 2. QR 코드 SVG path 데이터 생성 ----
factory = qrcode.image.svg.SvgPathImage
qr_img = qrcode.make(
    "https://sooly.co.kr",
    image_factory=factory,
    box_size=10,
    border=0,
    error_correction=qrcode.constants.ERROR_CORRECT_M,
)
qr_buf = []
import io
qr_io = io.BytesIO()
qr_img.save(qr_io)
qr_svg_text = qr_io.getvalue().decode("utf-8")
# extract path d="..." and viewBox
m_path = re.search(r'd="([^"]+)"', qr_svg_text)
m_view = re.search(r'viewBox="([^"]+)"', qr_svg_text)
qr_path_d = m_path.group(1)
qr_view = m_view.group(1)  # e.g. "0 0 25 25"
qr_size = int(qr_view.split()[2])  # cells per side


# ---- 3. v1.1 앞면 (cream 배경) ----
front = f"""<?xml version="1.0" encoding="UTF-8"?>
<!--
  Sooly 명함 v1.1 — 앞면
  마감 90 x 50 mm | 출혈 3mm 사방 | 작업 96 x 56 mm
  Sooly wordmark logo + 이름 + 직함 + tagline.
-->
<svg xmlns="http://www.w3.org/2000/svg"
     width="96mm" height="56mm"
     viewBox="0 0 96 56">

  <rect x="0" y="0" width="96" height="56" fill="#FAF6EE"/>

  <!-- 좌측 상단: Sooly wordmark 이미지 (PNG base64 embed) -->
  <!-- 원본 622x240 (ratio 2.59). 명함 28x10.8mm 로 배치 -->
  <image x="8" y="8" width="28" height="10.8"
         preserveAspectRatio="xMinYMin meet"
         xlink:href="data:image/png;base64,{logo_b64}"
         xmlns:xlink="http://www.w3.org/1999/xlink"/>

  <!-- terracotta 작은 라인 -->
  <line x1="8" y1="22" x2="20" y2="22" stroke="#A05A3C" stroke-width="0.5"/>

  <!-- 한·영 tagline -->
  <text x="8" y="29" font-family="'Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif"
        font-size="3.2" fill="#2A201A" letter-spacing="0.05">한국술 정보 글로벌 허브</text>
  <text x="8" y="33.5" font-family="'Inter', 'Pretendard', sans-serif"
        font-size="2.5" fill="#6B5E54" letter-spacing="0.1">A Global Hub for Korean Alcohol</text>

  <!-- 우측: 이름 + 직함 -->
  <g transform="translate(54, 22)">
    <text x="0" y="0" font-family="'Noto Serif KR', 'Source Han Serif', Georgia, serif"
          font-size="6" font-weight="500" fill="#2A201A" letter-spacing="-0.15">김재훈</text>
    <text x="0" y="5.6" font-family="'Inter', 'Pretendard', sans-serif"
          font-size="2.6" fill="#6B5E54" letter-spacing="0.05" font-style="italic">Jaehoon Kim</text>

    <line x1="0" y1="9" x2="10" y2="9" stroke="#A05A3C" stroke-width="0.3"/>

    <text x="0" y="13" font-family="'Pretendard', sans-serif"
          font-size="2.6" fill="#6B5E54" letter-spacing="0.2">운영자 / Editor</text>
  </g>

  <!-- 하단 우측 sooly.co.kr -->
  <text x="88" y="50" font-family="'Inter', sans-serif"
        font-size="2.8" fill="#A05A3C" font-weight="500" text-anchor="end" letter-spacing="0.05">sooly.co.kr</text>
</svg>
"""

# ---- 4. v1.1 뒷면 (dark 배경 + QR + 연락처) ----
# QR 28mm × 28mm. 좌측 8mm 부터, 상단 14mm 부터 (위·아래 여백 14·14).
qr_x, qr_y, qr_w = 8, 14, 28
qr_scale = qr_w / qr_size

back = f"""<?xml version="1.0" encoding="UTF-8"?>
<!--
  Sooly 명함 v1.1 — 뒷면
  마감 90 x 50 mm | 출혈 3mm 사방 | 작업 96 x 56 mm
  좌: QR (sooly.co.kr) / 우: 연락처
-->
<svg xmlns="http://www.w3.org/2000/svg"
     width="96mm" height="56mm"
     viewBox="0 0 96 56">

  <rect x="0" y="0" width="96" height="56" fill="#2A201A"/>

  <!-- QR 코드 (sooly.co.kr) — 흰 배경 박스 위에 검정 path. 인쇄 시 reading 안정성 ↑ -->
  <rect x="{qr_x - 1}" y="{qr_y - 1}" width="{qr_w + 2}" height="{qr_w + 2}" fill="#FAF6EE" rx="0.5"/>
  <g transform="translate({qr_x}, {qr_y}) scale({qr_scale})">
    <path d="{qr_path_d}" fill="#2A201A"/>
  </g>
  <text x="{qr_x + qr_w / 2}" y="{qr_y + qr_w + 4}" font-family="'Inter', sans-serif"
        font-size="2.4" fill="#A8978A" text-anchor="middle" letter-spacing="0.1">sooly.co.kr</text>

  <!-- 우측: 연락처 -->
  <g transform="translate(50, 18)">
    <text x="0" y="0" font-family="'Pretendard', sans-serif"
          font-size="2.4" fill="#A05A3C" letter-spacing="0.25">CONTACT</text>

    <text x="0" y="8" font-family="'Inter', sans-serif"
          font-size="3" fill="#FAF6EE" letter-spacing="0.02">soolyhello@gmail.com</text>

    <text x="0" y="14" font-family="'Inter', sans-serif"
          font-size="3" fill="#FAF6EE" letter-spacing="0.02">sooly.co.kr</text>

    <text x="0" y="20" font-family="'Inter', sans-serif"
          font-size="3" fill="#A05A3C" letter-spacing="0.02" font-weight="500">@zanlab_archive</text>
  </g>
</svg>
"""

# ---- 5. write ----
(HERE / "v1.1-front.svg").write_text(front, encoding="utf-8")
(HERE / "v1.1-back.svg").write_text(back, encoding="utf-8")
print("v1.1-front.svg:", (HERE / "v1.1-front.svg").stat().st_size, "bytes")
print("v1.1-back.svg:", (HERE / "v1.1-back.svg").stat().st_size, "bytes")
