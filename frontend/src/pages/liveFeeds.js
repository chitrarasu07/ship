import React, { useState, useEffect } from "react";
import CameraGrid from "../components/live-feeds/CameraGrid";
import LiveAnalytics from "../components/live-feeds/LiveAnalytics";
import LiveEventLog from "../components/live-feeds/LiveEventLog";
import { Video } from "lucide-react";

const dummyData = {
  ships: [
    { id: 1, name: "MV Ocean Star", status: "active" },
    { id: 2, name: "SS Horizon Wind", status: "active" },
    { id: 3, name: "CS Atlantic Voyager", status: "in_port" },
    { id: 5, name: "RV Discovery Quest", status: "active" },
  ],
  alerts: [
    { id: 1, severity: "high", title: "Unauthorized Access", location: "Bridge", ship_id: 5 },
    { id: 2, severity: "medium", title: "Cargo Shift Detected", location: "Cargo Hold 3", ship_id: 3 },
  ],
  events: [
    { id: 1, type: 'detection', message: 'Person detected', location: 'Starboard Deck', shipName: 'MV Ocean Star', timestamp: new Date(Date.now() - 10000) },
    { id: 2, type: 'status', message: 'Camera feed restored', location: 'Engine Room', shipName: 'SS Horizon Wind', timestamp: new Date(Date.now() - 35000) },
    { id: 3, type: 'detection', message: 'Anomaly detected', location: 'Cargo Hold 1', shipName: 'CS Atlantic Voyager', timestamp: new Date(Date.now() - 62000) },
    { id: 4, type: 'alert', message: 'High temperature alert', location: 'Engine Room', shipName: 'SS Horizon Wind', timestamp: new Date(Date.now() - 120000) },
    { id: 5, type: 'detection', message: 'Equipment check OK', location: 'Bridge', shipName: 'MV Ocean Star', timestamp: new Date(Date.now() - 180000) },
  ]
};

export default function LiveFeedsPage() {
  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="max-w-screen-2xl mx-auto space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <Video className="w-8 h-8 text-blue-600" />
              Live Camera Feeds
            </h1>
            <p className="text-slate-600 mt-1">Real-time visual monitoring across the fleet</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 bg-black-40">
          <div className="xl:col-span-6 space-y-6">
            <CameraGrid ships={dummyData.ships} alerts={dummyData.alerts} />
          </div>
        </div>
        <div className="space-y-6">
            <LiveAnalytics />
            <LiveEventLog events={dummyData.events} />
          </div>
      </div>
    </div>
  );
}