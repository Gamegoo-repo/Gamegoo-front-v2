# BlockApi

All URIs are relative to *https://api.gamegoo.co.kr*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**blockMember**](#blockmember) | **POST** /api/v2/block/{memberId} | 회원 차단 API|
|[**deleteBlockMember**](#deleteblockmember) | **DELETE** /api/v2/block/delete/{memberId} | 차단 목록에서 탈퇴한 회원 삭제 API|
|[**getBlockList**](#getblocklist) | **GET** /api/v2/block | 차단 목록 조회 API|
|[**unblockMember**](#unblockmember) | **DELETE** /api/v2/block/{memberId} | 회원 차단 해제 API|

# **blockMember**
> ApiResponseBlockResponse blockMember()

대상 회원을 차단하는 API 입니다.

### Example

```typescript
import {
    BlockApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BlockApi(configuration);

let memberId: number; //차단할 대상 회원의 id 입니다. (default to undefined)

const { status, data } = await apiInstance.blockMember(
    memberId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **memberId** | [**number**] | 차단할 대상 회원의 id 입니다. | defaults to undefined|


### Return type

**ApiResponseBlockResponse**

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

# **deleteBlockMember**
> ApiResponseBlockResponse deleteBlockMember()

차단 목록에서 특정 회원이 탈퇴한 회원인 경우, 삭제하는 API 입니다. (차단 해제 아님)

### Example

```typescript
import {
    BlockApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BlockApi(configuration);

let memberId: number; //목록에서 삭제할 대상 회원의 id 입니다. (default to undefined)

const { status, data } = await apiInstance.deleteBlockMember(
    memberId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **memberId** | [**number**] | 목록에서 삭제할 대상 회원의 id 입니다. | defaults to undefined|


### Return type

**ApiResponseBlockResponse**

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

# **getBlockList**
> ApiResponseBlockListResponse getBlockList()

내가 차단한 회원의 목록을 조회하는 API 입니다.

### Example

```typescript
import {
    BlockApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BlockApi(configuration);

let page: number; //페이지 번호, 1 이상의 숫자를 입력해 주세요. (default to undefined)

const { status, data } = await apiInstance.getBlockList(
    page
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | 페이지 번호, 1 이상의 숫자를 입력해 주세요. | defaults to undefined|


### Return type

**ApiResponseBlockListResponse**

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

# **unblockMember**
> ApiResponseBlockResponse unblockMember()

해당 회원에 대한 차단을 해제하는 API 입니다.

### Example

```typescript
import {
    BlockApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BlockApi(configuration);

let memberId: number; //차단을 해제할 대상 회원의 id 입니다. (default to undefined)

const { status, data } = await apiInstance.unblockMember(
    memberId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **memberId** | [**number**] | 차단을 해제할 대상 회원의 id 입니다. | defaults to undefined|


### Return type

**ApiResponseBlockResponse**

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

