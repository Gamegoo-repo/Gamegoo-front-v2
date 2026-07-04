interface StrengthWeaknessItemProps {
  title: '강점' | '약점';
  description: string;
}

function StrengthWeaknessItem({ title, description }: StrengthWeaknessItemProps) {
  return (
    <div className="flex w-full flex-col items-center gap-0.5 rounded-xl border border-white/10 bg-white/5 p-4">
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className="text-center text-sm break-keep text-[#CCC]">{description}</p>
    </div>
  );
}

interface LolBtiStrengthWeaknessProps {
  strength: string;
  weakness: string;
}

export default function LolBtiStrengthWeakness({
  strength,
  weakness,
}: LolBtiStrengthWeaknessProps) {
  return (
    <div className="flex w-full flex-col gap-3">
      <StrengthWeaknessItem title="강점" description={strength} />
      <StrengthWeaknessItem title="약점" description={weakness} />
    </div>
  );
}
