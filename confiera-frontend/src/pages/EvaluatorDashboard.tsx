import { useState } from "react";
import { FileText, LogOut, GraduationCap, ExternalLink, Settings } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Slider } from "../components/ui/slider";
import { Badge } from "../components/ui/badge";

interface EvaluatorDashboardProps {
  onNavigate: (page: string) => void;
}

export function EvaluatorDashboard({ onNavigate }: EvaluatorDashboardProps) {
  const [selectedPaper, setSelectedPaper] = useState<string | null>(null);
  const [originality, setOriginality] = useState([7]);
  const [clarity, setClarity] = useState([8]);
  const [relevance, setRelevance] = useState([9]);
  const [comments, setComments] = useState("");

  const assignedPapers = [
    {
      id: "P001",
      title: "Deep Learning Approaches for Renewable Energy Forecasting",
      authors: "Dr. S. Perera, Prof. K. Silva",
      track: "AI & Machine Learning",
      fileLink: "#",
      status: "Pending Review",
    },
    {
      id: "P023",
      title: "IoT-Based Smart Grid Optimization",
      authors: "Dr. K. Fernando, Dr. A. Jayawardena",
      track: "Energy Systems",
      fileLink: "#",
      status: "Pending Review",
    },
    {
      id: "P045",
      title: "Quantum Computing for Energy Efficiency",
      authors: "Dr. Jane Smith, Prof. John Doe",
      track: "Quantum Computing",
      fileLink: "#",
      status: "Reviewed",
    },
  ];

  const handleSubmitEvaluation = () => {
    setSelectedPaper(null);
    setOriginality([7]);
    setClarity([8]);
    setRelevance([9]);
    setComments("");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-primary tracking-wide" style={{ fontWeight: 600 }}>
                Confiera
              </div>
              <div className="text-xs text-muted-foreground">Evaluator Panel</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <div className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-white">
                <FileText className="w-5 h-5" />
                <span>Assigned Papers</span>
              </div>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => onNavigate("home")}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {!selectedPaper ? (
            <>
              <h1 className="mb-2 text-primary">Assigned Papers</h1>
              <p className="text-muted-foreground mb-8">
                Review and evaluate assigned papers for SCSE 2025
              </p>

              <Card>
                <CardHeader>
                  <CardTitle>Papers for Review</CardTitle>
                  <CardDescription>
                    Click on a paper to view details and submit evaluation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Paper ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Author(s)</TableHead>
                        <TableHead>Track</TableHead>
                        <TableHead>File</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assignedPapers.map((paper) => (
                        <TableRow key={paper.id}>
                          <TableCell>{paper.id}</TableCell>
                          <TableCell className="max-w-xs">
                            {paper.title}
                          </TableCell>
                          <TableCell>{paper.authors}</TableCell>
                          <TableCell>{paper.track}</TableCell>
                          <TableCell>
                            <a
                              href={paper.fileLink}
                              className="inline-flex items-center gap-1 text-primary hover:text-accent transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                              View PDF
                            </a>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                paper.status === "Reviewed"
                                  ? "default"
                                  : "secondary"
                              }
                              className={
                                paper.status === "Reviewed"
                                  ? "bg-accent text-accent-foreground"
                                  : ""
                              }
                            >
                              {paper.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-primary text-primary hover:bg-primary hover:text-white"
                              onClick={() => setSelectedPaper(paper.id)}
                            >
                              {paper.status === "Reviewed"
                                ? "Edit Review"
                                : "Review"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                className="mb-6"
                onClick={() => setSelectedPaper(null)}
              >
                ← Back to Papers
              </Button>

              <h1 className="mb-2 text-primary">Evaluate Paper</h1>
              <p className="text-muted-foreground mb-8">
                Paper ID: {selectedPaper}
              </p>

              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Paper Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {assignedPapers
                        .filter((p) => p.id === selectedPaper)
                        .map((paper) => (
                          <div key={paper.id} className="space-y-3">
                            <div>
                              <p className="text-sm text-muted-foreground">Title</p>
                              <p>{paper.title}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Authors</p>
                              <p>{paper.authors}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Track</p>
                              <p>{paper.track}</p>
                            </div>
                            <div>
                              <a
                                href={paper.fileLink}
                                className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors"
                              >
                                <ExternalLink className="w-4 h-4" />
                                Download Full Paper (PDF)
                              </a>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Evaluation Criteria</CardTitle>
                    <CardDescription>
                      Rate each criterion on a scale of 1-10
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <Label>Originality</Label>
                        <span className="text-primary">{originality[0]}/10</span>
                      </div>
                      <Slider
                        value={originality}
                        onValueChange={setOriginality}
                        max={10}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground">
                        Assess the novelty and innovative aspects of the research
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <Label>Clarity</Label>
                        <span className="text-primary">{clarity[0]}/10</span>
                      </div>
                      <Slider
                        value={clarity}
                        onValueChange={setClarity}
                        max={10}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground">
                        Evaluate the presentation, structure, and writing quality
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <Label>Relevance</Label>
                        <span className="text-primary">{relevance[0]}/10</span>
                      </div>
                      <Slider
                        value={relevance}
                        onValueChange={setRelevance}
                        max={10}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground">
                        Rate the relevance to the conference theme and track
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Comments & Feedback</CardTitle>
                    <CardDescription>
                      Provide detailed feedback for the authors
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      placeholder="Enter your detailed comments, suggestions, and recommendations..."
                      rows={8}
                      className="w-full"
                    />
                  </CardContent>
                </Card>

                <Card className="bg-muted">
                  <CardHeader>
                    <CardTitle>Review Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Originality:</span>
                      <span>{originality[0]}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Clarity:</span>
                      <span>{clarity[0]}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Relevance:</span>
                      <span>{relevance[0]}/10</span>
                    </div>
                    <div className="border-t border-border pt-2 mt-2 flex justify-between">
                      <span>Average Score:</span>
                      <span className="text-primary">
                        {(
                          (originality[0] + clarity[0] + relevance[0]) /
                          3
                        ).toFixed(1)}
                        /10
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedPaper(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                    onClick={handleSubmitEvaluation}
                  >
                    Submit Evaluation
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
