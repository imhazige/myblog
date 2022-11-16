---
published: false
layout: post
comments: true
date: "2022-11-12 00:00 +08:00"
type: post
title: "How to implement a fake ranking"
categories:
  - nodejs
tags:
  - algrithm
---
I had did a game that need to make some fake player to play with only one human player.

And there was an interesting problem, those players need to do ranking after each round, the change of the ranking of each player should be seemed to be real, which mean one player should not go from ranking first to ranking last with one round, something like that.

## Implementation
What I do is, create a random index as the target index that a fake player will be in next round, the change will be within the maxminum change given. Change will be either positive or negative, this will also decide by random.

Iterate over the player list, create a target ranking index, check the fake player at the target index, if it have been marked as mocked ranking, skip, if not, swap the position, mark both as mocked ranking.

## Code
```javascript
import _ from "lodash";

/**
 *
 * @param players - object with field _id and fake(if true it can be randomly ranking)
 * @param rankingPrevious previous ranking result
 * @param realPlayerIndex the realplayer's target ranking index after fake ranking
 * @param maxChange the random change of the ranking will be within this value
 * @returns array of {playerId, index}
 */
export const makeRanking = ({
  players,
  rankingPrevious,
  realPlayerIndex,
  maxChange = 2,
}) => {
  const ids = [];
  let realPlayer = null;
  players.map((p) => {
    if (p.fake) {
      ids.push({ playerId: p._id });
    } else {
      realPlayer = p;
    }
  });
  let ranking = null;
  if (rankingPrevious) {
    ranking = randomShuffle({
      preRanking: rankingPrevious,
      maxChange,
      realPlayerId: realPlayer._id,
      realPlayerIndex,
    });
  } else {
    ranking = _.shuffle(ids);
    //player's ranking
    ranking.splice(realPlayerIndex, 0, { playerId: realPlayer._id });
  }

  ranking.map((r, index) => (r.index = index));
  return ranking;
};

const randomShuffle = ({
  preRanking,
  maxChange,
  realPlayerId,
  realPlayerIndex,
}) => {
  //shuffle 1, make sure the real player ranking
  const shuffle1 = [];
  preRanking.map((r) => {
    if (r.playerId == realPlayerId) {
      return;
    }
    //clone
    const cl = _.cloneDeep(r);
    shuffle1.push(cl);
  });
  shuffle1.splice(realPlayerIndex, 0, { playerId: realPlayerId });
  shuffle1.map((r, index) => (r.index = index));

  //shuffle 2, only switch
  const shuffle2 = shuffle1.map((r, index) => null);
  shuffle2[realPlayerIndex] = { playerId: realPlayerId };
  const ranked = { [realPlayerId]: true };
  shuffle1.map((r, index) => {
    const { playerId } = r;

    // : scope
    const rindex = randomChangeIndex(index, maxChange, shuffle1.length - 1);

    if (ranked[playerId]) {
      return;
    }
    const targetSwitch = shuffle1[rindex];
    const targetSwitchPlayerId = targetSwitch.playerId;
    if (ranked[targetSwitchPlayerId]) {
      //switch target have shuffled
      ranked[playerId] = true;
      shuffle2[index] = r;
      return;
    }
    ranked[playerId] = true;
    ranked[targetSwitchPlayerId] = true;
    shuffle2[rindex] = r;
    shuffle2[index] = targetSwitch;
  });

  return shuffle2;
};

const randomChangeIndex = (index, maxChange, maxIndex) => {
  for (let i = 0; i < 10; i++) {
    const up = _.random(1) > 0 ? true : false;
    const rindex = index + _.random(maxChange) * (up ? -1 : 1);
    if (rindex >= 0 && rindex <= maxIndex) {
      if (rindex != index) {
        return rindex;
      }
    }
  }
  //no chnage
  return index;
};
```


