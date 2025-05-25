"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { Trash2, Search, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ContactFormSubmission {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  isDuplicate?: boolean;
}

export default function ContactFormManager() {
  const [submissions, setSubmissions] = useState<ContactFormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDuplicates, setShowDuplicates] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactFormSubmission | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/contact/submissions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch submissions");
      }

      const data = await response.json();
      setSubmissions(data.submissions);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch contact form submissions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/contact/submissions/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete submission");
      }

      setSubmissions(submissions.filter((sub) => sub._id !== id));
      toast({
        title: "Success",
        description: "Submission deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete submission",
        variant: "destructive",
      });
    }
  };

  const findDuplicates = () => {
    const phoneMap = new Map<string, ContactFormSubmission[]>();
    
    submissions.forEach((submission) => {
      const phone = submission.phone.trim();
      if (!phoneMap.has(phone)) {
        phoneMap.set(phone, []);
      }
      phoneMap.get(phone)?.push(submission);
    });

    const duplicates = submissions.map((submission) => ({
      ...submission,
      isDuplicate: (phoneMap.get(submission.phone.trim()) || []).length > 1,
    }));

    setSubmissions(duplicates);
    setShowDuplicates(true);
  };

  const filteredSubmissions = submissions.filter((submission) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      submission.name.toLowerCase().includes(searchLower) ||
      submission.email.toLowerCase().includes(searchLower) ||
      submission.phone.includes(searchTerm) ||
      submission.message.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return <div className="p-4">Loading submissions...</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Contact Form Submissions</h2>
        <div className="flex gap-2">
          <Button
            variant={showDuplicates ? "default" : "outline"}
            onClick={() => {
              if (!showDuplicates) {
                findDuplicates();
              } else {
                fetchSubmissions();
                setShowDuplicates(false);
              }
            }}
          >
            <AlertCircle className="w-4 h-4 mr-2" />
            {showDuplicates ? "Show All" : "Show Duplicates"}
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="w-4 h-4 text-gray-500" />
        <Input
          placeholder="Search by name, email, phone, or message..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubmissions.map((submission) => (
              <TableRow key={submission._id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {submission.name}
                    {submission.isDuplicate && (
                      <Badge variant="destructive">Duplicate</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{submission.email}</TableCell>
                <TableCell>{submission.phone}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        onClick={() => setSelectedSubmission(submission)}
                      >
                        View Message
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Message from {submission.name}</DialogTitle>
                      </DialogHeader>
                      <div className="mt-4">
                        <p className="whitespace-pre-wrap">{submission.message}</p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
                <TableCell>
                  {new Date(submission.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(submission._id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 