# HomeApi

All URIs are relative to *https://qaapi.gamegoo.co.kr*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**error**](#error) | **GET** /errortest | 에러 테스트|
|[**getMemberId**](#getmemberid) | **POST** /home/memberId | 소환사명과 태그로 해당 회원 id 조회|
|[**getTestAccessToken**](#gettestaccesstoken) | **GET** /home/tokens/{memberId} | memberId로 access,refresh token 발급 API|
|[**healthcheck**](#healthcheck) | **GET** /healthcheck | Health Check|
|[**home**](#home) | **GET** /home | 홈 엔드포인트|
|[**joinTest**](#jointest) | **POST** /home/join | 라이엇 계정 회원 가입|
|[**refreshStats**](#refreshstats) | **GET** /home/refresh/stats/{memberId} | 챔피언 전적 통계 갱신|

# **error**
> ApiResponseObject error()

예외를 발생시켜 테스트합니다.

### Example

```typescript
import {
    HomeApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new HomeApi(configuration);

const { status, data } = await apiInstance.error();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**ApiResponseObject**

### Authorization

[JWT TOKEN](../README.md#JWT TOKEN)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | [COMMON400] 잘못된 요청입니다. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getMemberId**
> ApiResponseLong getMemberId(riotUserInfo)


### Example

```typescript
import {
    HomeApi,
    Configuration,
    RiotUserInfo
} from './api';

const configuration = new Configuration();
const apiInstance = new HomeApi(configuration);

let riotUserInfo: RiotUserInfo; //

const { status, data } = await apiInstance.getMemberId(
    riotUserInfo
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **riotUserInfo** | **RiotUserInfo**|  | |


### Return type

**ApiResponseLong**

### Authorization

[JWT TOKEN](../README.md#JWT TOKEN)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**404** | [MEMBER_401] 사용자를 찾을 수 없습니다. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getTestAccessToken**
> ApiResponseTokensResponse getTestAccessToken()

테스트용으로 access, refresh token을 발급받을 수 있는 API 입니다.

### Example

```typescript
import {
    HomeApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new HomeApi(configuration);

let memberId: number; //대상 회원의 id 입니다. (default to undefined)

const { status, data } = await apiInstance.getTestAccessToken(
    memberId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **memberId** | [**number**] | 대상 회원의 id 입니다. | defaults to undefined|


### Return type

**ApiResponseTokensResponse**

### Authorization

[JWT TOKEN](../README.md#JWT TOKEN)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**404** | [MEMBER_401] 사용자를 찾을 수 없습니다. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **healthcheck**
> ApiResponseString healthcheck()

health check를 위한 API 입니다.

### Example

```typescript
import {
    HomeApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new HomeApi(configuration);

const { status, data } = await apiInstance.healthcheck();
```

### Parameters
This endpoint does not have any parameters.


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
|**500** | [COMMON500] 서버 에러, 관리자에게 문의 바랍니다. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **home**
> ApiResponseString home()

API 서비스 상태를 확인합니다.

### Example

```typescript
import {
    HomeApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new HomeApi(configuration);

const { status, data } = await apiInstance.home();
```

### Parameters
This endpoint does not have any parameters.


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
|**500** | [COMMON500] 서버 에러, 관리자에게 문의 바랍니다. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **joinTest**
> ApiResponseObject joinTest(riotUserInfo)


### Example

```typescript
import {
    HomeApi,
    Configuration,
    RiotUserInfo
} from './api';

const configuration = new Configuration();
const apiInstance = new HomeApi(configuration);

let riotUserInfo: RiotUserInfo; //

const { status, data } = await apiInstance.joinTest(
    riotUserInfo
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **riotUserInfo** | **RiotUserInfo**|  | |


### Return type

**ApiResponseObject**

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

# **refreshStats**
> ApiResponseString refreshStats()


### Example

```typescript
import {
    HomeApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new HomeApi(configuration);

let memberId: number; //대상 회원의 id 입니다. (default to undefined)

const { status, data } = await apiInstance.refreshStats(
    memberId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **memberId** | [**number**] | 대상 회원의 id 입니다. | defaults to undefined|


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
|**404** | [MEMBER_401] 사용자를 찾을 수 없습니다. |  -  |
|**500** | [COMMON500] 서버 에러, 관리자에게 문의 바랍니다. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

