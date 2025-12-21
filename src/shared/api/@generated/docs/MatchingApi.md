# MatchingApi

All URIs are relative to *https://api.gamegoo.co.kr*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**findMatching**](#findmatching) | **PATCH** /api/v2/internal/matching/found/{matchingUuid}/{targetMatchingUuid} | 매칭 FOUND API|
|[**initializeMatching**](#initializematching) | **POST** /api/v2/internal/matching/priority/{memberId} | 매칭 우선순위 계산 및 기록 저장 API|
|[**successMatching**](#successmatching) | **PATCH** /api/v2/internal/matching/success/{matchingUuid}/{targetMatchingUuid} | 매칭 SUCCESS API|
|[**updateBothMatchingStatus**](#updatebothmatchingstatus) | **PATCH** /api/v2/internal/matching/status/target/{matchingUuid}/{status} | 나와 상대방 매칭 status 변경|
|[**updateMatchingStatus**](#updatematchingstatus) | **PATCH** /api/v2/internal/matching/status/{matchingUuid}/{status} | 내 매칭 status 변경|

# **findMatching**
> ApiResponseMatchingFoundResponse findMatching()

API triggered when a match is found

### Example

```typescript
import {
    MatchingApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MatchingApi(configuration);

let matchingUuid: string; // (default to undefined)
let targetMatchingUuid: string; // (default to undefined)

const { status, data } = await apiInstance.findMatching(
    matchingUuid,
    targetMatchingUuid
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **matchingUuid** | [**string**] |  | defaults to undefined|
| **targetMatchingUuid** | [**string**] |  | defaults to undefined|


### Return type

**ApiResponseMatchingFoundResponse**

### Authorization

[JWT TOKEN](../README.md#JWT TOKEN)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**404** | [MATCH_401] 해당 매칭이 존재하지 않습니다. [AUTH_412] 탈퇴한 사용자 입니다. [MATCH_402] 해당 회원과 매칭된 회원이 없습니다 |  -  |
|**400** | [MATCH_407] sender와 receiver의 matchingUuid가 동일합니다. [COMMON400] 잘못된 요청입니다. [MATCH_403] 현재 매칭 상태에서는 요청할 수 없습니다. [MATCH_404] 상대방이 다른 매칭 로직을 진행 중입니다. |  -  |
|**403** | [MEMBER_402] 대상 회원이 탈퇴했습니다. [MATCH_405] 매칭 상대 회원을 차단한 상태입니다. 매칭 FOUND 처리가 불가능합니다. [MATCH_406] 매칭 상대 회원이 나를 차단했습니다. 매칭 FOUND 처리가 불가능합니다. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **initializeMatching**
> ApiResponsePriorityListResponse initializeMatching(initializingMatchingRequest)

API for calculating and recording matching

### Example

```typescript
import {
    MatchingApi,
    Configuration,
    InitializingMatchingRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new MatchingApi(configuration);

let memberId: number; // (default to undefined)
let initializingMatchingRequest: InitializingMatchingRequest; //

const { status, data } = await apiInstance.initializeMatching(
    memberId,
    initializingMatchingRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **initializingMatchingRequest** | **InitializingMatchingRequest**|  | |
| **memberId** | [**number**] |  | defaults to undefined|


### Return type

**ApiResponsePriorityListResponse**

### Authorization

[JWT TOKEN](../README.md#JWT TOKEN)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**404** | [MEMBER_401] 사용자를 찾을 수 없습니다. [GAMESTYLE401] 해당 게임 스타일을 찾을 수 없습니다. |  -  |
|**403** | [BAN_404] 매칭 사용이 제한된 상태입니다. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **successMatching**
> ApiResponseString successMatching()

API triggered when a match is succeed

### Example

```typescript
import {
    MatchingApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MatchingApi(configuration);

let matchingUuid: string; // (default to undefined)
let targetMatchingUuid: string; // (default to undefined)

const { status, data } = await apiInstance.successMatching(
    matchingUuid,
    targetMatchingUuid
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **matchingUuid** | [**string**] |  | defaults to undefined|
| **targetMatchingUuid** | [**string**] |  | defaults to undefined|


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
|**404** | [MATCH_401] 해당 매칭이 존재하지 않습니다. [AUTH_412] 탈퇴한 사용자 입니다. [MATCH_402] 해당 회원과 매칭된 회원이 없습니다 |  -  |
|**400** | [COMMON400] 잘못된 요청입니다. [MATCH_403] 현재 매칭 상태에서는 요청할 수 없습니다. [MATCH_404] 상대방이 다른 매칭 로직을 진행 중입니다. [CHAT_402] 접근할 수 없는 채팅방 입니다. |  -  |
|**403** | [MEMBER_402] 대상 회원이 탈퇴했습니다. [MATCH_405] 매칭 상대 회원을 차단한 상태입니다. 매칭 FOUND 처리가 불가능합니다. [MATCH_406] 매칭 상대 회원이 나를 차단했습니다. 매칭 FOUND 처리가 불가능합니다. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateBothMatchingStatus**
> ApiResponseString updateBothMatchingStatus()

API for updating both matching status

### Example

```typescript
import {
    MatchingApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MatchingApi(configuration);

let matchingUuid: string; // (default to undefined)
let status: MatchingStatus; //매칭 상태 (default to undefined)

const { status, data } = await apiInstance.updateBothMatchingStatus(
    matchingUuid,
    status
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **matchingUuid** | [**string**] |  | defaults to undefined|
| **status** | **MatchingStatus** | 매칭 상태 | defaults to undefined|


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
|**404** | [MATCH_401] 해당 매칭이 존재하지 않습니다. [MATCH_402] 해당 회원과 매칭된 회원이 없습니다 |  -  |
|**400** | [MATCH_403] 현재 매칭 상태에서는 요청할 수 없습니다. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateMatchingStatus**
> ApiResponseString updateMatchingStatus()

API for updating my matching status

### Example

```typescript
import {
    MatchingApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MatchingApi(configuration);

let matchingUuid: string; // (default to undefined)
let status: MatchingStatus; //매칭 상태 (default to undefined)

const { status, data } = await apiInstance.updateMatchingStatus(
    matchingUuid,
    status
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **matchingUuid** | [**string**] |  | defaults to undefined|
| **status** | **MatchingStatus** | 매칭 상태 | defaults to undefined|


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
|**404** | [MATCH_401] 해당 매칭이 존재하지 않습니다. |  -  |
|**400** | [MATCH_403] 현재 매칭 상태에서는 요청할 수 없습니다. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

