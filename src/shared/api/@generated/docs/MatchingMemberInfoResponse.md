# MatchingMemberInfoResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**memberId** | **number** |  | [default to undefined]
**matchingUuid** | **string** |  | [default to undefined]
**gameName** | **string** |  | [default to undefined]
**tag** | **string** |  | [default to undefined]
**soloTier** | [**Tier**](Tier.md) |  | [default to undefined]
**soloRank** | **number** |  | [default to undefined]
**freeTier** | [**Tier**](Tier.md) |  | [default to undefined]
**freeRank** | **number** |  | [default to undefined]
**mannerLevel** | **number** |  | [default to undefined]
**profileImg** | **number** |  | [default to undefined]
**gameMode** | [**GameMode**](GameMode.md) |  | [default to undefined]
**mainP** | [**Position**](Position.md) |  | [default to undefined]
**subP** | [**Position**](Position.md) |  | [default to undefined]
**wantP** | **Array&lt;string&gt;** |  | [default to undefined]
**mike** | [**Mike**](Mike.md) |  | [default to undefined]
**gameStyleResponseList** | [**Array&lt;GameStyleResponse&gt;**](GameStyleResponse.md) |  | [default to undefined]

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
