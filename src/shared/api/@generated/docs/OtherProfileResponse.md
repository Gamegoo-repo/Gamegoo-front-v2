# OtherProfileResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [default to undefined]
**profileImg** | **number** |  | [default to undefined]
**mike** | [**Mike**](Mike.md) |  | [default to undefined]
**gameName** | **string** |  | [default to undefined]
**tag** | **string** |  | [default to undefined]
**soloTier** | [**Tier**](Tier.md) |  | [default to undefined]
**soloRank** | **number** |  | [default to undefined]
**soloWinrate** | **number** |  | [optional] [default to undefined]
**freeTier** | [**Tier**](Tier.md) |  | [default to undefined]
**freeRank** | **number** |  | [default to undefined]
**freeWinrate** | **number** |  | [optional] [default to undefined]
**updatedAt** | **string** |  | [optional] [default to undefined]
**mainP** | [**Position**](Position.md) |  | [default to undefined]
**subP** | [**Position**](Position.md) |  | [default to undefined]
**wantP** | **Array&lt;string&gt;** |  | [default to undefined]
**isAgree** | **boolean** |  | [default to undefined]
**isBlind** | **boolean** |  | [default to undefined]
**loginType** | [**LoginType**](LoginType.md) |  | [default to undefined]
**blocked** | **boolean** |  | [default to undefined]
**friend** | **boolean** |  | [default to undefined]
**friendRequestMemberId** | **number** |  | [optional] [default to undefined]
**gameStyleResponseList** | [**Array&lt;GameStyleResponse&gt;**](GameStyleResponse.md) |  | [default to undefined]
**championStatsResponseList** | [**Array&lt;ChampionStatsResponse&gt;**](ChampionStatsResponse.md) |  | [default to undefined]
**memberRecentStats** | [**MemberRecentStatsResponse**](MemberRecentStatsResponse.md) |  | [optional] [default to undefined]
**canRefresh** | **boolean** |  | [default to undefined]

## Example

```typescript
import { OtherProfileResponse } from './api';

const instance: OtherProfileResponse = {
    id,
    profileImg,
    mike,
    gameName,
    tag,
    soloTier,
    soloRank,
    soloWinrate,
    freeTier,
    freeRank,
    freeWinrate,
    updatedAt,
    mainP,
    subP,
    wantP,
    isAgree,
    isBlind,
    loginType,
    blocked,
    friend,
    friendRequestMemberId,
    gameStyleResponseList,
    championStatsResponseList,
    memberRecentStats,
    canRefresh,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
