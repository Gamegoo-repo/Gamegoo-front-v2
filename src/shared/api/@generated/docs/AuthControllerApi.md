# AuthControllerApi

All URIs are relative to *https://api.gamegoo.co.kr*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**blindMember**](#blindmember) | **DELETE** /api/v2/auth | 탈퇴 API입니다.|
|[**getTestAccessToken1**](#gettestaccesstoken1) | **GET** /api/v2/auth/token/{memberId} | 임시 access token 발급 API|
|[**join**](#join) | **POST** /api/v2/auth/join | 회원가입|
|[**login**](#login) | **POST** /api/v2/auth/login | 로그인|
|[**logout**](#logout) | **POST** /api/v2/auth/logout | logout API 입니다.|
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
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

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
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **join**
> ApiResponseString join(joinRequest)

회원가입 API입니다.

### Example

```typescript
import {
    AuthControllerApi,
    Configuration,
    JoinRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthControllerApi(configuration);

let joinRequest: JoinRequest; //

const { status, data } = await apiInstance.join(
    joinRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **joinRequest** | **JoinRequest**|  | |


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

# **login**
> ApiResponseLoginResponse login(loginRequest)

로그인 API입니다.

### Example

```typescript
import {
    AuthControllerApi,
    Configuration,
    LoginRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthControllerApi(configuration);

let loginRequest: LoginRequest; //

const { status, data } = await apiInstance.login(
    loginRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **loginRequest** | **LoginRequest**|  | |


### Return type

**ApiResponseLoginResponse**

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
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

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
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

