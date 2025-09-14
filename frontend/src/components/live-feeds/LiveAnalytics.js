import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Zap, Wifi } from "lucide-react";

export default function LiveAnalytics() {
  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple-600" />
          Live Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
          <div>
            <p className="text-sm text-slate-600">Detections / Min</p>
            <p className="text-xl font-bold text-slate-900">12</p>
          </div>
          <Zap className="w-6 h-6 text-yellow-500" />
        </div>
        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
          <div>
            <p className="text-sm text-slate-600">Network Health</p>
            <p className="text-xl font-bold text-green-600">99.8%</p>
          </div>
          <Wifi className="w-6 h-6 text-green-500" />
        </div>
        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
          <div>
            <p className="text-sm text-slate-600">Active Use Cases</p>
            <p className="text-xl font-bold text-slate-900">4</p>
          </div>
          <Activity className="w-6 h-6 text-blue-500" />
        </div>
      </CardContent>
    </Card>
  );
}