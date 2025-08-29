# NotificationApi

All URIs are relative to *https://api.gamegoo.co.kr*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getNotificationListByCursor**](#getnotificationlistbycursor) | **GET** /api/v2/notification | 알림 팝업 목록 조회 API|
|[**getNotificationListByPage**](#getnotificationlistbypage) | **GET** /api/v2/notification/total | 알림 전체 목록 조회 API|
|[**getUnreadNotificationCount**](#getunreadnotificationcount) | **GET** /api/v2/notification/unread/count | 안읽은 알림 개수 조회 API|
|[**readNotification**](#readnotification) | **PATCH** /api/v2/notification/{notificationId} | 알림 읽음 처리 API|

# **getNotificationListByCursor**
> ApiResponseNotificationCursorListResponse getNotificationListByCursor()

알림 팝업 화면에서 알림 목록을 조회하는 API 입니다.

### Example

```typescript
import {
    NotificationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new NotificationApi(configuration);

let cursor: number; //페이징을 위한 커서, Long 타입 notificationId를 보내주세요. 보내지 않으면 가장 최근 알림 10개를 조회합니다. (optional) (default to undefined)

const { status, data } = await apiInstance.getNotificationListByCursor(
    cursor
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **cursor** | [**number**] | 페이징을 위한 커서, Long 타입 notificationId를 보내주세요. 보내지 않으면 가장 최근 알림 10개를 조회합니다. | (optional) defaults to undefined|


### Return type

**ApiResponseNotificationCursorListResponse**

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

# **getNotificationListByPage**
> ApiResponseNotificationPageListResponse getNotificationListByPage()

알림 전체보기 화면에서 알림 목록을 조회하는 API 입니다.

### Example

```typescript
import {
    NotificationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new NotificationApi(configuration);

let page: number; //페이지 번호, 1 이상의 숫자를 입력해 주세요. (default to undefined)

const { status, data } = await apiInstance.getNotificationListByPage(
    page
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | 페이지 번호, 1 이상의 숫자를 입력해 주세요. | defaults to undefined|


### Return type

**ApiResponseNotificationPageListResponse**

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

# **getUnreadNotificationCount**
> ApiResponseInteger getUnreadNotificationCount()

해당 회원의 안읽은 알림의 개수를 조회하는 API 입니다.

### Example

```typescript
import {
    NotificationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new NotificationApi(configuration);

const { status, data } = await apiInstance.getUnreadNotificationCount();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**ApiResponseInteger**

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

# **readNotification**
> ApiResponseReadNotificationResponse readNotification()

특정 알림을 읽음 처리하는 API 입니다.

### Example

```typescript
import {
    NotificationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new NotificationApi(configuration);

let notificationId: number; //읽음 처리할 알림의 id 입니다. (default to undefined)

const { status, data } = await apiInstance.readNotification(
    notificationId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **notificationId** | [**number**] | 읽음 처리할 알림의 id 입니다. | defaults to undefined|


### Return type

**ApiResponseReadNotificationResponse**

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

