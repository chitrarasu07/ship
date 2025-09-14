import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { List } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function LiveEventLog({ events }) {
  const eventTypeColors = {
    detection: "bg-blue-100 text-blue-800",
    status: "bg-gray-100 text-gray-800",
    alert: "bg-red-100 text-red-800",
  };
  
  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <List className="w-5 h-5 text-blue-600" />
          Live Event Log
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 h-96 overflow-y-auto">
          {events.map((event) => (
            <div key={event.id} className="flex items-start gap-3 text-sm">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                   <Badge variant="outline" className={`${eventTypeColors[event.type]}`}>{event.type}</Badge>
                   <p className="font-medium text-slate-800">{event.message}</p>
                </div>
                <p className="text-xs text-slate-500 mt-1">{event.shipName} - {event.location}</p>
              </div>
              <p className="text-xs text-slate-400 whitespace-nowrap">
                {formatDistanceToNow(event.timestamp, { addSuffix: true })}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}