import { shouldBehaveLikeConstructor } from "./effects/constructor";
import { shouldBehaveLikeCreateStreamPie } from "./effects/createStreamPie";
import { shouldBehaveLikeCancelStreamPie } from "./effects/cancelStreamPie";
import { shouldBehaveLikeCancelForkStream } from "./effects/cancelForkStream";
import { shouldBehaveLikeWithdrawTokens } from "./effects/withdrawTokens";
import { shouldBehaveLikeRageStream } from "./effects/rageStream";

export function shouldBehaveLikeStreamPie(): void {
  describe("Effects", function () {
    describe("constructor", function () {
      shouldBehaveLikeConstructor();
    });

    describe("createStreamPie", function () {
      shouldBehaveLikeCreateStreamPie();
    });

    describe("cancelStreamPie", function () {
      shouldBehaveLikeCancelStreamPie();
    });

    describe("cancelForkStream", function () {
      shouldBehaveLikeCancelForkStream();
    });

    describe("withdrawTokens", function () {
      shouldBehaveLikeWithdrawTokens();
    });

    describe("rageStream", function () {
      shouldBehaveLikeRageStream();
    });
  });
}
