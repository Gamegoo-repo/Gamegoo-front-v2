# EnterChatroomResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**uuid** | **string** |  | [default to undefined]
**memberId** | **number** |  | [default to undefined]
**gameName** | **string** |  | [default to undefined]
**memberProfileImg** | **number** |  | [default to undefined]
**friend** | **boolean** |  | [default to undefined]
**blocked** | **boolean** |  | [default to undefined]
**blind** | **boolean** |  | [default to undefined]
**friendRequestMemberId** | **number** |  | [optional] [default to undefined]
**system** | [**SystemFlagResponse**](SystemFlagResponse.md) |  | [optional] [default to undefined]
**chatMessageListResponse** | [**ChatMessageListResponse**](ChatMessageListResponse.md) |  | [default to undefined]

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
