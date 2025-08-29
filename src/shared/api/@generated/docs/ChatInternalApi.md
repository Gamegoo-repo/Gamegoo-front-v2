# ChatInternalApi

All URIs are relative to *https://api.gamegoo.co.kr*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**addChat**](#addchat) | **POST** /api/v2/internal/{memberId}/chat/{chatroomUuid} | 채팅 메시지 등록 API|
|[**getChatroomUuid**](#getchatroomuuid) | **GET** /api/v2/internal/{memberId}/chatroom/uuid | 채팅방 uuid 조회 API|

# **addChat**
> ApiResponseChatCreateResponse addChat(chatCreateRequest)

새로운 채팅 메시지를 등록하는 API 입니다.

### Example

```typescript
import {
    ChatInternalApi,
    Configuration,
    ChatCreateRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new ChatInternalApi(configuration);

let memberId: number; // (default to undefined)
let chatroomUuid: string; // (default to undefined)
let chatCreateRequest: ChatCreateRequest; //

const { status, data } = await apiInstance.addChat(
    memberId,
    chatroomUuid,
    chatCreateRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **chatCreateRequest** | **ChatCreateRequest**|  | |
| **memberId** | [**number**] |  | defaults to undefined|
| **chatroomUuid** | [**string**] |  | defaults to undefined|


### Return type

**ApiResponseChatCreateResponse**

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

# **getChatroomUuid**
> ApiResponseListString getChatroomUuid()

회원이 속한 채팅방의 uuid를 조회하는 API 입니다.

### Example

```typescript
import {
    ChatInternalApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ChatInternalApi(configuration);

let memberId: number; // (default to undefined)

const { status, data } = await apiInstance.getChatroomUuid(
    memberId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **memberId** | [**number**] |  | defaults to undefined|


### Return type

**ApiResponseListString**

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

