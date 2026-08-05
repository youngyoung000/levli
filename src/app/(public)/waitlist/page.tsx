import type { Metadata } from "next";
import { Suspense } from "react";
import { WaitlistExperience } from "./waitlist-experience";

export const metadata: Metadata = {
  title: "Join the Waitlist | Levli",
  description:
    "Save your spot for the Levli simulated crypto prop challenge. Invite friends, earn Levli Points, and move up the early access order.",
};

export default function WaitlistPage(): React.JSX.Element {
  /* useSearchParams(?ref=CODE)를 쓰는 클라이언트 트리는 Suspense 경계가 필요 */
  return (
    <Suspense fallback={null}>
      <WaitlistExperience />
    </Suspense>
  );
}
