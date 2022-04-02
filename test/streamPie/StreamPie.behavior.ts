import { shouldBehaveLikeCreateStream } from "./effects/createStream";

export function shouldBehaveLikeStreamPie(): void {
  describe("Effects", function () {
    describe("createStream", function () {
      shouldBehaveLikeCreateStream();
    });
  });
}
