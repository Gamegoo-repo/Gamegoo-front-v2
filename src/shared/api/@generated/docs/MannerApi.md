# MannerApi

All URIs are relative to *https://api.gamegoo.co.kr*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**addNegativeMannerRating**](#addnegativemannerrating) | **POST** /api/v2/manner/negative/{memberId} | 비매너 평가 등록 API|
|[**addPositiveMannerRating**](#addpositivemannerrating) | **POST** /api/v2/manner/positive/{memberId} | 매너 평가 등록 API|
|[**getMannerKeywordInfo**](#getmannerkeywordinfo) | **GET** /api/v2/manner/keyword/{memberId} | 특정 회원의 매너 키워드 정보 조회 API|
|[**getMannerLevelInfo**](#getmannerlevelinfo) | **GET** /api/v2/manner/level/{memberId} | 특정 회원의 매너 레벨 정보 조회 API|
|[**getNegativeMannerRatingInfo**](#getnegativemannerratinginfo) | **GET** /api/v2/manner/negative/{memberId} | 특정 회원에 대한 나의 비매너 평가 조회 API|
|[**getPositiveMannerRatingInfo**](#getpositivemannerratinginfo) | **GET** /api/v2/manner/positive/{memberId} | 특정 회원에 대한 나의 매너 평가 조회 API|
|[**updateMannerRating**](#updatemannerrating) | **PUT** /api/v2/manner/{mannerId} | 매너/비매너 평가 수정 API|

# **addNegativeMannerRating**
> ApiResponseMannerInsertResponse addNegativeMannerRating(mannerInsertRequest)

비매너 평가를 등록하는 API 입니다.

### Example

```typescript
import {
    MannerApi,
    Configuration,
    MannerInsertRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new MannerApi(configuration);

let memberId: number; //비매너 평가를 등록할 대상 회원의 id 입니다. (default to undefined)
let mannerInsertRequest: MannerInsertRequest; //

const { status, data } = await apiInstance.addNegativeMannerRating(
    memberId,
    mannerInsertRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **mannerInsertRequest** | **MannerInsertRequest**|  | |
| **memberId** | [**number**] | 비매너 평가를 등록할 대상 회원의 id 입니다. | defaults to undefined|


### Return type

**ApiResponseMannerInsertResponse**

### Authorization

[JWT TOKEN](../README.md#JWT TOKEN)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**404** | [MEMBER_401] 사용자를 찾을 수 없습니다. [AUTH_412] 탈퇴한 사용자 입니다. |  -  |
|**400** | [COMMON400] 잘못된 요청입니다. [MANNER_401] 잘못된 매너 키워드 값입니다. [MANNER_403] 매너/비매너 평가는 최초 1회만 가능합니다. |  -  |
|**403** | [MEMBER_402] 대상 회원이 탈퇴했습니다. |  -  |
|**401** | [AUTH_410] 로그인 후 이용가능합니다. 토큰을 입력해 주세요 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **addPositiveMannerRating**
> ApiResponseMannerInsertResponse addPositiveMannerRating(mannerInsertRequest)

매너 평가를 등록하는 API 입니다.

### Example

```typescript
import {
    MannerApi,
    Configuration,
    MannerInsertRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new MannerApi(configuration);

let memberId: number; //매너 평가를 등록할 대상 회원의 id 입니다. (default to undefined)
let mannerInsertRequest: MannerInsertRequest; //

const { status, data } = await apiInstance.addPositiveMannerRating(
    memberId,
    mannerInsertRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **mannerInsertRequest** | **MannerInsertRequest**|  | |
| **memberId** | [**number**] | 매너 평가를 등록할 대상 회원의 id 입니다. | defaults to undefined|


### Return type

**ApiResponseMannerInsertResponse**

### Authorization

[JWT TOKEN](../README.md#JWT TOKEN)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**404** | [MEMBER_401] 사용자를 찾을 수 없습니다. [AUTH_412] 탈퇴한 사용자 입니다. |  -  |
|**400** | [COMMON400] 잘못된 요청입니다. [MANNER_401] 잘못된 매너 키워드 값입니다. [MANNER_403] 매너/비매너 평가는 최초 1회만 가능합니다. |  -  |
|**403** | [MEMBER_402] 대상 회원이 탈퇴했습니다. |  -  |
|**401** | [AUTH_410] 로그인 후 이용가능합니다. 토큰을 입력해 주세요 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getMannerKeywordInfo**
> ApiResponseMannerKeywordListResponse getMannerKeywordInfo()

특정 회원의 매너 키워드 정보를 조회하는 API 입니다.

### Example

```typescript
import {
    MannerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MannerApi(configuration);

let memberId: number; //대상 회원의 id 입니다. (default to undefined)

const { status, data } = await apiInstance.getMannerKeywordInfo(
    memberId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **memberId** | [**number**] | 대상 회원의 id 입니다. | defaults to undefined|


### Return type

**ApiResponseMannerKeywordListResponse**

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

# **getMannerLevelInfo**
> ApiResponseMannerResponse getMannerLevelInfo()

특정 회원의 매너 레벨 정보를 조회하는 API 입니다.

### Example

```typescript
import {
    MannerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MannerApi(configuration);

let memberId: number; //대상 회원의 id 입니다. (default to undefined)

const { status, data } = await apiInstance.getMannerLevelInfo(
    memberId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **memberId** | [**number**] | 대상 회원의 id 입니다. | defaults to undefined|


### Return type

**ApiResponseMannerResponse**

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

# **getNegativeMannerRatingInfo**
> ApiResponseMannerRatingResponse getNegativeMannerRatingInfo()

특정 회원에 대해 내가 실시한 비매너 평가를 조회하는 API 입니다.

### Example

```typescript
import {
    MannerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MannerApi(configuration);

let memberId: number; //대상 회원의 id 입니다. (default to undefined)

const { status, data } = await apiInstance.getNegativeMannerRatingInfo(
    memberId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **memberId** | [**number**] | 대상 회원의 id 입니다. | defaults to undefined|


### Return type

**ApiResponseMannerRatingResponse**

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

# **getPositiveMannerRatingInfo**
> ApiResponseMannerRatingResponse getPositiveMannerRatingInfo()

특정 회원에 대해 내가 실시한 매너 평가를 조회하는 API 입니다.

### Example

```typescript
import {
    MannerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MannerApi(configuration);

let memberId: number; //대상 회원의 id 입니다. (default to undefined)

const { status, data } = await apiInstance.getPositiveMannerRatingInfo(
    memberId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **memberId** | [**number**] | 대상 회원의 id 입니다. | defaults to undefined|


### Return type

**ApiResponseMannerRatingResponse**

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

# **updateMannerRating**
> ApiResponseMannerUpdateResponse updateMannerRating(mannerUpdateRequest)

매너/비매너 평가를 수정하는 API 입니다.

### Example

```typescript
import {
    MannerApi,
    Configuration,
    MannerUpdateRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new MannerApi(configuration);

let mannerId: number; //수정하고자 하는 매너/비매너 평가 id 입니다. (default to undefined)
let mannerUpdateRequest: MannerUpdateRequest; //

const { status, data } = await apiInstance.updateMannerRating(
    mannerId,
    mannerUpdateRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **mannerUpdateRequest** | **MannerUpdateRequest**|  | |
| **mannerId** | [**number**] | 수정하고자 하는 매너/비매너 평가 id 입니다. | defaults to undefined|


### Return type

**ApiResponseMannerUpdateResponse**

### Authorization

[JWT TOKEN](../README.md#JWT TOKEN)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**404** | [MANNER_404] 해당 매너 평가를 찾을 수 없습니다. [MEMBER_401] 사용자를 찾을 수 없습니다. [AUTH_412] 탈퇴한 사용자 입니다. |  -  |
|**403** | [MANNER_405] 해당 매너 평가에 접근 권한이 없습니다. [MEMBER_402] 대상 회원이 탈퇴했습니다. |  -  |
|**400** | [MANNER_401] 잘못된 매너 키워드 값입니다. |  -  |
|**401** | [AUTH_410] 로그인 후 이용가능합니다. 토큰을 입력해 주세요 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

