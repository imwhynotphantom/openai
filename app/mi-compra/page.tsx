import { Suspense } from "react";
import MyPurchaseFlow from "@/components/purchase/MyPurchaseFlow";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <MyPurchaseFlow />
    </Suspense>
  );
}
