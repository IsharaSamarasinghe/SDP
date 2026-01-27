import { Calendar, MapPin, ExternalLink, FileText, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";

interface ConferenceCardProps {
  title: string;
  venue: string;
  dates: string;
  description: string;
  ieeeLink?: string;
  logo?: string;
  onViewDetails: () => void;
  onRegister: () => void;
  status?: "upcoming" | "ongoing" | "past";
  cmtLink?: string;
  paperTemplateLink?: string;
  guidelinesLink?: string;
}

export function ConferenceCard({
  title,
  venue,
  dates,
  description,
  ieeeLink,
  logo,
  onViewDetails,
  onRegister,
  status = "upcoming",
  cmtLink,
  paperTemplateLink,
  guidelinesLink,
}: ConferenceCardProps) {
  return (
    <Card className="h-full flex flex-col hover:shadow-2xl transition-all duration-300 border" style={{ background: '#FFFFFF', borderColor: '#E5E5E5' }}>
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="mb-2" style={{ color: '#4B0101' }}>{title}</h3>
            <Badge
              variant={status === "upcoming" ? "default" : "secondary"}
              className="text-sm"
              style={
                status === "upcoming"
                  ? { background: '#F5C518', color: '#000000', border: 'none' }
                  : { background: '#E5E5E5', color: '#737373', border: 'none' }
              }
            >
              {status}
            </Badge>
          </div>
          {logo && (
            <div className="w-16 h-16 rounded-lg border p-2 flex items-center justify-center" style={{ borderColor: '#E5E5E5', background: '#F5F5F5' }}>
              <span className="text-xs text-center" style={{ color: '#737373' }}>Logo</span>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm" style={{ color: '#737373' }}>
            <MapPin className="w-4 h-4" style={{ color: '#4B0101' }} />
            <span>{venue}</span>
          </div>
          <div className="flex items-center gap-2 text-sm" style={{ color: '#737373' }}>
            <Calendar className="w-4 h-4" style={{ color: '#4B0101' }} />
            <span>{dates}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm leading-relaxed" style={{ color: '#737373' }}>{description}</p>
        {ieeeLink && (
          <a
            href={ieeeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm mt-4 transition-colors hover:opacity-80"
            style={{ color: '#4B0101' }}
          >
            <ExternalLink className="w-4 h-4" />
            Past Publications
          </a>
        )}
        
        {/* Paper Submission Section */}
        {(cmtLink || paperTemplateLink || guidelinesLink) && (
          <div className="mt-6 pt-4 border-t" style={{ borderColor: '#E5E5E5' }}>
            <h4 className="mb-3 text-sm" style={{ color: '#4B0101' }}>Paper Submission</h4>
            <div className="flex flex-col gap-2">
              {paperTemplateLink && (
                <a
                  href={paperTemplateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-md transition-all hover:opacity-90"
                  style={{ 
                    background: '#F5C518',
                    color: '#000000',
                  }}
                >
                  <FileText className="w-4 h-4" />
                  IEEE Paper Template
                </a>
              )}
              {guidelinesLink && (
                <a
                  href={guidelinesLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-md transition-all hover:opacity-90"
                  style={{ 
                    background: '#F5C518',
                    color: '#000000',
                  }}
                >
                  <FileText className="w-4 h-4" />
                  Guidelines
                </a>
              )}
              {cmtLink && (
                <a
                  href={cmtLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-md transition-all hover:opacity-90"
                  style={{ 
                    background: '#F5C518',
                    color: '#000000',
                  }}
                >
                  <Upload className="w-4 h-4" />
                  Submit via CMT
                </a>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-3 pt-4 border-t" style={{ borderColor: '#E5E5E5' }}>
        <Button
          variant="outline"
          className="flex-1 transition-all hover:bg-gray-50"
          style={{ 
            borderColor: '#4B0101',
            background: 'transparent',
            color: '#4B0101'
          }}
          onClick={onViewDetails}
        >
          View Details
        </Button>
        <Button
          className="flex-1 transition-all shadow-md"
          style={{ 
            background: '#F5C518',
            color: '#000000'
          }}
          onClick={onRegister}
        >
          Register Now
        </Button>
      </CardFooter>
    </Card>
  );
}
