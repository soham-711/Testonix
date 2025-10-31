import { Calendar, Clock, BookOpen, Circle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface ExamCardProps {
  title: string;
  subject: string;
  date: string;
  time: string;
  status: "online" | "scheduled" | "completed";
}

const ExamCard = ({ title, subject, date, time, status }: ExamCardProps) => {
  const statusConfig = {
    online: { label: "Online", variant: "default" as const, color: "text-green-500" },
    scheduled: { label: "Scheduled", variant: "secondary" as const, color: "text-yellow-500" },
    completed: { label: "Completed", variant: "outline" as const, color: "text-gray-500" },
  };

  const currentStatus = statusConfig[status];

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-border bg-card">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <Circle className={`h-3 w-3 fill-current ${currentStatus.color}`} />
        </div>
        <Badge variant={currentStatus.variant} className="w-fit">
          {currentStatus.label}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BookOpen className="h-4 w-4" />
          <span>{subject}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{time}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          disabled={status === "completed"}
          variant={status === "online" ? "default" : "outline"}
        >
          {status === "online" ? "Enter Exam" : status === "scheduled" ? "View Details" : "View Results"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExamCard;
