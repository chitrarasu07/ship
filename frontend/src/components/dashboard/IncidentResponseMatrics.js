import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, AlertTriangle, Shield, TrendingUp } from "lucide-react";

export default function IncidentResponseMetrics({ metrics }) {


  const { avgResponseTime, resolutionRate, preventionRate } = metrics;

  const metricData = [
    {
      title: "Average Response Time",
      value: avgResponseTime.value,
      subtitle: "Time from alert to intervention",
      trend: avgResponseTime.trend,
      trendText: avgResponseTime.change,
      icon: Clock,
      color: "blue"
    },
    {
      title: "Resolved vs Pending Alerts",
      value: `${resolutionRate.value} Resolved`,
      subtitle: `${resolutionRate.resolved} resolved / ${resolutionRate.pending} pending`,
      progress: parseFloat(resolutionRate.value),
      icon: AlertTriangle,
      color: "green"
    },
    {
      title: "Incident Prevention Rate",
      value: `${preventionRate.value} Prevented`,
      subtitle: "Potential incidents avoided",
      trend: "up",
      trendText: preventionRate.change,
      icon: Shield,
      color: "purple"
    }
  ];

  const iconColors = {
    blue: "text-blue-600",
    green: "text-green-600",
    purple: "text-purple-600"
  };

  return (
    <Card className="bg-white shadow-sm border border-slate-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Incident Response Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {metricData.map((metric, index) => (
          <div
            key={metric.title}
            className={`${index !== metricData.length - 1 ? "pb-6 border-b border-slate-100" : ""}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-slate-50`}>
                  <metric.icon className={`w-4 h-4 ${iconColors[metric.color]}`} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">{metric.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">{metric.subtitle}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-slate-900">{metric.value}</div>
                {metric.trend !== undefined && (
                  <div className="flex items-center justify-end gap-1 text-xs text-green-600 font-medium">
                    <TrendingUp className="w-3 h-3" />
                    <span>{metric.trendText}</span>
                  </div>
                )}
              </div>
            </div>

            {metric.progress !== undefined && (
              <div className="mt-2 space-y-2">
                <Progress value={metric.progress} className="h-2" />
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
