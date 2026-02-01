import { Spinner } from "@/components/ui/spinner";

export default function EmployerLoading() {
  return (
    <div className="flex h-[calc(100vh-108px)] items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}
