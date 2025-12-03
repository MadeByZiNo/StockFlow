# 재고 간소화 시스템 API 명세서 

## 1.  시스템 관리 API (Master Data CRUD)

### 1.1. 카테고리 관리 (`/api/categories`)

| 기능 | HTTP 메서드 | 엔드포인트 | 요청 파라미터 (Body) | 반환 파라미터 (Body) | 설명 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **등록** | `POST` | `/api/categories` | `name: string`, `description: string` | `id: Long`, `name: string` | 새 카테고리를 등록합니다. |
| **수정** | `PUT` | `/api/v1/categories/{id}` | `name: string`, `description: string` | `Category` 엔티티 상세 정보 | 특정 카테고리를 수정합니다. |
| **목록 조회** | `GET` | `/api/v1/categories` | (Query Params: `page`, `size`) | `List<Category>` 및 페이지 정보 | 카테고리 전체 목록을 조회합니다. |

---

### 1.2. 품목 관리 (`/api/items`)

| 기능 | HTTP 메서드 | 엔드포인트 | 요청 파라미터 (Body) | 반환 파라미터 (Body) | 설명 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **등록** | `POST` | `/api/items` | `name: string`, `sku: string`, `safetyStock: int`, **`categoryId: Long`** | `id: Long`, `sku: string` | 새 품목을 등록합니다. |
| **조회** | `GET` | `/api/items/{id}` | (없음) | `Item` 상세 정보 (Category 포함) | 특정 품목을 조회합니다. |
| **수정** | `PUT` | `/api/items/{id}` | `name: string`, `safetyStock: int`, `categoryId: Long` | `Item` 상세 정보 | 특정 품목 정보를 수정합니다. |
| **삭제** | `DELETE` | `/api/items/{id}` | (없음) | (없음, HTTP 204) | **현재고가 0인 경우에만** 품목을 삭제가능하게 |

---

### 1.3. 창고 위치 관리 (`/api/locations`)

| 기능 | HTTP 메서드 | 엔드포인트 | 요청 파라미터 (Body) | 반환 파라미터 (Body) | 설명 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **등록** | `POST` | `/api/locations` | `centerName: string`, `zone: string`, `binCode: string` | `id: Long`, `binCode: string` | 새 보관 위치를 등록합니다. (`centerName`+`zone`+`binCode` 조합은 유일해야 함) |
| **상태 변경** | `PATCH` | `/api/locations/{id}/active` | `isActive: boolean` | `id: Long`, `isActive: boolean` | 위치의 사용 가능 여부(`isActive`)를 변경합니다. |
| **목록 조회** | `GET` | `/api/locations` | (Query Params: `center`, `zone`) | `List<Location>` 및 페이지 정보 | 창고 위치 목록을 조회합니다. |

---
---

## 2. 🚚 재고 변동 API (Transaction)

### 2.1. 입고 처리 (`/api/transactions/inbound`)

| 기능 | HTTP 메서드 | 엔드포인트 | 요청 파라미터 (Body) | 반환 파라미터 (Body) | 설명 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **입고 등록** | `POST` | `/api/transactions/inbound` | **`itemId: Long`**, **`locationId: Long`** (입고 위치 ID), **`quantity: int`**, `notes: string` | `transactionId: Long`, `type: INBOUND` | 특정 품목을 특정 위치로 입고 처리하고 재고를 증가시킵니다. |

---

### 2.2. 출고 처리 (`/api/transactions/outbound`)

| 기능 | HTTP 메서드 | 엔드포인트 | 요청 파라미터 (Body) | 반환 파라미터 (Body) | 설명 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **출고 등록** | `POST` | `/api/transactions/outbound` | **`itemId: Long`**, **`locationId: Long`** (출고 위치 ID), **`quantity: int`**, `notes: string` | `transactionId: Long`, `type: OUTBOUND` | 특정 위치에서 품목을 출고 처리하고 재고를 감소시킵니다. (재고 부족 시 예외 처리) |

---

### 2.3. 재고 이동 처리 (`/api/transactions/move`)

| 기능 | HTTP 메서드 | 엔드포인트 | 요청 파라미터 (Body) | 반환 파라미터 (Body) | 설명 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **이동 등록** | `POST` | `/api/transactions/move` | **`itemId: Long`**, **`fromLocationId: Long`**, **`toLocationId: Long`**, **`quantity: int`** | `transactionId: Long`, `type: MOVEMENT` | 품목을 A 위치에서 B 위치로 이동 처리합니다. |

---
---

## 3. 🔍 조회 및 리포트 API

### 3.1. 재고 현황 조회 (`/api/inventory`)

| 기능 | HTTP 메서드 | 엔드포인트 | 요청 파라미터 (Query) | 반환 파라미터 (Body) | 설명 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **현황 조회** | `GET` | `/api/inventory` | `itemId`, `locationId`, `centerName`, `categoryName`, `page`, `size` | `List<InventoryReportDto>` | 품목별/위치별 현재 재고 수량을 조회합니다. |
| **재고 알림** | `GET` | `/api/inventory/alerts/safety-stock` | (없음) | `List<ItemAlertDto>` | 현재고가 안전 재고 미만인 품목 목록을 조회합니다. |

---

### 3.2. 거래 이력 조회 (`/api/transactions`)

| 기능 | HTTP 메서드 | 엔드포인트 | 요청 파라미터 (Query) | 반환 파라미터 (Body) | 설명 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **이력 조회** | `GET` | `/api/transactions` | `type` (INBOUND/OUTBOUND/MOVEMENT), `startDate`, `endDate`, `itemId`, `userId`, `page`, `size` | `List<TransactionDetailDto>` | 모든 재고 변동 거래 이력을 조회합니다. |
