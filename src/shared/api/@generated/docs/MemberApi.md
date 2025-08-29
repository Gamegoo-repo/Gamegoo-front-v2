# MemberApi

All URIs are relative to *https://api.gamegoo.co.kr*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**addGameStyle**](#addgamestyle) | **PUT** /api/v2/profile/gamestyle | gamestyle 추가 및 수정 API 입니다.|
|[**getMember**](#getmember) | **GET** /api/v2/profile/other | 다른 회원 프로필 조회 API 입니다. (jwt 토큰 O)|
|[**getMemberJWT**](#getmemberjwt) | **GET** /api/v2/profile | 내 프로필 조회 API 입니다. (jwt 토큰 O)|
|[**grantAdminRole**](#grantadminrole) | **PATCH** /api/v2/profile/admin/grant/{memberId} | 어드민 권한 부여 API (개발용)|
|[**modifyIsMike**](#modifyismike) | **PUT** /api/v2/profile/mike | 마이크 여부 수정 API 입니다.|
|[**modifyPosition**](#modifyposition) | **PUT** /api/v2/profile/position | 주/부/원하는 포지션 수정 API 입니다.|
|[**modifyProfileImage**](#modifyprofileimage) | **PUT** /api/v2/profile/profileImage | 프로필 이미지 수정 API 입니다.|
|[**refreshChampionStats**](#refreshchampionstats) | **PUT** /api/v2/profile/champion-stats/refresh | 챔피언 통계 새로고침 API 입니다.|
|[**revokeAdminRole**](#revokeadminrole) | **PATCH** /api/v2/profile/admin/revoke/{memberId} | 일반 사용자 권한으로 변경 API (개발용)|

# **addGameStyle**
> ApiResponseString addGameStyle(gameStyleRequest)

API for Gamestyle addition and modification 

### Example

```typescript
import {
    MemberApi,
    Configuration,
    GameStyleRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new MemberApi(configuration);

let gameStyleRequest: GameStyleRequest; //

const { status, data } = await apiInstance.addGameStyle(
    gameStyleRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **gameStyleRequest** | **GameStyleRequest**|  | |


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

# **getMember**
> ApiResponseOtherProfileResponse getMember()

API for looking up other member with jwt

### Example

```typescript
import {
    MemberApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MemberApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getMember(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ApiResponseOtherProfileResponse**

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

# **getMemberJWT**
> ApiResponseMyProfileResponse getMemberJWT()

API for looking up member with jwt

### Example

```typescript
import {
    MemberApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MemberApi(configuration);

const { status, data } = await apiInstance.getMemberJWT();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**ApiResponseMyProfileResponse**

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

# **grantAdminRole**
> ApiResponseString grantAdminRole()

개발용 어드민 권한 부여 API

### Example

```typescript
import {
    MemberApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MemberApi(configuration);

let memberId: number; // (default to undefined)

const { status, data } = await apiInstance.grantAdminRole(
    memberId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **memberId** | [**number**] |  | defaults to undefined|


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

# **modifyIsMike**
> ApiResponseString modifyIsMike(isMikeRequest)

API for isMike Modification

### Example

```typescript
import {
    MemberApi,
    Configuration,
    IsMikeRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new MemberApi(configuration);

let isMikeRequest: IsMikeRequest; //

const { status, data } = await apiInstance.modifyIsMike(
    isMikeRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **isMikeRequest** | **IsMikeRequest**|  | |


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

# **modifyPosition**
> ApiResponseString modifyPosition(positionRequest)

API for Main/Sub/Want Position Modification

### Example

```typescript
import {
    MemberApi,
    Configuration,
    PositionRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new MemberApi(configuration);

let positionRequest: PositionRequest; //

const { status, data } = await apiInstance.modifyPosition(
    positionRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **positionRequest** | **PositionRequest**|  | |


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

# **modifyProfileImage**
> ApiResponseString modifyProfileImage(profileImageRequest)

API for Profile Image Modification

### Example

```typescript
import {
    MemberApi,
    Configuration,
    ProfileImageRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new MemberApi(configuration);

let profileImageRequest: ProfileImageRequest; //

const { status, data } = await apiInstance.modifyProfileImage(
    profileImageRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **profileImageRequest** | **ProfileImageRequest**|  | |


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

# **refreshChampionStats**
> ApiResponseMyProfileResponse refreshChampionStats()

API for refreshing champion statistics

### Example

```typescript
import {
    MemberApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MemberApi(configuration);

let memberId: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.refreshChampionStats(
    memberId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **memberId** | [**number**] |  | (optional) defaults to undefined|


### Return type

**ApiResponseMyProfileResponse**

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

# **revokeAdminRole**
> ApiResponseString revokeAdminRole()

어드민 권한을 일반 사용자로 변경하는 API

### Example

```typescript
import {
    MemberApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MemberApi(configuration);

let memberId: number; // (default to undefined)

const { status, data } = await apiInstance.revokeAdminRole(
    memberId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **memberId** | [**number**] |  | defaults to undefined|


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

