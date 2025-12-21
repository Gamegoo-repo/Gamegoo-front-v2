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
 - **Accept**: */*, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**404** | [MEMBER_401] 사용자를 찾을 수 없습니다. [CHAT_401] 채팅방을 찾을 수 없습니다. |  -  |
|**403** | [BAN_403] 채팅 사용이 제한된 상태입니다. [CHAT_410] 채팅 상대 회원을 차단한 상태입니다. 메시지 전송이 불가능합니다. [CHAT_411] 채팅 상대 회원이 나를 차단했습니다. 메시지 전송이 불가능합니다. |  -  |
|**400** | [CHAT_402] 접근할 수 없는 채팅방 입니다. [CHAT_409] 채팅 상대 회원이 탈퇴했습니다. 메시지 전송이 불가능합니다. [CHAT_412] 해당 게시글을 찾을 수 없습니다. 게시글 시스템 메시지 등록에 실패했습니다. |  -  |
|**500** | [CHAT_413] 시스템 메시지 등록에 실패했습니다. 관리자에게 문의 바랍니다. [CHAT_414] 시스템 메시지 타입 조회에 실패했습니다. 관리자에게 문의 바랍니다. |  -  |

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
 - **Accept**: */*, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**404** | [MEMBER_401] 사용자를 찾을 수 없습니다. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

