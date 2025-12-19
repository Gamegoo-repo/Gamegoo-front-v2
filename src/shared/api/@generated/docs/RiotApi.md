# RiotApi

All URIs are relative to *https://qaapi.gamegoo.co.kr*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**handleRSOCallback**](#handlersocallback) | **GET** /api/v2/riot/oauth/callback | Riot OAuth 인증 코드 콜백 처리|
|[**joinByRSO**](#joinbyrso) | **POST** /api/v2/riot/join | RSO 전용 회원가입 API|
|[**verifyRiot**](#verifyriot) | **POST** /api/v2/riot/verify | 실제 존재하는 Riot 계정인지 검증하는 API|

# **handleRSOCallback**
> handleRSOCallback()


### Example

```typescript
import {
    RiotApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RiotApi(configuration);

let code: string; // (default to undefined)
let state: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.handleRSOCallback(
    code,
    state
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **code** | [**string**] |  | defaults to undefined|
| **state** | [**string**] |  | (optional) defaults to undefined|


### Return type

void (empty response body)

### Authorization

[JWT TOKEN](../README.md#JWT TOKEN)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**500** | [RIOT_504] Riot API 요청 중 에러가 발생했습니다. |  -  |
|**404** | [RIOT_405] state가 없습니다. [AUTH_412] 탈퇴한 사용자 입니다. |  -  |
|**400** | [RIOT_406] state decoding 중 에러가 발생했습니다. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **joinByRSO**
> ApiResponseRiotJoinResponse joinByRSO(riotJoinRequest)

API for RSO join

### Example

```typescript
import {
    RiotApi,
    Configuration,
    RiotJoinRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new RiotApi(configuration);

let riotJoinRequest: RiotJoinRequest; //

const { status, data } = await apiInstance.joinByRSO(
    riotJoinRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **riotJoinRequest** | **RiotJoinRequest**|  | |


### Return type

**ApiResponseRiotJoinResponse**

### Authorization

[JWT TOKEN](../README.md#JWT TOKEN)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | [MEMBER_403] 이미 존재하는 사용자입니다. [RIOT_401] 잘못된 Riot API 키입니다. |  -  |
|**404** | [RIOT_402] 해당 Riot 계정이 존재하지 않습니다. |  -  |
|**500** | [RIOT_504] Riot API 요청 중 에러가 발생했습니다. [RIOT_501] Riot API에서 알 수 없는 오류가 발생했습니다. |  -  |
|**502** | [RIOT_503] Riot API 서버에서 오류가 발생했습니다 |  -  |
|**503** | [RIOT_502] 네트워크 오류로 Riot API 요청이 실패했습니다. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **verifyRiot**
> ApiResponseString verifyRiot(riotVerifyExistUserRequest)

API for verifying account by riot API

### Example

```typescript
import {
    RiotApi,
    Configuration,
    RiotVerifyExistUserRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new RiotApi(configuration);

let riotVerifyExistUserRequest: RiotVerifyExistUserRequest; //

const { status, data } = await apiInstance.verifyRiot(
    riotVerifyExistUserRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **riotVerifyExistUserRequest** | **RiotVerifyExistUserRequest**|  | |


### Return type

**ApiResponseString**

### Authorization

[JWT TOKEN](../README.md#JWT TOKEN)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | [RIOT_401] 잘못된 Riot API 키입니다. |  -  |
|**404** | [RIOT_402] 해당 Riot 계정이 존재하지 않습니다. |  -  |
|**500** | [RIOT_504] Riot API 요청 중 에러가 발생했습니다. [RIOT_501] Riot API에서 알 수 없는 오류가 발생했습니다. |  -  |
|**502** | [RIOT_503] Riot API 서버에서 오류가 발생했습니다 |  -  |
|**503** | [RIOT_502] 네트워크 오류로 Riot API 요청이 실패했습니다. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

