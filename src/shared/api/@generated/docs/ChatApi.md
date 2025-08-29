# ChatApi

All URIs are relative to *https://api.gamegoo.co.kr*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**enterChatroom**](#enterchatroom) | **GET** /api/v2/chat/{chatroomUuid}/enter | 채팅방 입장 API|
|[**exitChatroom**](#exitchatroom) | **PATCH** /api/v2/chat/{chatroomUuid}/exit | 채팅방 나가기 API|
|[**getChatMessages**](#getchatmessages) | **GET** /api/v2/chat/{chatroomUuid}/messages | 채팅 내역 조회 API|
|[**getChatroom**](#getchatroom) | **GET** /api/v2/chatroom | 채팅방 목록 조회 API|
|[**getUnreadChatroomUuid**](#getunreadchatroomuuid) | **GET** /api/v2/chat/unread | 안읽은 채팅방 uuid 목록 조회 API|
|[**readChatMessage**](#readchatmessage) | **PATCH** /api/v2/chat/{chatroomUuid}/read | 채팅 메시지 읽음 처리 API|
|[**startChatroomByBoardId**](#startchatroombyboardid) | **GET** /api/v2/chat/start/board/{boardId} | 특정 글을 통한 채팅방 시작 API|
|[**startChatroomByMemberId**](#startchatroombymemberid) | **GET** /api/v2/chat/start/member/{memberId} | 특정 회원과 채팅방 시작 API|

# **enterChatroom**
> ApiResponseEnterChatroomResponse enterChatroom()

특정 채팅방에 입장하는 API 입니다. 상대 회원 정보와 채팅 메시지 내역 등을 리턴합니다.

### Example

```typescript
import {
    ChatApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ChatApi(configuration);

let chatroomUuid: string; // (default to undefined)

const { status, data } = await apiInstance.enterChatroom(
    chatroomUuid
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **chatroomUuid** | [**string**] |  | defaults to undefined|


### Return type

**ApiResponseEnterChatroomResponse**

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

# **exitChatroom**
> ApiResponseObject exitChatroom()

채팅방 나가기 API 입니다.

### Example

```typescript
import {
    ChatApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ChatApi(configuration);

let chatroomUuid: string; // (default to undefined)

const { status, data } = await apiInstance.exitChatroom(
    chatroomUuid
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **chatroomUuid** | [**string**] |  | defaults to undefined|


### Return type

**ApiResponseObject**

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

# **getChatMessages**
> ApiResponseChatMessageListResponse getChatMessages()

특정 채팅방의 메시지 내역을 조회하는 API 입니다.  cursor 파라미터를 보내면, 해당 timestamp 이전에 전송된 메시지 최대 20개를 조회합니다.  cursor 파라미터를 보내지 않으면, 해당 채팅방의 가장 최근 메시지 내역을 조회합니다.

### Example

```typescript
import {
    ChatApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ChatApi(configuration);

let chatroomUuid: string; // (default to undefined)
let cursor: number; //페이징을 위한 커서, 13자리 timestamp integer를 보내주세요. (UTC 기준) (optional) (default to undefined)

const { status, data } = await apiInstance.getChatMessages(
    chatroomUuid,
    cursor
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **chatroomUuid** | [**string**] |  | defaults to undefined|
| **cursor** | [**number**] | 페이징을 위한 커서, 13자리 timestamp integer를 보내주세요. (UTC 기준) | (optional) defaults to undefined|


### Return type

**ApiResponseChatMessageListResponse**

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

# **getChatroom**
> ApiResponseChatroomListResponse getChatroom()

회원이 속한 채팅방 목록을 조회하는 API 입니다.

### Example

```typescript
import {
    ChatApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ChatApi(configuration);

const { status, data } = await apiInstance.getChatroom();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**ApiResponseChatroomListResponse**

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

# **getUnreadChatroomUuid**
> ApiResponseListString getUnreadChatroomUuid()

안읽은 메시지가 속한 채팅방의 uuid 목록을 조회하는 API 입니다.

### Example

```typescript
import {
    ChatApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ChatApi(configuration);

const { status, data } = await apiInstance.getUnreadChatroomUuid();
```

### Parameters
This endpoint does not have any parameters.


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

# **readChatMessage**
> ApiResponseString readChatMessage()

특정 채팅방의 메시지를 읽음 처리하는 API 입니다.

### Example

```typescript
import {
    ChatApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ChatApi(configuration);

let chatroomUuid: string; // (default to undefined)
let timestamp: number; //특정 메시지를 읽음 처리하는 경우, 그 메시지의 timestamp를 함께 보내주세요. (optional) (default to undefined)

const { status, data } = await apiInstance.readChatMessage(
    chatroomUuid,
    timestamp
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **chatroomUuid** | [**string**] |  | defaults to undefined|
| **timestamp** | [**number**] | 특정 메시지를 읽음 처리하는 경우, 그 메시지의 timestamp를 함께 보내주세요. | (optional) defaults to undefined|


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

# **startChatroomByBoardId**
> ApiResponseEnterChatroomResponse startChatroomByBoardId()

특정 글에서 말 걸어보기 버튼을 통해 채팅방을 시작하는 API 입니다.  대상 회원과의 채팅방이 이미 존재하는 경우, 채팅방 uuid, 상대 회원 정보와 채팅 메시지 내역 등을 리턴합니다.  대상 회원과의 채팅방이 존재하지 않는 경우, 채팅방을 새로 생성해 해당 채팅방의 uuid, 상대 회원 정보 등을 리턴합니다.

### Example

```typescript
import {
    ChatApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ChatApi(configuration);

let boardId: number; //말 걸어보기 버튼을 누른 게시글의 id 입니다. (default to undefined)

const { status, data } = await apiInstance.startChatroomByBoardId(
    boardId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **boardId** | [**number**] | 말 걸어보기 버튼을 누른 게시글의 id 입니다. | defaults to undefined|


### Return type

**ApiResponseEnterChatroomResponse**

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

# **startChatroomByMemberId**
> ApiResponseEnterChatroomResponse startChatroomByMemberId()

특정 대상 회원과의 채팅방을 시작하는 API 입니다.  대상 회원과의 채팅방이 이미 존재하는 경우, 채팅방 uuid, 상대 회원 정보와 채팅 메시지 내역 등을 반환합니다.  대상 회원과의 채팅방이 존재하지 않는 경우, 채팅방을 새로 생성해 해당 채팅방의 uuid, 상대 회원 정보 등을 반환합니다.

### Example

```typescript
import {
    ChatApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ChatApi(configuration);

let memberId: number; //채팅방을 시작할 대상 회원의 id 입니다. (default to undefined)

const { status, data } = await apiInstance.startChatroomByMemberId(
    memberId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **memberId** | [**number**] | 채팅방을 시작할 대상 회원의 id 입니다. | defaults to undefined|


### Return type

**ApiResponseEnterChatroomResponse**

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

