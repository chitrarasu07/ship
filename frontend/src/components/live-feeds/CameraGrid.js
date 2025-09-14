import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Video, Maximize, WifiOff, Ship, AlertTriangle, Fingerprint, Thermometer, ShieldCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const cameraLocations = ["Bridge", "Engine Room", "Port Deck", "Starboard Deck", "Cargo Hold 1", "Galley"];

const CameraFeedCard = ({ shipName, location, alerts }) => {
  const [isError, setIsError] = useState(false);
  const streamUrl = "https://www.youtube.com/watch?v=keJ4iww8Lo0"; // Placeholder GIF

  const cameraAlerts = alerts.filter(a => a.location === location);

  return (
    <Dialog>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-white">
        <CardHeader className="p-3 bg-slate-50 border-b">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            <span className="truncate">{shipName} - {location}</span>
            {cameraAlerts.length > 0 ? (
               <Badge variant="destructive" className="flex items-center gap-1">
                 <AlertTriangle className="w-3 h-3" /> {cameraAlerts.length} Alert(s)
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-green-100 text-green-800">Live</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 relative">
          {isError ? (
            <div className="aspect-video bg-slate-200 flex flex-col items-center justify-center text-slate-500">
              <WifiOff className="w-8 h-8 mb-2" />
              <p className="text-sm font-medium">Stream Unavailable</p>
            </div>
          ) : (
            <img 
              src={streamUrl} 
              alt={`Live feed from ${location}`}
              className="w-full h-full object-cover aspect-video"
              onError={() => setIsError(true)}
            />
          )}
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="absolute bottom-2 right-2 bg-black/30 hover:bg-black/50 text-white">
              <Maximize className="w-4 h-4" />
            </Button>
          </DialogTrigger>
        </CardContent>
      </Card>
      <DialogContent className="max-w-6xl p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Live Feed: {shipName} - {location}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
            <div className="lg:col-span-2 p-4 bg-black">
             {isError ? (
                 <div className="aspect-video bg-slate-800 flex flex-col items-center justify-center text-slate-400">
                  <WifiOff className="w-12 h-12 mb-2" />
                  <p className="text-lg font-medium">Stream Unavailable</p>
                </div>
              ) : (
                <img 
                  src={streamUrl} 
                  alt={`Live feed from ${location}`}
                  className="w-full h-full object-contain aspect-video"
                  onError={() => setIsError(true)}
                />
              )}
            </div>
            <div className="p-4 space-y-4 border-l bg-slate-50">
                <h3 className="font-semibold text-lg">Camera Details</h3>
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm"><Fingerprint className="w-4 h-4 text-slate-500" /><strong>ID:</strong> CAM-0{Math.floor(Math.random()*100)}</div>
                    <div className="flex items-center gap-2 text-sm"><ShieldCheck className="w-4 h-4 text-slate-500" /><strong>Status:</strong> <span className="text-green-600 font-semibold">Online</span></div>
                    <div className="flex items-center gap-2 text-sm"><Thermometer className="w-4 h-4 text-slate-500" /><strong>Temp:</strong> 34°C</div>
                </div>
                <h3 className="font-semibold text-lg border-t pt-4">Recent Alerts</h3>
                {cameraAlerts.length > 0 ? (
                  <div className="space-y-2">
                    {cameraAlerts.map(alert => (
                        <div key={alert.id} className="p-2 bg-red-50 border-l-4 border-red-500 rounded">
                            <p className="font-bold text-red-700 text-sm">{alert.title}</p>
                            <p className="text-xs text-slate-600">{alert.severity}</p>
                        </div>
                    ))}
                  </div>
                ) : <p className="text-sm text-slate-500">No recent alerts for this camera.</p>}
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};


export default function CameraGrid({ ships, alerts }) {
  return (
    <Card className="bg-white">
      {/* <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="w-5 h-5 text-blue-600" />
          Fleet Camera Grid
        </CardTitle>
      </CardHeader> */}
      <CardContent>
        <div className="space-y-6">
          {ships.filter(ship => ship.status === 'active' || ship.status === 'in_port').map(ship => (
            <div key={ship.id}>
              <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Ship className="w-4 h-4" /> {ship.name}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {cameraLocations.slice(0, 4).map(location => (
                  <CameraFeedCard key={`${ship.id}-${location}`} shipName={ship.name} location={location} alerts={alerts.filter(a => a.ship_id === ship.id)}/>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}