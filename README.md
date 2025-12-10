# 간단한 재고관리 시스템 구현

**프로젝트 기간: 2025-12-03~**

**기술 : Java/Spring/MyBatis/React/TypeScript**

상품 재고관리하는 ERP사이트를 내 생각대로 임의로 만들어보는 프로젝트


+ 회원(직원)관리
+ 엑셀로 한번에 물품등록
+ 추가 기능 생각

<br/><br/>
# 기능

## 창고 위치관리
<img width="2877" height="1332" alt="스크린샷 2025-12-03 192356" src="https://github.com/user-attachments/assets/4bfbabce-0575-4d6a-90dc-abd1fbe0f0bb" />
창고 위치를 관리하고 추가하거나 비활성화가 가능합니다
<br/><br/>

## 재고 현황 및 조정
<img width="2860" height="1316" alt="스크린샷 2025-12-04 142551" src="https://github.com/user-attachments/assets/f8ee4654-a5f2-45fa-92bf-1533bae9864e" />
<img width="503" height="542" alt="스크린샷 2025-12-04 142615" src="https://github.com/user-attachments/assets/58ea38fc-1fbc-4473-9662-a47fd5de0c0a" />
<img width="592" height="758" alt="스크린샷 2025-12-04 142605" src="https://github.com/user-attachments/assets/2a880903-f2cd-411e-a7f7-69050c343a08" />
<br/>
재고들의 위치를 볼 수 있고 재고숫자를 임의로 바꾸거나 다른 창고로 이동이 가능합니다.
<br/><br/>

## 재고 이력 조회
<img width="2874" height="1312" alt="스크린샷 2025-12-05 130150" src="https://github.com/user-attachments/assets/cdc2718e-5952-4259-a3b8-20edfaef618d" />
재고들의 입,출고 및 이동, 조절의 기록들을 볼 수 있습니다.
<br/><br/>

## 재고 입출고
<img width="2879" height="1301" alt="image" src="https://github.com/user-attachments/assets/efb13944-5c52-4a9e-a1ba-e3acd4ceac25" />
<img width="2879" height="1312" alt="스크린샷 2025-12-05 130317" src="https://github.com/user-attachments/assets/5de33af2-3e0d-4fad-a545-652161f1a5f5" />
재고들을 입,출고 처리합니다.
<br/><br/>

## 재고 및 물류 대시보드
<img width="2876" height="1320" alt="image" src="https://github.com/user-attachments/assets/e762e58f-b8d3-4eec-a35b-f78cb6939fa5" />
<img width="2874" height="1323" alt="image" src="https://github.com/user-attachments/assets/e6d5c707-ce33-47f9-8ae4-522b62f3549c" />
<img width="1181" height="1199" alt="image" src="https://github.com/user-attachments/assets/6a50e032-e924-461b-b5e8-902694a82f0e" />

관리 품목수, 재고 수량, 자산가치, 최근7일 재고 흐름, 안전 재고 미달품목 확인, 최근 최다 입출고 품목을 볼 수 있습니다.<br/>
입출고, 재고이동대비 재고 조정을 숫자로 재고 정확도(실수률)를 볼 수 있고<br/>
비어있는 창고 개수를 통해서 공간활용률을 볼 수 있고 비어있는 창고 목록을 제공하여 활용이 가능하게 해줍니다.

