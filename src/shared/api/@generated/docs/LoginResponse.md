# LoginResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**name** | **string** |  | [optional] [default to undefined]
**profileImage** | **number** |  | [optional] [default to undefined]
**accessToken** | **string** |  | [optional] [default to undefined]
**refreshToken** | **string** |  | [optional] [default to undefined]
**banType** | [**BanType**](BanType.md) |  | [optional] [default to undefined]
**banExpireAt** | **string** |  | [optional] [default to undefined]
**banMessage** | **string** |  | [optional] [default to undefined]
**banned** | **boolean** |  | [optional] [default to undefined]

## Example

```typescript
import { LoginResponse } from './api';

const instance: LoginResponse = {
    id,
    name,
    profileImage,
    accessToken,
    refreshToken,
    banType,
    banExpireAt,
    banMessage,
    banned,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
