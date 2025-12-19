# AuthControllerApi

All URIs are relative to *https://qaapi.gamegoo.co.kr*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**blindMember**](#blindmember) | **DELETE** /api/v2/auth | 탈퇴 API입니다.|
|[**getTestAccessToken1**](#gettestaccesstoken1) | **GET** /api/v2/auth/token/{memberId} | 임시 access token 발급 API|
|[**logout**](#logout) | **POST** /api/v2/auth/logout | logout API 입니다.|
|[**rejoinMember**](#rejoinmember) | **POST** /api/v2/auth/rejoin | 탈퇴했던 사용자 재가입 API입니다.|
|[**updateToken**](#updatetoken) | **POST** /api/v2/auth/refresh | refresh   토큰을 통한 access, refresh 토큰 재발급 API 입니다.|

# **blindMember**
> ApiResponseString blindMember()

API for Blinding Member

### Example

```typescript
import {
    AuthControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthControllerApi(configuration);

const { status, data } = await apiInstance.blindMember();
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
|**404** | [MEMBER_401] 사용자를 찾을 수 없습니다. [AUTH_412] 탈퇴한 사용자 입니다. |  -  |
|**401** | [AUTH_410] 로그인 후 이용가능합니다. 토큰을 입력해 주세요 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getTestAccessToken1**
> ApiResponseString getTestAccessToken1()

테스트용으로 access token을 발급받을 수 있는 API 입니다.

### Example

```typescript
import {
    AuthControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthControllerApi(configuration);

let memberId: number; //대상 회원의 id 입니다. (default to undefined)

const { status, data } = await apiInstance.getTestAccessToken1(
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

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **logout**
> ApiResponseString logout()

API for logout

### Example

```typescript
import {
    AuthControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthControllerApi(configuration);

const { status, data } = await apiInstance.logout();
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
|**401** | [AUTH_410] 로그인 후 이용가능합니다. 토큰을 입력해 주세요 |  -  |
|**404** | [MEMBER_401] 사용자를 찾을 수 없습니다. [AUTH_412] 탈퇴한 사용자 입니다. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **rejoinMember**
> ApiResponseRejoinResponse rejoinMember(rejoinRequest)

Rejoin API for blind member

### Example

```typescript
import {
    AuthControllerApi,
    Configuration,
    RejoinRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthControllerApi(configuration);

let rejoinRequest: RejoinRequest; //

const { status, data } = await apiInstance.rejoinMember(
    rejoinRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **rejoinRequest** | **RejoinRequest**|  | |


### Return type

**ApiResponseRejoinResponse**

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
|**400** | [AUTH_413] 탈퇴하지 않은 사용자입니다. [AUTH_414] 중복된 사용자입니다. 서버 관리자에게 문의하세요. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateToken**
> ApiResponseRefreshTokenResponse updateToken(refreshTokenRequest)

API for Refresh Token

### Example

```typescript
import {
    AuthControllerApi,
    Configuration,
    RefreshTokenRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthControllerApi(configuration);

let refreshTokenRequest: RefreshTokenRequest; //

const { status, data } = await apiInstance.updateToken(
    refreshTokenRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **refreshTokenRequest** | **RefreshTokenRequest**|  | |


### Return type

**ApiResponseRefreshTokenResponse**

### Authorization

[JWT TOKEN](../README.md#JWT TOKEN)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | [AUTH_409] 사용할 수 없는 리프레쉬 토큰입니다.  |  -  |
|**401** | [AUTH_403] JWT 서명이 유효하지 않습니다. [AUTH_404] JWT의 형식이 올바르지 않습니다. [AUTH_406] 기존 토큰이 만료되었습니다. 토큰을 재발급해주세요. [AUTH_405] 지원되지 않는 JWT입니다. [AUTH_407] JWT의 클레임이 유효하지 않습니다. |  -  |
|**404** | [MEMBER_401] 사용자를 찾을 수 없습니다. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

