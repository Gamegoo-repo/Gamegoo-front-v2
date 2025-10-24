# ApiErrorResponse

공통 에러 응답 포맷

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**status** | **number** | HTTP 상태 코드 | [optional] [default to undefined]
**message** | **string** | 에러 메시지 | [optional] [default to undefined]
**code** | **string** | 비즈니스 에러 코드 | [optional] [default to undefined]
**data** | **object** | 응답 데이터 (에러 시 null) | [optional] [default to undefined]

## Example

```typescript
import { ApiErrorResponse } from './api';

const instance: ApiErrorResponse = {
    status,
    message,
    code,
    data,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
