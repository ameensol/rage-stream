# StreamPie & RageStream

## Why StreamPie?

The StreamPie contract was designed to solve a MetaCartel Ventures DAO HR issue: Distributing vested tokens streaming via [Sablier](https://github.com/sablierhq/sablier) to DAO members is annoying and cumbersome. As the MCV DAO is the recipient on the Sablier stream, everytime MCV members wish to claim some of the newly vested tokens from the stream, they must constantly request that the DAO claim the tokens from the stream and distribute to the members. This has a great deal of coordination overhead.

Instead, the StreamPie is a tokenized Sablier stream that allows token holders to *ragestream* their share of the tokens to fork off their own pro-rata Sablier stream. So if you have 10% of the tokens for a StreamPie, you can call the `rageStream` function to fork off 10% of the remaining vesting tokens into your own sablier stream, which you can then periodically claim vested tokens from yourself without needing anyone's permission.

## Usage

### StreamPie Deployment

1. The deployer creates the StreamPie with the address of the `owner` as well the address of an existing deployed Sablier contract instance. 1M tokens representing the shares of the StreamPie are minted to the deployer.

2. The deployer approves the tokens they want to deposit to the StreamPie contract.

3. The deployer calls `createStreamPie` with the recipient address, deposit amount, token address, start time, and end time. 

### RageStream Notes

- users can specify a new recipient address to ragestream to, and then claim vested tokens periodically from that address
- the ragestream function will cancel the original streampie sablier stream and create two new sablier streams, one fork for the ragestream, and another for the remaining members of the StreamPie
- the sender/startTime/endTime for both new streams will be the same as in the original StreamPie
- if the startTime has passed (the stream is actively vesting), the new startTime will be the current block timestamp
- SteamPie tokens redeemed to ragestream are burned irreversibly, future ragestreams will account for the change in total supply
- if 100% of the StreamPie tokens are burned via ragestream (and thus the deposit value for the updated StreamPie would be 0), the ragestream skips creating a new StreamPie sablier stream for the remaining members of the StreamPie (as there are none)

### Owner Privileges

- cancelSteamPie: prematurely terminates the vesting contract, transferring all vested tokens to the recipient and remaining funds to the owner
- cancelForkStream: prematurely terminates a fork stream, transferring all vested tokens to the recipient and remaining funds to the owner

### Gotchas

If someone calls ragestream after vesting has already started, they don't receive their pro-rata share of the already vested tokens, they only receive their pro-rata share of the remaining token deposit. So if someone calls ragestream with 10% of the StreamPie tokens, but they do so after 50% of the reward tokens have already vested, their fork stream will receive 10% of the remaining 50% (5% of the total) which will continue vesting at the same rate. The already vested tokens will be transferred to the original recipient of the StreamPie. 

The Sablier contract is unfriendly to tokens that have few decimals. To avoid losing money as dust, please only use Sablier & StreamPie to stream tokens with at least 9 decimals. For this reason we also hardcoded the StreamPie tokens to have a total supply of 1M tokens, which allows reasonable granularity for ragestreams.

If the recipient cancels the Sablier stream directly using the Sablier contract, the remaining unvested tokens will be transferred to the StreamPie contract. Anyone can call `withdrawTokens` at that point to withdraw the balance of the StreamPie contract to the owner.

Each StreamPie contract can be used for exactly one tokenized sablier stream (the `createStreamPie` function can only be called once). 

In theory you could ragestream a StreamPie into another StreamPie... but I didn't need that for my use case and am leaving it up you, anon.

### Dev Notes

Rage stream functionality added to [Sablier](https://github.com/sablierhq/sablier).

This repo has been initialized with @paulrberg's [solidity-template](https://github.com/paulrberg/solidity-template). Refer to the README there for instructions on building, compiling and testing.

Big thanks to @paulrberg for looking over the StreamPie contract and helping update the dev environment! 
And for building Sablier, the money lego that this builds on!

### License

steal this code


