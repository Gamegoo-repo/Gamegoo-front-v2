# BoardByIdResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**boardId** | **number** |  | [default to undefined]
**memberId** | **number** |  | [optional] [default to undefined]
**createdAt** | **string** |  | [default to undefined]
**profileImage** | **number** |  | [default to undefined]
**gameName** | **string** |  | [default to undefined]
**tag** | **string** |  | [default to undefined]
**mannerLevel** | **number** |  | [default to undefined]
**soloTier** | [**Tier**](Tier.md) |  | [default to undefined]
**soloRank** | **number** |  | [default to undefined]
**freeTier** | [**Tier**](Tier.md) |  | [default to undefined]
**freeRank** | **number** |  | [default to undefined]
**mike** | [**Mike**](Mike.md) |  | [default to undefined]
**championStatsResponseList** | [**Array&lt;ChampionStatsResponse&gt;**](ChampionStatsResponse.md) |  | [default to undefined]
**memberRecentStats** | [**MemberRecentStatsResponse**](MemberRecentStatsResponse.md) |  | [optional] [default to undefined]
**gameMode** | [**GameMode**](GameMode.md) |  | [default to undefined]
**mainP** | [**Position**](Position.md) |  | [default to undefined]
**subP** | [**Position**](Position.md) |  | [default to undefined]
**wantP** | **Array&lt;string&gt;** |  | [default to undefined]
**recentGameCount** | **number** |  | [optional] [default to undefined]
**winRate** | **number** |  | [optional] [default to undefined]
**gameStyles** | **Array&lt;number&gt;** |  | [default to undefined]
**contents** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { BoardByIdResponse } from './api';

const instance: BoardByIdResponse = {
    boardId,
    memberId,
    createdAt,
    profileImage,
    gameName,
    tag,
    mannerLevel,
    soloTier,
    soloRank,
    freeTier,
    freeRank,
    mike,
    championStatsResponseList,
    memberRecentStats,
    gameMode,
    mainP,
    subP,
    wantP,
    recentGameCount,
    winRate,
    gameStyles,
    contents,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
