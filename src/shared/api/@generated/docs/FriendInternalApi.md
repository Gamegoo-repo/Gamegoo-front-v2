# FriendInternalApi

All URIs are relative to *https://qaapi.gamegoo.co.kr*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getFriendIds**](#getfriendids) | **GET** /api/v2/internal/{memberId}/friend/ids | 모든 친구 id 조회 API|

# **getFriendIds**
> ApiResponseListLong getFriendIds()

해당 회원의 모든 친구 id 목록을 조회하는 API 입니다. 정렬 기능 없음, socket서버용 API입니다.

### Example

```typescript
import {
    FriendInternalApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FriendInternalApi(configuration);

let memberId: number; // (default to undefined)

const { status, data } = await apiInstance.getFriendIds(
    memberId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **memberId** | [**number**] |  | defaults to undefined|


### Return type

**ApiResponseListLong**

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

