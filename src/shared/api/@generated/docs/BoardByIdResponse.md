# BoardByIdResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**boardId** | **number** |  | [optional] [default to undefined]
**memberId** | **number** |  | [optional] [default to undefined]
**createdAt** | **string** |  | [optional] [default to undefined]
**profileImage** | **number** |  | [optional] [default to undefined]
**gameName** | **string** |  | [optional] [default to undefined]
**tag** | **string** |  | [optional] [default to undefined]
**mannerLevel** | **number** |  | [optional] [default to undefined]
**soloTier** | [**Tier**](Tier.md) |  | [optional] [default to undefined]
**soloRank** | **number** |  | [optional] [default to undefined]
**freeTier** | [**Tier**](Tier.md) |  | [optional] [default to undefined]
**freeRank** | **number** |  | [optional] [default to undefined]
**mike** | [**Mike**](Mike.md) |  | [optional] [default to undefined]
**championStatsResponseList** | [**Array&lt;ChampionStatsResponse&gt;**](ChampionStatsResponse.md) |  | [optional] [default to undefined]
**memberRecentStats** | [**MemberRecentStatsResponse**](MemberRecentStatsResponse.md) |  | [optional] [default to undefined]
**gameMode** | [**GameMode**](GameMode.md) |  | [optional] [default to undefined]
**mainP** | [**Position**](Position.md) |  | [optional] [default to undefined]
**subP** | [**Position**](Position.md) |  | [optional] [default to undefined]
**wantP** | [**Array&lt;Position&gt;**](Position.md) |  | [optional] [default to undefined]
**recentGameCount** | **number** |  | [optional] [default to undefined]
**winRate** | **number** |  | [optional] [default to undefined]
**gameStyles** | **Array&lt;number&gt;** |  | [optional] [default to undefined]
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
