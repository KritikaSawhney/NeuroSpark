
import React from "react";
import { StudySession } from "@/types/types";
import { format, eachDayOfInterval, subDays, addDays, isEqual } from "date-fns";

interface StudyHeatmapProps {
  studyHistory: StudySession[];
}

export const StudyHeatmap: React.FC<StudyHeatmapProps> = ({ studyHistory }) => {
  // Generate dates for the past 12 weeks
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startDate = subDays(today, 83); // 12 weeks = 84 days
  
  const dates = eachDayOfInterval({
    start: startDate,
    end: today
  });
  
  // Group study sessions by date
  const sessionsByDate: Record<string, number> = {};
  
  studyHistory.forEach((session) => {
    const date = new Date(session.startTime);
    date.setHours(0, 0, 0, 0);
    const dateKey = date.getTime().toString();
    
    if (!sessionsByDate[dateKey]) {
      sessionsByDate[dateKey] = 0;
    }
    
    sessionsByDate[dateKey] += session.cardsReviewed;
  });
  
  // Calculate intensity for cell colors
  const getIntensity = (count: number) => {
    if (count === 0) return 0;
    if (count < 5) return 1;
    if (count < 10) return 2;
    if (count < 20) return 3;
    return 4;
  };
  
  const weeks = [];
  let week = [];
  
  // Get day of week (0 = Sunday, 6 = Saturday)
  const getDayOfWeek = (date: Date) => {
    const day = date.getDay();
    return day === 0 ? 6 : day - 1; // Convert to Monday = 0, Sunday = 6
  };
  
  // Create empty cells for the first row
  const firstDayOfWeek = getDayOfWeek(dates[0]);
  if (firstDayOfWeek > 0) {
    for (let i = 0; i < firstDayOfWeek; i++) {
      week.push(null);
    }
  }
  
  // Fill in the dates
  dates.forEach((date) => {
    const dateKey = date.getTime().toString();
    const count = sessionsByDate[dateKey] || 0;
    const intensity = getIntensity(count);
    
    week.push({
      date,
      count,
      intensity,
    });
    
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  });
  
  // Add remaining dates to the last week
  if (week.length > 0) {
    weeks.push(week);
  }
  
  // Get color based on intensity
  const getColor = (intensity: number) => {
    switch (intensity) {
      case 0: return "bg-muted/30 dark:bg-muted/10";
      case 1: return "bg-neuro-purple/20";
      case 2: return "bg-neuro-purple/40";
      case 3: return "bg-neuro-purple/70";
      case 4: return "bg-neuro-purple";
      default: return "bg-muted/30 dark:bg-muted/10";
    }
  };
  
  const isToday = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return isEqual(date, today);
  };
  
  return (
    <div className="py-4">
      <div className="flex text-xs text-muted-foreground mb-2">
        <div className="w-8"></div>
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
          <div key={day} className="flex-1 text-center">{day}</div>
        ))}
      </div>
      
      <div className="space-y-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex h-6">
            <div className="w-8 text-xs text-muted-foreground flex items-center justify-end pr-2">
              {weekIndex % 2 === 0 && format(week[0]?.date || addDays(startDate, weekIndex * 7), "MMM")}
            </div>
            {week.map((day, dayIndex) => 
              day === null ? (
                <div key={`empty-${dayIndex}`} className="flex-1"></div>
              ) : (
                <div key={`${weekIndex}-${dayIndex}`} className="flex-1 px-0.5">
                  <div 
                    className={`h-full w-full rounded-sm ${getColor(day.intensity)} ${
                      isToday(day.date) ? "ring-2 ring-neuro-purple ring-offset-2 dark:ring-offset-background" : ""
                    }`}
                    title={`${format(day.date, "MMM d, yyyy")}: ${day.count} cards reviewed`}
                  ></div>
                </div>
              )
            )}
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-end mt-4 text-xs text-muted-foreground">
        <span className="mr-2">Less</span>
        <div className="flex space-x-1">
          <div className={`w-3 h-3 rounded-sm ${getColor(0)}`}></div>
          <div className={`w-3 h-3 rounded-sm ${getColor(1)}`}></div>
          <div className={`w-3 h-3 rounded-sm ${getColor(2)}`}></div>
          <div className={`w-3 h-3 rounded-sm ${getColor(3)}`}></div>
          <div className={`w-3 h-3 rounded-sm ${getColor(4)}`}></div>
        </div>
        <span className="ml-2">More</span>
      </div>
    </div>
  );
};
