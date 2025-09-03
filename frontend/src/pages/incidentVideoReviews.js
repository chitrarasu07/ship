import React, { useState, useEffect } from "react";
import { Alert, Ship, CameraData } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Maximize, 
  Download,
  ZoomIn,
  ArrowLeft,
  MapPin,
  Clock,
  Camera,
  Shield,
  User,
  FileText
} from "lucide-react";
import { format } from "date-fns";

export default function IncidentVideoReview() {
  const [alert, setAlert] = useState(null);
  const [ship, setShip] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(120); // Mock 2 minute video
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadIncidentData();
  }, []);

  const loadIncidentData = async () => {
    // Mock loading incident data - in real app, get from URL params
    try {
      const alertsData = await Alert.list("-created_date", 1);
      const shipsData = await Ship.list("-name", 1);
      
      if (alertsData.length > 0) {
        setAlert(alertsData[0]);
        setShip(shipsData[0]);
      }
    } catch (error) {
      console.error("Error loading incident data:", error);
    }
    setIsLoading(false);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSkip = (seconds) => {
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    setCurrentTime(newTime);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const timelineEvents = [
    { time: 15, type: "person_detected", thumbnail: "/api/placeholder/60/40" },
    { time: 45, type: "alert_triggered", thumbnail: "/api/placeholder/60/40" },
    { time: 78, type: "crew_response", thumbnail: "/api/placeholder/60/40" },
    { time: 95, type: "incident_resolved", thumbnail: "/api/placeholder/60/40" }
  ];

  const severityColors = {
    emergency: "bg-red-500 text-white border-red-600",
    critical: "bg-red-100 text-red-800 border-red-200",
    high: "bg-orange-100 text-orange-800 border-orange-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    low: "bg-gray-100 text-gray-800 border-gray-200"
  };

  const statusColors = {
    active: "bg-red-100 text-red-800 border-red-200",
    acknowledged: "bg-yellow-100 text-yellow-800 border-yellow-200",
    resolved: "bg-green-100 text-green-800 border-green-200"
  };

  if (isLoading || !alert || !ship) {
    return (
      <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 rounded w-1/3"></div>
            <div className="h-96 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Breadcrumb & Header */}
        <div className="space-y-4">
          <nav className="flex items-center gap-2 text-sm text-slate-500">
            <span>Dashboard</span>
            <span>/</span>
            <span>Recent Alerts</span>
            <span>/</span>
            <span className="text-slate-900 font-medium">Incident Video Review</span>
          </nav>
          
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-slate-900">{alert.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-slate-600">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{format(new Date(alert.created_date), "MMM d, HH:mm")}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{alert.location || "Deck 3"}</span>
              </div>
              <Badge variant="outline" className={`${severityColors[alert.severity]} border`}>
                {alert.severity}
              </Badge>
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                <span>AI Confidence: 94%</span>
              </div>
              <div className="flex items-center gap-1">
                <Camera className="w-4 h-4" />
                <span>Camera ID: CAM-003</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Video Section */}
          <div className="lg:col-span-3 space-y-6">
            {/* Video Player */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative bg-black aspect-video rounded-lg overflow-hidden">
                  {/* Mock Video Display */}
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                    <div className="text-white text-center">
                      <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-semibold">Security Camera Feed</p>
                      <p className="text-slate-400">{ship.name} - {alert.location}</p>
                    </div>
                  </div>
                  
                  {/* AI Detection Overlay */}
                  <div className="absolute top-4 left-4">
                    <div className="bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                      PERSON DETECTED
                    </div>
                  </div>
                  
                  {/* Detection Box */}
                  <div className="absolute top-1/3 left-1/3 w-24 h-32 border-2 border-red-500 bg-red-500 bg-opacity-20"></div>
                  
                  {/* Video Controls */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <div className="space-y-3">
                      {/* Progress Bar */}
                      <div className="relative">
                        <div className="h-1 bg-white/30 rounded-full">
                          <div 
                            className="h-1 bg-red-500 rounded-full transition-all duration-200"
                            style={{ width: `${(currentTime / duration) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      {/* Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-white hover:bg-white/20"
                            onClick={handlePlayPause}
                          >
                            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-white hover:bg-white/20"
                            onClick={() => handleSkip(-10)}
                          >
                            <SkipBack className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-white hover:bg-white/20"
                            onClick={() => handleSkip(10)}
                          >
                            <SkipForward className="w-4 h-4" />
                          </Button>
                          <span className="text-white text-sm">
                            {formatTime(currentTime)} / {formatTime(duration)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                            <Volume2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                            <ZoomIn className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                            <Maximize className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline of Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Timeline of Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <div className="h-2 bg-slate-200 rounded-full">
                      <div 
                        className="h-2 bg-blue-500 rounded-full transition-all duration-200"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4">
                    {timelineEvents.map((event, index) => (
                      <div key={index} className="text-center">
                        <div className="w-16 h-12 bg-slate-200 rounded-lg mx-auto mb-2 overflow-hidden">
                          <img 
                            src={`https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=60&h=40&fit=crop&crop=center`}
                            alt="Timeline thumbnail"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-xs text-slate-500">{formatTime(event.time)}</p>
                        <p className="text-xs font-medium capitalize">
                          {event.type.replace('_', ' ')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Incident Details Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Incident Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Deck Number</label>
                  <p className="text-slate-900">{alert.location || "Deck 3"}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-600">Camera Name/ID</label>
                  <p className="text-slate-900">Security Cam 003</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-600">Detection Type</label>
                  <p className="text-slate-900 capitalize">{alert.alert_type.replace('_', ' ')}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-600">Status</label>
                  <Badge variant="outline" className={`${statusColors[alert.status]} border mt-1`}>
                    {alert.status}
                  </Badge>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-600">Assigned Crew Member</label>
                  <p className="text-slate-900">Officer Johnson</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-600 block mb-2">Resolution Notes</label>
                  <Textarea
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    placeholder="Add notes about the incident resolution..."
                    rows={4}
                  />
                  <Button className="w-full mt-2" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    Save Notes
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Related Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Ship Name</span>
                  <span className="font-medium">{ship.name}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Alert Severity</span>
                  <Badge variant="outline" className={`${severityColors[alert.severity]} text-xs`}>
                    {alert.severity}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">AI Confidence</span>
                  <span className="font-medium">94.2%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Response Time</span>
                  <span className="font-medium text-green-600">2.1 mins</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}