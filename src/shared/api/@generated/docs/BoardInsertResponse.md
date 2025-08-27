# BoardInsertResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**boardId** | **number** |  | [optional] [default to undefined]
**memberId** | **number** |  | [optional] [default to undefined]
**profileImage** | **number** |  | [optional] [default to undefined]
**gameName** | **string** |  | [optional] [default to undefined]
**tag** | **string** |  | [optional] [default to undefined]
**tier** | [**Tier**](Tier.md) |  | [optional] [default to undefined]
**rank** | **number** |  | [optional] [default to undefined]
**gameMode** | [**GameMode**](GameMode.md) |  | [optional] [default to undefined]
**mainP** | [**Position**](Position.md) |  | [optional] [default to undefined]
**subP** | [**Position**](Position.md) |  | [optional] [default to undefined]
**wantP** | [**Array&lt;Position&gt;**](Position.md) |  | [optional] [default to undefined]
**mike** | [**Mike**](Mike.md) |  | [optional] [default to undefined]
**gameStyles** | **Array&lt;number&gt;** |  | [optional] [default to undefined]
**contents** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { BoardInsertResponse } from './api';

const instance: BoardInsertResponse = {
    boardId,
    memberId,
    profileImage,
    gameName,
    tag,
    tier,
    rank,
    gameMode,
    mainP,
    subP,
    wantP,
    mike,
    gameStyles,
    contents,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
