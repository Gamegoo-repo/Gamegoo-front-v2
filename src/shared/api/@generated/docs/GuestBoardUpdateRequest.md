# GuestBoardUpdateRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**gameMode** | [**GameMode**](GameMode.md) |  | [default to undefined]
**mainP** | [**Position**](Position.md) |  | [default to undefined]
**subP** | [**Position**](Position.md) |  | [default to undefined]
**wantP** | **Array&lt;string&gt;** |  | [default to undefined]
**mike** | [**Mike**](Mike.md) |  | [optional] [default to undefined]
**gameStyles** | **Array&lt;number&gt;** | 게임 스타일 리스트 (선택, 최대 3개) | [optional] [default to undefined]
**contents** | **string** | 게시글 내용 (선택) | [optional] [default to undefined]
**password** | **string** | 4-16자의 비밀번호를 입력해주세요 | [default to undefined]

## Example

```typescript
import { GuestBoardUpdateRequest } from './api';

const instance: GuestBoardUpdateRequest = {
    gameMode,
    mainP,
    subP,
    wantP,
    mike,
    gameStyles,
    contents,
    password,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
