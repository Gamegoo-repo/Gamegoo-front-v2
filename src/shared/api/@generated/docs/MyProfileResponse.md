# MyProfileResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**profileImg** | **number** |  | [optional] [default to undefined]
**mike** | [**Mike**](Mike.md) |  | [optional] [default to undefined]
**email** | **string** |  | [optional] [default to undefined]
**gameName** | **string** |  | [optional] [default to undefined]
**tag** | **string** |  | [optional] [default to undefined]
**soloTier** | [**Tier**](Tier.md) |  | [optional] [default to undefined]
**soloRank** | **number** |  | [optional] [default to undefined]
**soloWinrate** | **number** |  | [optional] [default to undefined]
**freeTier** | [**Tier**](Tier.md) |  | [optional] [default to undefined]
**freeRank** | **number** |  | [optional] [default to undefined]
**freeWinrate** | **number** |  | [optional] [default to undefined]
**updatedAt** | **string** |  | [optional] [default to undefined]
**championStatsRefreshedAt** | **string** |  | [optional] [default to undefined]
**mainP** | [**Position**](Position.md) |  | [optional] [default to undefined]
**subP** | [**Position**](Position.md) |  | [optional] [default to undefined]
**wantP** | [**Array&lt;Position&gt;**](Position.md) |  | [optional] [default to undefined]
**isAgree** | **boolean** |  | [optional] [default to undefined]
**isBlind** | **boolean** |  | [optional] [default to undefined]
**loginType** | [**LoginType**](LoginType.md) |  | [optional] [default to undefined]
**gameStyleResponseList** | [**Array&lt;GameStyleResponse&gt;**](GameStyleResponse.md) |  | [optional] [default to undefined]
**championStatsResponseList** | [**Array&lt;ChampionStatsResponse&gt;**](ChampionStatsResponse.md) |  | [optional] [default to undefined]
**memberRecentStats** | [**MemberRecentStatsResponse**](MemberRecentStatsResponse.md) |  | [optional] [default to undefined]
**canRefresh** | **boolean** |  | [optional] [default to undefined]

## Example

```typescript
import { MyProfileResponse } from './api';

const instance: MyProfileResponse = {
    id,
    profileImg,
    mike,
    email,
    gameName,
    tag,
    soloTier,
    soloRank,
    soloWinrate,
    freeTier,
    freeRank,
    freeWinrate,
    updatedAt,
    championStatsRefreshedAt,
    mainP,
    subP,
    wantP,
    isAgree,
    isBlind,
    loginType,
    gameStyleResponseList,
    championStatsResponseList,
    memberRecentStats,
    canRefresh,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
