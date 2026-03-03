type PlayerCardProps = {
  title: string | null;
  name: string;
  rating: number | null;
  time: number;
  position: "top" | "bottom";
  formatTime: (seconds: number) => string;
};

export default function PlayerCard({
  title,
  name,
  rating,
  time,
  position,
  formatTime,
}: PlayerCardProps) {
  return (
    <div
      className={`bg-gray-200 dark:bg-zinc-800
                  rounded-lg p-3 transition-colors
                  ${position === "top" ? "mb-2" : "mt-3"}`}
    >
      <div className="flex justify-between items-center">
        <div className="text-sm font-semibold">
          {title && (
            <span className="text-amber-500 dark:text-amber-400 mr-1">
              {title}
            </span>
          )}
          {name}
          {rating && (
            <span className="text-gray-600 dark:text-zinc-400 ml-1">
              ({rating})
            </span>
          )}
        </div>

        <div className="font-semibold tracking-wide text-lg">
          {formatTime(time)}
        </div>
      </div>
    </div>
  );
}
