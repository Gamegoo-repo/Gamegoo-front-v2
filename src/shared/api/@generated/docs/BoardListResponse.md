# BoardListResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**boardId** | **number** |  | [default to undefined]
**memberId** | **number** |  | [default to undefined]
**gameName** | **string** |  | [default to undefined]
**tag** | **string** |  | [default to undefined]
**mainP** | [**Position**](Position.md) |  | [default to undefined]
**subP** | [**Position**](Position.md) |  | [default to undefined]
**wantP** | **Array&lt;string&gt;** |  | [default to undefined]
**mike** | [**Mike**](Mike.md) |  | [default to undefined]
**contents** | **string** |  | [optional] [default to undefined]
**createdAt** | **string** |  | [default to undefined]
**profileImage** | **number** |  | [default to undefined]
**mannerLevel** | **number** |  | [default to undefined]
**tier** | [**Tier**](Tier.md) |  | [default to undefined]
**rank** | **number** |  | [default to undefined]
**gameMode** | [**GameMode**](GameMode.md) |  | [default to undefined]
**winRate** | **number** |  | [optional] [default to undefined]
**bumpTime** | **string** |  | [optional] [default to undefined]
**championStatsResponseList** | [**Array&lt;ChampionStatsResponse&gt;**](ChampionStatsResponse.md) |  | [default to undefined]
**memberRecentStats** | [**MemberRecentStatsResponse**](MemberRecentStatsResponse.md) |  | [optional] [default to undefined]
**freeTier** | [**Tier**](Tier.md) |  | [default to undefined]
**freeRank** | **number** |  | [default to undefined]
**soloTier** | [**Tier**](Tier.md) |  | [default to undefined]
**soloRank** | **number** |  | [default to undefined]

## Example

```typescript
import { BoardListResponse } from './api';

const instance: BoardListResponse = {
    boardId,
    memberId,
    gameName,
    tag,
    mainP,
    subP,
    wantP,
    mike,
    contents,
    createdAt,
    profileImage,
    mannerLevel,
    tier,
    rank,
    gameMode,
    winRate,
    bumpTime,
    championStatsResponseList,
    memberRecentStats,
    freeTier,
    freeRank,
    soloTier,
    soloRank,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
