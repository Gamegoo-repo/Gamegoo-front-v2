# RiotApi

All URIs are relative to *https://api.gamegoo.co.kr*

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
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **joinByRSO**
> ApiResponseString joinByRSO(riotJoinRequest)

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

**ApiResponseString**

### Authorization

[JWT TOKEN](../README.md#JWT TOKEN)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

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
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

