# BoardInsertResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**boardId** | **number** |  | [default to undefined]
**memberId** | **number** |  | [optional] [default to undefined]
**profileImage** | **number** |  | [default to undefined]
**gameName** | **string** |  | [default to undefined]
**tag** | **string** |  | [default to undefined]
**tier** | [**Tier**](Tier.md) |  | [default to undefined]
**rank** | **number** |  | [default to undefined]
**gameMode** | [**GameMode**](GameMode.md) |  | [default to undefined]
**mainP** | [**Position**](Position.md) |  | [default to undefined]
**subP** | [**Position**](Position.md) |  | [default to undefined]
**wantP** | **Array&lt;string&gt;** |  | [default to undefined]
**mike** | [**Mike**](Mike.md) |  | [default to undefined]
**gameStyles** | **Array&lt;number&gt;** |  | [default to undefined]
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
