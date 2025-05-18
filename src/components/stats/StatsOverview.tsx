
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserStats } from "@/types/types";
import { Activity, Award, Calendar, Clock } from "lucide-react";
import { StatsChart } from "./StatsChart";
import { formatDistanceToNow } from "date-fns";
import { StudyHeatmap } from "./StudyHeatmap";

interface StatsOverviewProps {
  stats: UserStats;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  const { streakDays, totalReviews, lastReviewDate, studyHistory } = stats;
  
  // Calculate study stats for the past 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    return date.getTime();
  }).reverse();
  
  const last7DaysData = last7Days.map(day => {
    const dayCount = studyHistory
      .filter(session => {
        const sessionDate = new Date(session.startTime);
        sessionDate.setHours(0, 0, 0, 0);
        return sessionDate.getTime() === day;
      })
      .reduce((acc, session) => acc + session.cardsReviewed, 0);
      
    return {
      date: new Date(day),
      count: dayCount,
    };
  });
  
  // Calculate deck performance
  const deckPerformance = studyHistory.reduce((acc, session) => {
    if (!acc[session.deckId]) {
      acc[session.deckId] = {
        cardsReviewed: 0,
        cardsCorrect: 0,
      };
    }
    acc[session.deckId].cardsReviewed += session.cardsReviewed;
    acc[session.deckId].cardsCorrect += session.cardsCorrect;
    return acc;
  }, {} as { [key: string]: { cardsReviewed: number; cardsCorrect: number } });
  
  const deckPerformanceData = Object.entries(deckPerformance).map(([deckId, data]) => {
    return {
      name: `Deck ${deckId.slice(-3)}`,
      value: data.cardsCorrect / data.cardsReviewed * 100 || 0,
    };
  });
  
  // Calculate average time per study session
  const averageSessionTime = studyHistory.reduce((acc, session) => {
    if (!session.endTime) return acc;
    return acc + (session.endTime - session.startTime);
  }, 0) / Math.max(1, studyHistory.length);
  
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${minutes}m ${seconds}s`;
  };
  
  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <Award className="h-8 w-8 text-neuro-purple mr-4" />
            <div>
              <div className="text-2xl font-bold">{streakDays} {streakDays === 1 ? 'day' : 'days'}</div>
              <p className="text-xs text-muted-foreground">
                {lastReviewDate ? `Last review ${formatDistanceToNow(lastReviewDate, { addSuffix: true })}` : "Start your streak today!"}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Reviews
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <Activity className="h-8 w-8 text-neuro-purple mr-4" />
            <div>
              <div className="text-2xl font-bold">{totalReviews}</div>
              <p className="text-xs text-muted-foreground">
                {studyHistory.length} study sessions
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Time per Session
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <Clock className="h-8 w-8 text-neuro-purple mr-4" />
            <div>
              <div className="text-2xl font-bold">{formatTime(averageSessionTime)}</div>
              <p className="text-xs text-muted-foreground">
                {(totalReviews / Math.max(1, studyHistory.length)).toFixed(1)} cards per session
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Decks
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <Calendar className="h-8 w-8 text-neuro-purple mr-4" />
            <div>
              <div className="text-2xl font-bold">
                {Object.keys(deckPerformance).length}
              </div>
              <p className="text-xs text-muted-foreground">
                {studyHistory.length > 0 
                  ? `Last session ${formatDistanceToNow(Math.max(...studyHistory.map(s => s.startTime)), { addSuffix: true })}` 
                  : "Start studying now!"
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
            <CardDescription>Cards reviewed over the past 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <StatsChart 
              type="bar" 
              data={last7DaysData} 
              xKey="date" 
              yKey="count" 
              height={300}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Deck Performance</CardTitle>
            <CardDescription>Accuracy percentage by deck</CardDescription>
          </CardHeader>
          <CardContent>
            <StatsChart 
              type="pie" 
              data={deckPerformanceData} 
              xKey="name" 
              yKey="value" 
              height={300} 
            />
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Study Heatmap</CardTitle>
          <CardDescription>Your studying activity over time</CardDescription>
        </CardHeader>
        <CardContent>
          <StudyHeatmap studyHistory={studyHistory} />
        </CardContent>
      </Card>
    </div>
  );
};
