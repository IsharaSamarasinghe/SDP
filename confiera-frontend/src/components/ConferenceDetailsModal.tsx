import { Calendar, MapPin, Clock, Users, BookOpen, Presentation, Info } from "lucide-react";
import { Dialog, DialogContent } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

interface Workshop {
    id: number;
    title: string;
    description: string;
    instructor: string;
    fee: number;
    currency: string;
    starts_at: string;
    ends_at: string;
}

interface ConferenceDetails {
    id: number;
    title: string;
    venue: string;
    dates: string;
    description: string;
    deadline: string;
    category: string;
    tracks: string[];
    workshops: Workshop[];
}

interface ConferenceDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    conference: ConferenceDetails | null;
}

export function ConferenceDetailsModal({ isOpen, onClose, conference }: ConferenceDetailsModalProps) {
    if (!conference) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 border-none bg-white">
                <div className="relative">
                    {/* Header Section */}
                    <div className="p-8 pb-6" style={{ background: 'linear-gradient(135deg, #4B0101 0%, #660000 100%)' }}>
                        <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                                <Badge className="mb-3" style={{ background: '#F5C518', color: '#000000', border: 'none' }}>
                                    {conference.category}
                                </Badge>
                                <h2 className="text-2xl font-bold text-white mb-4 leading-tight">
                                    {conference.title}
                                </h2>
                                <div className="flex flex-wrap gap-4 text-white/80 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-[#F5C518]" />
                                        <span>{conference.dates}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-[#F5C518]" />
                                        <span>{conference.venue}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* Description */}
                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <Info className="w-5 h-5" style={{ color: '#4B0101' }} />
                                <h3 className="text-lg font-semibold" style={{ color: '#4B0101' }}>About the Conference</h3>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                                {conference.description}
                            </p>
                        </section>

                        <Separator />

                        {/* Tracks */}
                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <BookOpen className="w-5 h-5" style={{ color: '#4B0101' }} />
                                <h3 className="text-lg font-semibold" style={{ color: '#4B0101' }}>Research Tracks</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {conference.tracks.map((track, index) => (
                                    <Badge
                                        key={index}
                                        variant="secondary"
                                        className="px-3 py-1 text-sm font-medium"
                                        style={{ background: '#F5F5F5', color: '#4B0101', border: '1px solid #E5E5E5' }}
                                    >
                                        {track}
                                    </Badge>
                                ))}
                            </div>
                        </section>

                        <Separator />

                        {/* Workshops */}
                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <Presentation className="w-5 h-5" style={{ color: '#4B0101' }} />
                                <h3 className="text-lg font-semibold" style={{ color: '#4B0101' }}>Workshops</h3>
                            </div>
                            <div className="grid gap-4">
                                {conference.workshops.length > 0 ? (
                                    conference.workshops.map((workshop) => (
                                        <div
                                            key={workshop.id}
                                            className="p-4 rounded-lg border border-gray-100 flex flex-col gap-3 transition-all hover:shadow-md"
                                            style={{ background: '#FFFFFF' }}
                                        >
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-base" style={{ color: '#4B0101' }}>{workshop.title}</h4>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                                        <Users className="w-3 h-3" />
                                                        <span>Instructor: {workshop.instructor}</span>
                                                    </div>
                                                </div>
                                                <Badge style={{ background: '#FFF9E6', color: '#B25E09', border: '1px solid #FFE599' }}>
                                                    {workshop.currency} {workshop.fee.toLocaleString()}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {workshop.description}
                                            </p>
                                            <div className="flex flex-wrap gap-3 text-xs font-medium pt-1" style={{ color: '#737373' }}>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{new Date(workshop.starts_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(workshop.ends_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>{new Date(workshop.starts_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">No workshops scheduled yet.</p>
                                )}
                            </div>
                        </section>

                        {/* Important Dates */}
                        <div className="p-6 rounded-xl border-2 border-dashed flex flex-col items-center text-center gap-2" style={{ borderColor: '#F5C518', background: '#FFFDF5' }}>
                            <h4 className="font-bold text-sm uppercase tracking-wider" style={{ color: '#4B0101' }}>Submission Deadline</h4>
                            <div className="text-2xl font-black" style={{ color: '#4B0101' }}>{conference.deadline}</div>
                            <p className="text-xs text-muted-foreground">Notification of acceptance: 4 weeks after submission</p>
                        </div>
                    </div>

                    {/* Sticky Footer */}
                    <div className="sticky bottom-0 bg-white p-6 border-t flex justify-end gap-3 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                        <Button variant="outline" onClick={onClose} style={{ borderColor: '#4B0101', color: '#4B0101' }}>
                            Close
                        </Button>
                        <Button className="px-8" style={{ background: '#F5C518', color: '#000000' }}>
                            Register Now
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
