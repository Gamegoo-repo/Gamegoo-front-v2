# BoardUpdateRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**boardProfileImage** | **number** |  | [default to undefined]
**gameMode** | [**GameMode**](GameMode.md) |  | [default to undefined]
**mainP** | [**Position**](Position.md) |  | [default to undefined]
**subP** | [**Position**](Position.md) |  | [default to undefined]
**wantP** | [**Array&lt;Position&gt;**](Position.md) |  | [default to undefined]
**mike** | [**Mike**](Mike.md) |  | [optional] [default to undefined]
**gameStyles** | **Array&lt;number&gt;** |  | [default to undefined]
**contents** | **string** | 게시글 내용 (선택) | [optional] [default to undefined]

## Example

```typescript
import { BoardUpdateRequest } from './api';

const instance: BoardUpdateRequest = {
    boardProfileImage,
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
