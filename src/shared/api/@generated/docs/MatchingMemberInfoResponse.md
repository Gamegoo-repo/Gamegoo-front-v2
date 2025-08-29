# MatchingMemberInfoResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**memberId** | **number** |  | [optional] [default to undefined]
**matchingUuid** | **string** |  | [optional] [default to undefined]
**gameName** | **string** |  | [optional] [default to undefined]
**tag** | **string** |  | [optional] [default to undefined]
**soloTier** | [**Tier**](Tier.md) |  | [optional] [default to undefined]
**soloRank** | **number** |  | [optional] [default to undefined]
**freeTier** | [**Tier**](Tier.md) |  | [optional] [default to undefined]
**freeRank** | **number** |  | [optional] [default to undefined]
**mannerLevel** | **number** |  | [optional] [default to undefined]
**profileImg** | **number** |  | [optional] [default to undefined]
**gameMode** | [**GameMode**](GameMode.md) |  | [optional] [default to undefined]
**mainP** | [**Position**](Position.md) |  | [optional] [default to undefined]
**subP** | [**Position**](Position.md) |  | [optional] [default to undefined]
**wantP** | [**Array&lt;Position&gt;**](Position.md) |  | [optional] [default to undefined]
**mike** | [**Mike**](Mike.md) |  | [optional] [default to undefined]
**gameStyleResponseList** | [**Array&lt;GameStyleResponse&gt;**](GameStyleResponse.md) |  | [optional] [default to undefined]

## Example

```typescript
import { MatchingMemberInfoResponse } from './api';

const instance: MatchingMemberInfoResponse = {
    memberId,
    matchingUuid,
    gameName,
    tag,
    soloTier,
    soloRank,
    freeTier,
    freeRank,
    mannerLevel,
    profileImg,
    gameMode,
    mainP,
    subP,
    wantP,
    mike,
    gameStyleResponseList,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
