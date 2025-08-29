# EnterChatroomResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**uuid** | **string** |  | [optional] [default to undefined]
**memberId** | **number** |  | [optional] [default to undefined]
**gameName** | **string** |  | [optional] [default to undefined]
**memberProfileImg** | **number** |  | [optional] [default to undefined]
**friend** | **boolean** |  | [optional] [default to undefined]
**blocked** | **boolean** |  | [optional] [default to undefined]
**blind** | **boolean** |  | [optional] [default to undefined]
**friendRequestMemberId** | **number** |  | [optional] [default to undefined]
**system** | [**SystemFlagResponse**](SystemFlagResponse.md) |  | [optional] [default to undefined]
**chatMessageListResponse** | [**ChatMessageListResponse**](ChatMessageListResponse.md) |  | [optional] [default to undefined]

## Example

```typescript
import { EnterChatroomResponse } from './api';

const instance: EnterChatroomResponse = {
    uuid,
    memberId,
    gameName,
    memberProfileImg,
    friend,
    blocked,
    blind,
    friendRequestMemberId,
    system,
    chatMessageListResponse,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
