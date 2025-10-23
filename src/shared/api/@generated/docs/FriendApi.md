# FriendApi

All URIs are relative to *https://api.gamegoo.co.kr*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**acceptFriendRequest**](#acceptfriendrequest) | **PATCH** /api/v2/friend/request/{memberId}/accept | 친구 요청 수락 API|
|[**cancelFriendRequest**](#cancelfriendrequest) | **DELETE** /api/v2/friend/request/{memberId} | 친구 요청 취소 API|
|[**deleteFriend**](#deletefriend) | **DELETE** /api/v2/friend/{memberId} | 친구 삭제 API|
|[**getFriendList**](#getfriendlist) | **GET** /api/v2/friend | 친구 목록 조회 API|
|[**rejectFriendRequest**](#rejectfriendrequest) | **PATCH** /api/v2/friend/request/{memberId}/reject | 친구 요청 거절 API|
|[**reverseFriendLiked**](#reversefriendliked) | **PATCH** /api/v2/friend/{memberId}/star | 친구 즐겨찾기 설정/해제 API|
|[**searchFriend**](#searchfriend) | **GET** /api/v2/friend/search | 소환사명으로 친구 검색 API|
|[**sendFriendRequest**](#sendfriendrequest) | **POST** /api/v2/friend/request/{memberId} | 친구 요청 전송 API|

# **acceptFriendRequest**
> ApiResponseFriendRequestResponse acceptFriendRequest()

대상 회원이 보낸 친구 요청을 수락 처리하는 API 입니다.

### Example

```typescript
import {
    FriendApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FriendApi(configuration);

let memberId: number; //친구 요청을 수락할 대상 회원의 id 입니다. (default to undefined)

const { status, data } = await apiInstance.acceptFriendRequest(
    memberId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **memberId** | [**number**] | 친구 요청을 수락할 대상 회원의 id 입니다. | defaults to undefined|


### Return type

**ApiResponseFriendRequestResponse**

### Authorization

[JWT TOKEN](../README.md#JWT TOKEN)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**404** | [MEMBER_401] 사용자를 찾을 수 없습니다. [FRIEND_407] 취소/수락/거절할 친구 요청이 존재하지 않습니다. [AUTH_412] 탈퇴한 사용자 입니다. |  -  |
|**400** | [FRIEND_401] 잘못된 친구 요청입니다. |  -  |
|**401** | [AUTH_410] 로그인 후 이용가능합니다. 토큰을 입력해 주세요 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **cancelFriendRequest**
> ApiResponseFriendRequestResponse cancelFriendRequest()

대상 회원에게 보낸 친구 요청을 취소하는 API 입니다.

### Example

```typescript
import {
    FriendApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FriendApi(configuration);

let memberId: number; //친구 요청을 취소할 대상 회원의 id 입니다. (default to undefined)

const { status, data } = await apiInstance.cancelFriendRequest(
    memberId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **memberId** | [**number**] | 친구 요청을 취소할 대상 회원의 id 입니다. | defaults to undefined|


### Return type

**ApiResponseFriendRequestResponse**

### Authorization

[JWT TOKEN](../README.md#JWT TOKEN)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**404** | [MEMBER_401] 사용자를 찾을 수 없습니다. [FRIEND_407] 취소/수락/거절할 친구 요청이 존재하지 않습니다. [AUTH_412] 탈퇴한 사용자 입니다. |  -  |
|**400** | [FRIEND_401] 잘못된 친구 요청입니다. |  -  |
|**401** | [AUTH_410] 로그인 후 이용가능합니다. 토큰을 입력해 주세요 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteFriend**
> ApiResponseDeleteFriendResponse deleteFriend()

친구 회원과의 친구 관계를 끊는 API 입니다.

### Example

```typescript
import {
    FriendApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FriendApi(configuration);

let memberId: number; //삭제 처리할 친구 회원의 id 입니다. (default to undefined)

const { status, data } = await apiInstance.deleteFriend(
    memberId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **memberId** | [**number**] | 삭제 처리할 친구 회원의 id 입니다. | defaults to undefined|


### Return type

**ApiResponseDeleteFriendResponse**

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
|**400** | [FRIEND_401] 잘못된 친구 요청입니다. [FRIEND_408] 두 회원은 친구 관계가 아닙니다. |  -  |
|**401** | [AUTH_410] 로그인 후 이용가능합니다. 토큰을 입력해 주세요 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getFriendList**
> ApiResponseFriendListResponse getFriendList()

해당 회원의 친구 목록을 조회하는 API 입니다. 이름 오름차순(한글-영문-숫자 순)으로 정렬해 제공합니다.

### Example

```typescript
import {
    FriendApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FriendApi(configuration);

const { status, data } = await apiInstance.getFriendList();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**ApiResponseFriendListResponse**

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

# **rejectFriendRequest**
> ApiResponseFriendRequestResponse rejectFriendRequest()

대상 회원이 보낸 친구 요청을 거절 처리하는 API 입니다.

### Example

```typescript
import {
    FriendApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FriendApi(configuration);

let memberId: number; //친구 요청을 거절할 대상 회원의 id 입니다. (default to undefined)

const { status, data } = await apiInstance.rejectFriendRequest(
    memberId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **memberId** | [**number**] | 친구 요청을 거절할 대상 회원의 id 입니다. | defaults to undefined|


### Return type

**ApiResponseFriendRequestResponse**

### Authorization

[JWT TOKEN](../README.md#JWT TOKEN)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**404** | [MEMBER_401] 사용자를 찾을 수 없습니다. [FRIEND_407] 취소/수락/거절할 친구 요청이 존재하지 않습니다. [AUTH_412] 탈퇴한 사용자 입니다. |  -  |
|**400** | [FRIEND_401] 잘못된 친구 요청입니다. |  -  |
|**401** | [AUTH_410] 로그인 후 이용가능합니다. 토큰을 입력해 주세요 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **reverseFriendLiked**
> ApiResponseStarFriendResponse reverseFriendLiked()

대상 친구 회원을 즐겨찾기 설정/해제 하는 API 입니다.

### Example

```typescript
import {
    FriendApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FriendApi(configuration);

let memberId: number; //즐겨찾기 설정/해제할 친구 회원의 id 입니다. (default to undefined)

const { status, data } = await apiInstance.reverseFriendLiked(
    memberId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **memberId** | [**number**] | 즐겨찾기 설정/해제할 친구 회원의 id 입니다. | defaults to undefined|


### Return type

**ApiResponseStarFriendResponse**

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
|**400** | [FRIEND_401] 잘못된 친구 요청입니다. [FRIEND_408] 두 회원은 친구 관계가 아닙니다. |  -  |
|**403** | [MEMBER_402] 대상 회원이 탈퇴했습니다. |  -  |
|**401** | [AUTH_410] 로그인 후 이용가능합니다. 토큰을 입력해 주세요 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **searchFriend**
> ApiResponseListFriendInfoResponse searchFriend()

해당 회원의 친구 중, query string으로 시작하는 소환사명을 가진 모든 친구 목록을 조회합니다.

### Example

```typescript
import {
    FriendApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FriendApi(configuration);

let query: string; //친구 목록 검색을 위한 소환사명 string으로, 100자 이하여야 합니다. (default to undefined)

const { status, data } = await apiInstance.searchFriend(
    query
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **query** | [**string**] | 친구 목록 검색을 위한 소환사명 string으로, 100자 이하여야 합니다. | defaults to undefined|


### Return type

**ApiResponseListFriendInfoResponse**

### Authorization

[JWT TOKEN](../README.md#JWT TOKEN)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | [FRIEND_409] 친구 검색 쿼리는 100자 이하여야 합니다. |  -  |
|**401** | [AUTH_410] 로그인 후 이용가능합니다. 토큰을 입력해 주세요 |  -  |
|**404** | [MEMBER_401] 사용자를 찾을 수 없습니다. [AUTH_412] 탈퇴한 사용자 입니다. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **sendFriendRequest**
> ApiResponseFriendRequestResponse sendFriendRequest()

대상 회원에게 친구 요청을 전송하는 API 입니다. 대상 회원에게 친구 요청 알림을 전송합니다.

### Example

```typescript
import {
    FriendApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FriendApi(configuration);

let memberId: number; //친구 요청을 전송할 대상 회원의 id 입니다. (default to undefined)

const { status, data } = await apiInstance.sendFriendRequest(
    memberId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **memberId** | [**number**] | 친구 요청을 전송할 대상 회원의 id 입니다. | defaults to undefined|


### Return type

**ApiResponseFriendRequestResponse**

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
|**400** | [FRIEND_401] 잘못된 친구 요청입니다. [FRIEND_402] 내가 차단한 회원입니다. 친구 요청을 보낼 수 없습니다. [FRIEND_403] 나를 차단한 회원입니다. 친구 요청을 보낼 수 없습니다. [FRIEND_406] 두 회원은 이미 친구 관계 입니다. 친구 요청을 보낼 수 없습니다. [FRIEND_404] 해당 회원에게 보낸 수락 대기 중인 친구 요청이 존재합니다. 친구 요청을 보낼 수 없습니다. [FRIEND_405] 해당 회원이 나에게 보낸 친구 요청이 수락 대기 중 입니다. 해당 요청을 수락 해주세요. |  -  |
|**403** | [MEMBER_402] 대상 회원이 탈퇴했습니다. |  -  |
|**401** | [AUTH_410] 로그인 후 이용가능합니다. 토큰을 입력해 주세요 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

