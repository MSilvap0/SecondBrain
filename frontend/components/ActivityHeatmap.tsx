'use client';

interface ActivityHeatmapProps {
  data: Record<string, number>;
}

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  // Gerar últimas 12 semanas
  const weeks = 12;
  const days = 7;
  const today = new Date();
  
  const heatmapData: { date: Date; count: number }[][] = [];
  
  for (let week = weeks - 1; week >= 0; week--) {
    const weekData: { date: Date; count: number }[] = [];
    for (let day = 0; day < days; day++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (week * 7 + (6 - day)));
      const dateStr = date.toISOString().split('T')[0];
      weekData.push({
        date,
        count: data[dateStr] || 0
      });
    }
    heatmapData.push(weekData);
  }

  const maxCount = Math.max(...Object.values(data), 1);
  
  const getIntensity = (count: number) => {
    if (count === 0) return 'bg-neutral-100';
    const intensity = count / maxCount;
    if (intensity < 0.25) return 'bg-green-200';
    if (intensity < 0.5) return 'bg-green-400';
    if (intensity < 0.75) return 'bg-green-600';
    return 'bg-green-700';
  };

  const dayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="space-y-3">
      <div className="flex gap-1">
        <div className="w-8" />
        <div className="flex-1 grid grid-cols-12 gap-1">
          {heatmapData.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className={`group relative w-full aspect-square rounded-sm ${getIntensity(day.count)} transition-all duration-200 hover:ring-2 hover:ring-neutral-900 hover:scale-110 cursor-pointer`}
                  title={`${day.date.toLocaleDateString('pt-BR')}: ${day.count} ${day.count === 1 ? 'ideia' : 'ideias'}`}
                >
                  {day.count > 0 && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900 text-white text-xs font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap z-10">
                      {day.count} {day.count === 1 ? 'ideia' : 'ideias'}
                      <div className="text-[10px] text-neutral-300">
                        {day.date.toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs text-neutral-600">
        <span>Menos</span>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-neutral-100 rounded-sm" />
          <div className="w-3 h-3 bg-green-200 rounded-sm" />
          <div className="w-3 h-3 bg-green-400 rounded-sm" />
          <div className="w-3 h-3 bg-green-600 rounded-sm" />
          <div className="w-3 h-3 bg-green-700 rounded-sm" />
        </div>
        <span>Mais</span>
      </div>
    </div>
  );
}
