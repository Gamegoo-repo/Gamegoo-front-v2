# BoardApi

All URIs are relative to *https://api.gamegoo.co.kr*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**_delete**](#_delete) | **DELETE** /api/v2/posts/{boardId} | 게시판 글 삭제 API|
|[**boardInsert**](#boardinsert) | **POST** /api/v2/posts | 게시판 글 작성 API|
|[**boardList**](#boardlist) | **GET** /api/v2/posts/list | 게시판 글 목록 조회 API|
|[**boardUpdate**](#boardupdate) | **PUT** /api/v2/posts/{boardId} | 게시판 글 수정 API|
|[**bumpBoard**](#bumpboard) | **POST** /api/v2/posts/{boardId}/bump | 게시글 끌올 API|
|[**deleteGuestBoard**](#deleteguestboard) | **DELETE** /api/v2/posts/guest/{boardId} | 비회원 게시판 글 삭제 API|
|[**getBoardById**](#getboardbyid) | **GET** /api/v2/posts/list/{boardId} | 비회원용 게시판 글 조회 API|
|[**getBoardByIdForMember**](#getboardbyidformember) | **GET** /api/v2/posts/member/list/{boardId} | 회원용 게시판 글 조회 API|
|[**getBoardsWithCursor**](#getboardswithcursor) | **GET** /api/v2/posts/cursor | 커서 기반 게시판 글 목록 조회 API|
|[**getMyBoardCursorList**](#getmyboardcursorlist) | **GET** /api/v2/posts/my/cursor | 내가 작성한 게시판 글 목록 조회 API/모바일|
|[**getMyBoardList**](#getmyboardlist) | **GET** /api/v2/posts/my | 내가 작성한 게시판 글 목록 조회 API|
|[**guestBoardInsert**](#guestboardinsert) | **POST** /api/v2/posts/guest | 비회원 게시판 글 작성 API|
|[**guestBoardUpdate**](#guestboardupdate) | **PUT** /api/v2/posts/guest/{boardId} | 비회원 게시판 글 수정 API|

# **_delete**
> ApiResponseString _delete()

게시판에서 글을 삭제하는 API 입니다.

### Example

```typescript
import {
    BoardApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BoardApi(configuration);

let boardId: number; //삭제할 게시판 글 id 입니다. (default to undefined)

const { status, data } = await apiInstance._delete(
    boardId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **boardId** | [**number**] | 삭제할 게시판 글 id 입니다. | defaults to undefined|


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

# **boardInsert**
> ApiResponseBoardInsertResponse boardInsert(boardInsertRequest)

게시판에서 글을 작성하는 API 입니다. 프로필이미지 값: 1~8, gameMode: < 빠른대전: FAST, 솔로랭크: SOLO, 자유랭크: FREE, 칼바람 나락: ARAM >, 주 포지션, 부포지션, 희망 포지션: < TOP, JUNGLE, MID, ADC, SUP, ANY >, 마이크 여부: < AVAILABLE, UNAVAILABLE >, 게임 스타일 리스트: 1~3개 선택 가능

### Example

```typescript
import {
    BoardApi,
    Configuration,
    BoardInsertRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new BoardApi(configuration);

let boardInsertRequest: BoardInsertRequest; //

const { status, data } = await apiInstance.boardInsert(
    boardInsertRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **boardInsertRequest** | **BoardInsertRequest**|  | |


### Return type

**ApiResponseBoardInsertResponse**

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

# **boardList**
> ApiResponseBoardResponse boardList()

게시판 글 목록을 조회하는 API 입니다. 필터링을 원하면 각 파라미터를 입력하세요.

### Example

```typescript
import {
    BoardApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BoardApi(configuration);

let page: number; // (default to undefined)
let gameMode: GameMode; //(선택) 게임 모드를 입력해주세요. < 빠른대전: FAST, 솔로랭크: SOLO, 자유랭크: FREE, 칼바람 나락: ARAM > (optional) (default to undefined)
let tier: Tier; //(선택) 티어를 선택해주세요. (optional) (default to undefined)
let mainP: Position; //(선택) 주 포지션을 입력해주세요. < 전체: ANY, 탑: TOP, 정글: JUNGLE, 미드: MID, 원딜: ADC, 서포터: SUP > (optional) (default to undefined)
let subP: Position; //(선택) 부 포지션을 입력해주세요. < 전체: ANY, 탑: TOP, 정글: JUNGLE, 미드: MID, 원딜: ADC, 서포터: SUP > (optional) (default to undefined)
let mike: Mike; //(선택) 마이크 여부를 선택해주세요. (optional) (default to undefined)

const { status, data } = await apiInstance.boardList(
    page,
    gameMode,
    tier,
    mainP,
    subP,
    mike
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] |  | defaults to undefined|
| **gameMode** | **GameMode** | (선택) 게임 모드를 입력해주세요. &lt; 빠른대전: FAST, 솔로랭크: SOLO, 자유랭크: FREE, 칼바람 나락: ARAM &gt; | (optional) defaults to undefined|
| **tier** | **Tier** | (선택) 티어를 선택해주세요. | (optional) defaults to undefined|
| **mainP** | **Position** | (선택) 주 포지션을 입력해주세요. &lt; 전체: ANY, 탑: TOP, 정글: JUNGLE, 미드: MID, 원딜: ADC, 서포터: SUP &gt; | (optional) defaults to undefined|
| **subP** | **Position** | (선택) 부 포지션을 입력해주세요. &lt; 전체: ANY, 탑: TOP, 정글: JUNGLE, 미드: MID, 원딜: ADC, 서포터: SUP &gt; | (optional) defaults to undefined|
| **mike** | **Mike** | (선택) 마이크 여부를 선택해주세요. | (optional) defaults to undefined|


### Return type

**ApiResponseBoardResponse**

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

# **boardUpdate**
> ApiResponseBoardUpdateResponse boardUpdate(boardUpdateRequest)

게시판에서 글을 수정하는 API 입니다.

### Example

```typescript
import {
    BoardApi,
    Configuration,
    BoardUpdateRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new BoardApi(configuration);

let boardId: number; //수정할 게시판 글 id 입니다. (default to undefined)
let boardUpdateRequest: BoardUpdateRequest; //

const { status, data } = await apiInstance.boardUpdate(
    boardId,
    boardUpdateRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **boardUpdateRequest** | **BoardUpdateRequest**|  | |
| **boardId** | [**number**] | 수정할 게시판 글 id 입니다. | defaults to undefined|


### Return type

**ApiResponseBoardUpdateResponse**

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

# **bumpBoard**
> ApiResponseBoardBumpResponse bumpBoard()

게시글을 끌올하여 상단 노출시키는 API 입니다. 마지막 끌올 후 1시간 제한이 적용됩니다.

### Example

```typescript
import {
    BoardApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BoardApi(configuration);

let boardId: number; //끌올할 게시판 글 id 입니다. (default to undefined)

const { status, data } = await apiInstance.bumpBoard(
    boardId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **boardId** | [**number**] | 끌올할 게시판 글 id 입니다. | defaults to undefined|


### Return type

**ApiResponseBoardBumpResponse**

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

# **deleteGuestBoard**
> ApiResponseString deleteGuestBoard(guestBoardDeleteRequest)

비회원이 게시판에서 글을 삭제하는 API 입니다.

### Example

```typescript
import {
    BoardApi,
    Configuration,
    GuestBoardDeleteRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new BoardApi(configuration);

let boardId: number; //삭제할 게시판 글 id 입니다. (default to undefined)
let guestBoardDeleteRequest: GuestBoardDeleteRequest; //

const { status, data } = await apiInstance.deleteGuestBoard(
    boardId,
    guestBoardDeleteRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **guestBoardDeleteRequest** | **GuestBoardDeleteRequest**|  | |
| **boardId** | [**number**] | 삭제할 게시판 글 id 입니다. | defaults to undefined|


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

# **getBoardById**
> ApiResponseBoardByIdResponse getBoardById()

게시판에서 글을 조회하는 API 입니다.

### Example

```typescript
import {
    BoardApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BoardApi(configuration);

let boardId: number; //조회할 게시판 글 id 입니다. (default to undefined)

const { status, data } = await apiInstance.getBoardById(
    boardId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **boardId** | [**number**] | 조회할 게시판 글 id 입니다. | defaults to undefined|


### Return type

**ApiResponseBoardByIdResponse**

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

# **getBoardByIdForMember**
> ApiResponseBoardByIdResponseForMember getBoardByIdForMember()

게시판에서 글을 조회하는 API 입니다.

### Example

```typescript
import {
    BoardApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BoardApi(configuration);

let boardId: number; //조회할 게시판 글 id 입니다. (default to undefined)

const { status, data } = await apiInstance.getBoardByIdForMember(
    boardId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **boardId** | [**number**] | 조회할 게시판 글 id 입니다. | defaults to undefined|


### Return type

**ApiResponseBoardByIdResponseForMember**

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

# **getBoardsWithCursor**
> ApiResponseBoardCursorResponse getBoardsWithCursor()

커서 기반(무한 스크롤)으로 게시판 글 목록을 조회하는 API 입니다. 최신 글부터 순차적으로 내려가며, 커서와 cursorId를 이용해 다음 페이지를 조회할 수 있습니다. 필터링을 원하면 각 파라미터를 입력하세요.

### Example

```typescript
import {
    BoardApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BoardApi(configuration);

let cursor: string; //(선택) 페이징을 위한 커서, ISO 8601 형식의 LocalDateTime을 보내주세요. 없으면 최신글부터 조회합니다. (optional) (default to undefined)
let cursorId: number; //(선택) 커서와 동일한 activityTime을 가진 게시글 중 마지막 게시글의 id. 커서 페이징에 사용됩니다. (optional) (default to undefined)
let gameMode: GameMode; //(선택) 게임 모드를 입력해주세요. < 빠른대전: FAST, 솔로랭크: SOLO, 자유랭크: FREE, 칼바람 나락: ARAM > (optional) (default to undefined)
let tier: Tier; //(선택) 티어를 선택해주세요. (optional) (default to undefined)
let position1: Position; //(선택) 주 포지션을 입력해주세요. < 전체: ANY, 탑: TOP, 정글: JUNGLE, 미드: MID, 원딜: ADC, 서포터: SUP > (optional) (default to undefined)
let position2: Position; //(선택) 부 포지션을 입력해주세요. < 전체: ANY, 탑: TOP, 정글: JUNGLE, 미드: MID, 원딜: ADC, 서포터: SUP > (optional) (default to undefined)

const { status, data } = await apiInstance.getBoardsWithCursor(
    cursor,
    cursorId,
    gameMode,
    tier,
    position1,
    position2
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **cursor** | [**string**] | (선택) 페이징을 위한 커서, ISO 8601 형식의 LocalDateTime을 보내주세요. 없으면 최신글부터 조회합니다. | (optional) defaults to undefined|
| **cursorId** | [**number**] | (선택) 커서와 동일한 activityTime을 가진 게시글 중 마지막 게시글의 id. 커서 페이징에 사용됩니다. | (optional) defaults to undefined|
| **gameMode** | **GameMode** | (선택) 게임 모드를 입력해주세요. &lt; 빠른대전: FAST, 솔로랭크: SOLO, 자유랭크: FREE, 칼바람 나락: ARAM &gt; | (optional) defaults to undefined|
| **tier** | **Tier** | (선택) 티어를 선택해주세요. | (optional) defaults to undefined|
| **position1** | **Position** | (선택) 주 포지션을 입력해주세요. &lt; 전체: ANY, 탑: TOP, 정글: JUNGLE, 미드: MID, 원딜: ADC, 서포터: SUP &gt; | (optional) defaults to undefined|
| **position2** | **Position** | (선택) 부 포지션을 입력해주세요. &lt; 전체: ANY, 탑: TOP, 정글: JUNGLE, 미드: MID, 원딜: ADC, 서포터: SUP &gt; | (optional) defaults to undefined|


### Return type

**ApiResponseBoardCursorResponse**

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

# **getMyBoardCursorList**
> ApiResponseMyBoardCursorResponse getMyBoardCursorList()

모바일에서 내가 작성한 게시판 글을 조회하는 API 입니다.

### Example

```typescript
import {
    BoardApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BoardApi(configuration);

let cursor: string; //페이징을 위한 커서, ISO 8601 형식의 LocalDateTime을 보내주세요. 보내지 않으면 가장 최근 게시물 10개를 조회합니다. (optional) (default to undefined)

const { status, data } = await apiInstance.getMyBoardCursorList(
    cursor
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **cursor** | [**string**] | 페이징을 위한 커서, ISO 8601 형식의 LocalDateTime을 보내주세요. 보내지 않으면 가장 최근 게시물 10개를 조회합니다. | (optional) defaults to undefined|


### Return type

**ApiResponseMyBoardCursorResponse**

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

# **getMyBoardList**
> ApiResponseMyBoardResponse getMyBoardList()

내가 작성한 게시판 글을 조회하는 API 입니다. 페이지 당 10개의 게시물이 표시됩니다.

### Example

```typescript
import {
    BoardApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BoardApi(configuration);

let page: number; // (default to undefined)

const { status, data } = await apiInstance.getMyBoardList(
    page
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] |  | defaults to undefined|


### Return type

**ApiResponseMyBoardResponse**

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

# **guestBoardInsert**
> ApiResponseBoardInsertResponse guestBoardInsert(guestBoardInsertRequest)

비회원이 게시판에서 글을 작성하는 API 입니다. 프로필이미지 값: 1~8, gameMode: < 빠른대전: FAST, 솔로랭크: SOLO, 자유랭크: FREE, 칼바람 나락: ARAM >, 주 포지션, 부포지션, 희망 포지션: < TOP, JUNGLE, MID, ADC, SUP, ANY >, 마이크 여부: < AVAILABLE, UNAVAILABLE >, 게임 스타일 리스트: 1~3개 선택 가능

### Example

```typescript
import {
    BoardApi,
    Configuration,
    GuestBoardInsertRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new BoardApi(configuration);

let guestBoardInsertRequest: GuestBoardInsertRequest; //

const { status, data } = await apiInstance.guestBoardInsert(
    guestBoardInsertRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **guestBoardInsertRequest** | **GuestBoardInsertRequest**|  | |


### Return type

**ApiResponseBoardInsertResponse**

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

# **guestBoardUpdate**
> ApiResponseBoardUpdateResponse guestBoardUpdate(guestBoardUpdateRequest)

비회원이 게시판에서 글을 수정하는 API 입니다.

### Example

```typescript
import {
    BoardApi,
    Configuration,
    GuestBoardUpdateRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new BoardApi(configuration);

let boardId: number; //수정할 게시판 글 id 입니다. (default to undefined)
let guestBoardUpdateRequest: GuestBoardUpdateRequest; //

const { status, data } = await apiInstance.guestBoardUpdate(
    boardId,
    guestBoardUpdateRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **guestBoardUpdateRequest** | **GuestBoardUpdateRequest**|  | |
| **boardId** | [**number**] | 수정할 게시판 글 id 입니다. | defaults to undefined|


### Return type

**ApiResponseBoardUpdateResponse**

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

