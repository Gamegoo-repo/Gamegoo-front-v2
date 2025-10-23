# ReportApi

All URIs are relative to *https://api.gamegoo.co.kr*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**addReport**](#addreport) | **POST** /api/v2/report/{memberId} | 신고 등록 API|
|[**deleteReportedPost**](#deletereportedpost) | **DELETE** /api/v2/report/{reportId}/post | 신고된 게시글 삭제 (관리자 전용)|
|[**getReportList**](#getreportlist) | **GET** /api/v2/report/list | 신고 목록 조회 (관리자 전용)|
|[**processReport**](#processreport) | **PUT** /api/v2/report/{reportId}/process | 신고 처리 (관리자 전용)|

# **addReport**
> ApiResponseReportInsertResponse addReport(reportRequest)

대상 회원에 대한 신고를 등록하는 API 입니다.

### Example

```typescript
import {
    ReportApi,
    Configuration,
    ReportRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ReportApi(configuration);

let memberId: number; //신고할 대상 회원의 id 입니다. (default to undefined)
let reportRequest: ReportRequest; //

const { status, data } = await apiInstance.addReport(
    memberId,
    reportRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **reportRequest** | **ReportRequest**|  | |
| **memberId** | [**number**] | 신고할 대상 회원의 id 입니다. | defaults to undefined|


### Return type

**ApiResponseReportInsertResponse**

### Authorization

[JWT TOKEN](../README.md#JWT TOKEN)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**404** | [MEMBER_401] 사용자를 찾을 수 없습니다. [BOARD_401] 게시글을 찾을 수 없습니다. |  -  |
|**400** | [COMMON400] 잘못된 요청입니다. [REPORT_404] 해당 회원에 대한 신고가 이미 등록되었습니다. 내일 다시 시도해주세요. |  -  |
|**403** | [MEMBER_402] 대상 회원이 탈퇴했습니다. |  -  |
|**500** | [REPORT_403] 신고 접수 경로 정보를 찾을 수 없습니다. 관리자에게 문의 바랍니다. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteReportedPost**
> ApiResponseString deleteReportedPost()

관리자가 신고된 게시글을 삭제하는 API입니다.  해당 신고와 연관된 게시글이 있는 경우 삭제 처리되며, 게시글이 없는 경우 적절한 메시지가 반환됩니다.  **반환 메시지:** - 성공: \"신고된 게시글 삭제가 완료되었습니다\" - 게시글 없음: \"삭제할 게시글이 존재하지 않습니다\" 

### Example

```typescript
import {
    ReportApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ReportApi(configuration);

let reportId: number; //삭제할 게시글과 연관된 신고의 ID입니다. (default to undefined)

const { status, data } = await apiInstance.deleteReportedPost(
    reportId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **reportId** | [**number**] | 삭제할 게시글과 연관된 신고의 ID입니다. | defaults to undefined|


### Return type

**ApiResponseString**

### Authorization

[JWT TOKEN](../README.md#JWT TOKEN)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**404** | [REPORT_402] 해당 신고 건을 찾을 수 없습니다. [BOARD_401] 게시글을 찾을 수 없습니다. |  -  |
|**401** | [BOARD_404] 게시글 삭제 권한이 없습니다. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getReportList**
> ApiResponseReportPageResponse getReportList()

관리자만 접근 가능한 신고 목록 고급 필터링 조회 API입니다.  **필터링 옵션:** - reportedMemberKeyword: 피신고자 검색 (게임명, 태그, 게임명#태그 형식 지원) - reporterKeyword: 신고자 검색 (게임명, 태그, 게임명#태그 형식 지원) - contentKeyword: 신고 내용으로 검색 - reportPaths: 신고 경로 (BOARD=게시판, CHAT=채팅, PROFILE=프로필) - reportTypes: 신고 사유 (1=스팸, 2=불법정보, 3=성희롱, 4=욕설/혐오, 5=개인정보노출, 6=불쾌한표현) - startDate/endDate: 신고 날짜 범위 (yyyy-MM-dd\'T\'HH:mm:ss) - reportCountMin/Max/Exact: 누적 신고 횟수 필터 - isDeleted: 게시물 삭제 여부 (true/false) - banTypes: 제재 상태 (NONE, WARNING, BAN_1D, BAN_3D, BAN_5D, BAN_1W, BAN_2W, BAN_1M, PERMANENT) - sortOrder: 정렬 순서 (LATEST: 최신순, OLDEST: 오래된순) - 기본값: LATEST - page/size: 페이징 (예: page=0&size=10)  **사용 예시:** /api/v2/report/list?reportedMemberKeyword=홍길동#KR1&reportTypes=1,4&startDate=2024-01-01T00:00:00&banTypes=WARNING&page=0&size=10 

### Example

```typescript
import {
    ReportApi,
    Configuration,
    Pageable
} from './api';

const configuration = new Configuration();
const apiInstance = new ReportApi(configuration);

let pageable: Pageable; // (default to undefined)
let reportedMemberKeyword: string; // (optional) (default to undefined)
let reporterKeyword: string; // (optional) (default to undefined)
let contentKeyword: string; // (optional) (default to undefined)
let reportPaths: ReportPath; //신고 경로 (optional) (default to undefined)
let reportTypes: ReportType; //신고 유형 (1=스팸, 2=불법정보, 3=성희롱, 4=욕설/혐오, 5=개인정보노출, 6=불쾌한표현) (optional) (default to undefined)
let startDate: string; // (optional) (default to undefined)
let endDate: string; // (optional) (default to undefined)
let reportCountMin: number; // (optional) (default to undefined)
let reportCountMax: number; // (optional) (default to undefined)
let reportCountExact: number; // (optional) (default to undefined)
let isDeleted: boolean; // (optional) (default to undefined)
let banTypes: BanType; //제재 상태 (optional) (default to undefined)
let sortOrder: ReportSortOrder; //정렬 순서 (optional) (default to undefined)

const { status, data } = await apiInstance.getReportList(
    pageable,
    reportedMemberKeyword,
    reporterKeyword,
    contentKeyword,
    reportPaths,
    reportTypes,
    startDate,
    endDate,
    reportCountMin,
    reportCountMax,
    reportCountExact,
    isDeleted,
    banTypes,
    sortOrder
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **pageable** | **Pageable** |  | defaults to undefined|
| **reportedMemberKeyword** | [**string**] |  | (optional) defaults to undefined|
| **reporterKeyword** | [**string**] |  | (optional) defaults to undefined|
| **contentKeyword** | [**string**] |  | (optional) defaults to undefined|
| **reportPaths** | **ReportPath** | 신고 경로 | (optional) defaults to undefined|
| **reportTypes** | **ReportType** | 신고 유형 (1&#x3D;스팸, 2&#x3D;불법정보, 3&#x3D;성희롱, 4&#x3D;욕설/혐오, 5&#x3D;개인정보노출, 6&#x3D;불쾌한표현) | (optional) defaults to undefined|
| **startDate** | [**string**] |  | (optional) defaults to undefined|
| **endDate** | [**string**] |  | (optional) defaults to undefined|
| **reportCountMin** | [**number**] |  | (optional) defaults to undefined|
| **reportCountMax** | [**number**] |  | (optional) defaults to undefined|
| **reportCountExact** | [**number**] |  | (optional) defaults to undefined|
| **isDeleted** | [**boolean**] |  | (optional) defaults to undefined|
| **banTypes** | **BanType** | 제재 상태 | (optional) defaults to undefined|
| **sortOrder** | **ReportSortOrder** | 정렬 순서 | (optional) defaults to undefined|


### Return type

**ApiResponseReportPageResponse**

### Authorization

[JWT TOKEN](../README.md#JWT TOKEN)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**403** | [COMMON403] 금지된 요청입니다. |  -  |
|**400** | [COMMON400] 잘못된 요청입니다. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **processReport**
> ApiResponseReportProcessResponse processReport(reportProcessRequest)

관리자가 신고를 처리하여 제재를 적용하는 API입니다.  **Request Body:** - banType: 적용할 제재 유형 (필수)   - NONE: 제재 없음   - WARNING: 경고   - BAN_1D: 1일 정지   - BAN_3D: 3일 정지   - BAN_5D: 5일 정지   - BAN_1W: 1주 정지   - BAN_2W: 2주 정지   - BAN_1M: 1개월 정지   - PERMANENT: 영구 정지 - processReason: 제재 사유 (선택사항) 

### Example

```typescript
import {
    ReportApi,
    Configuration,
    ReportProcessRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ReportApi(configuration);

let reportId: number; //처리할 신고의 ID입니다. (default to undefined)
let reportProcessRequest: ReportProcessRequest; //

const { status, data } = await apiInstance.processReport(
    reportId,
    reportProcessRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **reportProcessRequest** | **ReportProcessRequest**|  | |
| **reportId** | [**number**] | 처리할 신고의 ID입니다. | defaults to undefined|


### Return type

**ApiResponseReportProcessResponse**

### Authorization

[JWT TOKEN](../README.md#JWT TOKEN)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**404** | [REPORT_402] 해당 신고 건을 찾을 수 없습니다. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

