# PasswordControllerApi

All URIs are relative to *https://api.gamegoo.co.kr*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**checkPassword**](#checkpassword) | **POST** /api/v2/password/check | 비밀번호 확인 API 입니다.|
|[**resetPassword**](#resetpassword) | **POST** /api/v2/password/reset | 비밀번호 재설정 API 입니다. JWT X|
|[**resetPasswordWithJWT**](#resetpasswordwithjwt) | **PUT** /api/v2/password/change | 비밀번호 재설정 API 입니다. JWT O|

# **checkPassword**
> ApiResponsePasswordCheckResponse checkPassword(passwordCheckRequest)

API for checking password

### Example

```typescript
import {
    PasswordControllerApi,
    Configuration,
    PasswordCheckRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new PasswordControllerApi(configuration);

let passwordCheckRequest: PasswordCheckRequest; //

const { status, data } = await apiInstance.checkPassword(
    passwordCheckRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **passwordCheckRequest** | **PasswordCheckRequest**|  | |


### Return type

**ApiResponsePasswordCheckResponse**

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

# **resetPassword**
> ApiResponseString resetPassword(passwordResetWithVerifyRequest)

API for reseting password JWT X

### Example

```typescript
import {
    PasswordControllerApi,
    Configuration,
    PasswordResetWithVerifyRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new PasswordControllerApi(configuration);

let passwordResetWithVerifyRequest: PasswordResetWithVerifyRequest; //

const { status, data } = await apiInstance.resetPassword(
    passwordResetWithVerifyRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **passwordResetWithVerifyRequest** | **PasswordResetWithVerifyRequest**|  | |


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

# **resetPasswordWithJWT**
> ApiResponseString resetPasswordWithJWT(passwordResetRequest)

API for reseting password JWT O

### Example

```typescript
import {
    PasswordControllerApi,
    Configuration,
    PasswordResetRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new PasswordControllerApi(configuration);

let passwordResetRequest: PasswordResetRequest; //

const { status, data } = await apiInstance.resetPasswordWithJWT(
    passwordResetRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **passwordResetRequest** | **PasswordResetRequest**|  | |


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

