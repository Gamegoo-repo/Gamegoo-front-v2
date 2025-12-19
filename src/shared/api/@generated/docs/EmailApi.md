# EmailApi

All URIs are relative to *https://qaapi.gamegoo.co.kr*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**sendEmail**](#sendemail) | **POST** /api/v2/email/send/pwd | 비밀번호 찾기용 이메일 인증코드 전송 API 입니다.|
|[**sendEmailWithCheckDuplication**](#sendemailwithcheckduplication) | **POST** /api/v2/email/send/join | 회원가입용 이메일 인증코드 전송 API 입니다. 중복확인 포함|
|[**verifyEmail**](#verifyemail) | **POST** /api/v2/email/verify | 이메일 인증코드 검증 API 입니다.|

# **sendEmail**
> ApiResponseString sendEmail(emailRequest)

API for sending email for finding password

### Example

```typescript
import {
    EmailApi,
    Configuration,
    EmailRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new EmailApi(configuration);

let emailRequest: EmailRequest; //

const { status, data } = await apiInstance.sendEmail(
    emailRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **emailRequest** | **EmailRequest**|  | |


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
|**404** | [MEMBER_401] 사용자를 찾을 수 없습니다. [EMAIL_401] 이메일 본문을 읽어오는데 실패했습니다. [EMAIL_402] 이메일 전송에 실패했습니다 |  -  |
|**400** | [EMAIL_403] 3분 이내 3개 이상 이메일을 보냈습니다. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **sendEmailWithCheckDuplication**
> ApiResponseString sendEmailWithCheckDuplication(emailRequest)

API for sending email for join

### Example

```typescript
import {
    EmailApi,
    Configuration,
    EmailRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new EmailApi(configuration);

let emailRequest: EmailRequest; //

const { status, data } = await apiInstance.sendEmailWithCheckDuplication(
    emailRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **emailRequest** | **EmailRequest**|  | |


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
|**400** | [MEMBER_403] 이미 존재하는 사용자입니다. [EMAIL_403] 3분 이내 3개 이상 이메일을 보냈습니다. |  -  |
|**404** | [EMAIL_401] 이메일 본문을 읽어오는데 실패했습니다. [EMAIL_402] 이메일 전송에 실패했습니다 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **verifyEmail**
> ApiResponseString verifyEmail(emailCodeRequest)

API for verifying email

### Example

```typescript
import {
    EmailApi,
    Configuration,
    EmailCodeRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new EmailApi(configuration);

let emailCodeRequest: EmailCodeRequest; //

const { status, data } = await apiInstance.verifyEmail(
    emailCodeRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **emailCodeRequest** | **EmailCodeRequest**|  | |


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
|**404** | [EMAIL_404] 해당 이메일을 가진 기록이 없습니다. |  -  |
|**400** | [EMAIL_405] 인증 코드가 틀렸습니다 [EMAIL_406] 인증 코드 검증 시간을 초과했습니다. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

