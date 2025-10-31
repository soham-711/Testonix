import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Users,
  Download,
  Send,
  Plus,
  Trash2,
  Check,
  UserPlus,
  AlertTriangle,
  X,
  Edit2,
  Save,
  GripVertical
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { useToast } from "../hooks/use-toast";
import axios from "axios";

interface Student {
  _id: string;
  name: string;
  email: string;
  uid: string;
  roomId: string;
  ownerUid: string;
  joined: boolean;
  joinedAt: number;
  marks: { [key: string]: any };
  customData: { [key: string]: any };
  _creationTime: number;
  published?: boolean;
}

interface RoomDetailsProps {
  roomId: string;
  roomName: string;
  dateCreated: string;
  totalStudents: number;
  onBack: () => void;
}

const RoomDetails = ({ roomId, roomName, dateCreated, totalStudents, onBack }: RoomDetailsProps) => {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [examDate, setExamDate] = useState("15 Nov 2025");
  const [customColumns, setCustomColumns] = useState<string[]>(["Exam Score", "status"]);
  const [newColumnName, setNewColumnName] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingColumns, setEditingColumns] = useState<{ [key: number]: boolean }>({});
  const [editedColumnNames, setEditedColumnNames] = useState<{ [key: number]: string }>({});
  const [newStudent, setNewStudent] = useState({ name: "", email: "" });
  const [showAddStudentRow, setShowAddStudentRow] = useState(false);

  // Drag and Drop states
  const [draggedColumnIndex, setDraggedColumnIndex] = useState<number | null>(null);
  const [dragOverColumnIndex, setDragOverColumnIndex] = useState<number | null>(null);

  // Fetch students from backend
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const roomId = localStorage.getItem("roomId");
        if (!roomId) {
          toast({
            title: "Error",
            description: "User not logged in",
            variant: "destructive"
          });
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/rooms/allmembers/${roomId}`);
        const members = response.data.members || [];
        console.log(members);
        
        const studentsData = members.map((member: any) => ({
          ...member,
          published: false
        }));
        setStudents(studentsData);

        // Auto-add "status" column if not present
        if (!customColumns.includes("status")) {
          setCustomColumns(prev => [...prev, "status"]);
        }

      } catch (error: any) {
        console.error("Error fetching students:", error);
        toast({
          title: "Error",
          description: "Failed to load students",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [roomId, toast]);

  const handlePublishIndividual = async (studentId: string) => {
    try {
      setStudents(prev => prev.map(student =>
        student._id === studentId ? { ...student, published: true } : student
      ));
      toast({
        title: "Published",
        description: "Result published successfully.",
      });
    } catch (error) {
      console.error("Error publishing result:", error);
      toast({
        title: "Error",
        description: "Failed to publish result",
        variant: "destructive"
      });
    }
  };

  const handlePublishAll = async () => {
    try {
      setStudents(prev => prev.map(student => ({ ...student, published: true })));
      toast({
        title: "Published All",
        description: "All results published.",
      });
    } catch (error) {
      console.error("Error publishing all results:", error);
      toast({
        title: "Error",
        description: "Failed to publish all results",
        variant: "destructive"
      });
    }
  };

  const addCustomColumn = () => {
    if (newColumnName.trim() && !customColumns.includes(newColumnName.trim())) {
      setCustomColumns([...customColumns, newColumnName.trim()]);
      setNewColumnName("");
      toast({
        title: "Added",
        description: `"${newColumnName}" added.`,
      });
    }
  };

  const removeColumn = (index: number) => {
    const columnName = customColumns[index];
    if (columnName.toLowerCase() === "status") {
      toast({
        title: "Cannot Remove",
        description: "Status column is required.",
        variant: "destructive"
      });
      return;
    }
    setCustomColumns(prev => prev.filter((_, i) => i !== index));
    toast({
      title: "Removed",
      description: `"${columnName}" removed.`,
    });
  };

  const startEditingColumn = (index: number) => {
    const colName = customColumns[index];
    if (colName.toLowerCase() === "status") {
      toast({
        title: "Cannot Edit",
        description: "Status column cannot be renamed.",
        variant: "destructive"
      });
      return;
    }
    setEditingColumns({ ...editingColumns, [index]: true });
    setEditedColumnNames({ ...editedColumnNames, [index]: colName });
  };

  const saveColumnName = (index: number) => {
    const newName = editedColumnNames[index]?.trim();
    if (newName && !customColumns.includes(newName)) {
      const updatedColumns = [...customColumns];
      updatedColumns[index] = newName;
      setCustomColumns(updatedColumns);
      setEditingColumns({ ...editingColumns, [index]: false });
      toast({
        title: "Updated",
        description: `Renamed to "${newName}".`,
      });
    }
  };

  const updateStudentData = async (studentId: string, field: string, value: any) => {
    try {
      setStudents(prev =>
        prev.map(student =>
          student._id === studentId ? { ...student, [field]: value } : student
        )
      );

      const payload: any = {};
      if (field === 'name' || field === 'email') {
        payload[field] = value;
      } else if (field === 'marks' || field === 'customData') {
        payload[field] = value;
      }

      if (Object.keys(payload).length > 0) {
        await axios.patch(`http://localhost:5000/api/rooms/members/${studentId}`, payload);
      }
    } catch (error) {
      console.error("Error updating student:", error);
      toast({
        title: "Error",
        description: "Failed to update student",
        variant: "destructive"
      });
    }
  };

  const addNewStudent = async () => {
    try {
      if (newStudent.name.trim() && newStudent.email.trim()) {
        const uid = localStorage.getItem("uid");
        if (!uid) {
          toast({
            title: "Error",
            description: "User not logged in",
            variant: "destructive"
          });
          return;
        }

        const response = await axios.post(`http://localhost:5000/api/rooms/members`, {
          roomId: roomId,
          name: newStudent.name,
          email: newStudent.email,
          ownerUid: uid,
          joined: true,
          marks: {},
          customData: {}
        });

        const newStudentData = {
          ...response.data.member,
          published: false
        };
        setStudents(prev => [...prev, newStudentData]);
        setNewStudent({ name: "", email: "" });
        setShowAddStudentRow(false);

        toast({
          title: "Added",
          description: `${newStudent.name} added successfully.`,
        });
      }
    } catch (error: any) {
      console.error("Error adding student:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add student",
        variant: "destructive"
      });
    }
  };

  const removeStudent = async (studentId: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/rooms/members/${studentId}`);
      setStudents(prev => prev.filter(s => s._id !== studentId));
      toast({
        title: "Removed",
        description: "Student removed successfully.",
      });
    } catch (error) {
      console.error("Error removing student:", error);
      toast({
        title: "Error",
        description: "Failed to remove student",
        variant: "destructive"
      });
    }
  };

  const handleClearRoom = async () => {
    try {
      const uid = localStorage.getItem("uid");
      if (!uid) return;

      await axios.delete(`http://localhost:5000/api/rooms/${roomId}/members`);
      setStudents([]);
      setShowDeleteDialog(false);
      toast({
        title: "Cleared",
        description: "All students removed from room.",
        variant: "destructive"
      });
    } catch (error) {
      console.error("Error clearing room:", error);
      toast({
        title: "Error",
        description: "Failed to clear room",
        variant: "destructive"
      });
    }
  };

  const handleRemoveMarks = async () => {
    try {
      await axios.patch(`http://localhost:5000/api/rooms/${roomId}/clear-marks`);
      setStudents(prev => prev.map(student => ({
        ...student,
        marks: {},
        customData: {},
        published: false
      })));
      setShowDeleteDialog(false);
      toast({
        title: "Cleared",
        description: "All marks removed successfully.",
      });
    } catch (error) {
      console.error("Error removing marks:", error);
      toast({
        title: "Error",
        description: "Failed to remove marks",
        variant: "destructive"
      });
    }
  };

  // Drag and Drop Handlers
  const handleColumnDragStart = (e: React.DragEvent, index: number) => {
    const colName = customColumns[index];
    if (colName.toLowerCase() === "status") {
      e.preventDefault();
      return;
    }
    setDraggedColumnIndex(index);
    e.dataTransfer.effectAllowed = "move";
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "0.4";
    }
  };

  const handleColumnDragEnd = (e: React.DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "1";
    }
    setDraggedColumnIndex(null);
    setDragOverColumnIndex(null);
  };

  const handleColumnDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (customColumns[index].toLowerCase() === "status") return;
    if (draggedColumnIndex !== null && draggedColumnIndex !== index) {
      setDragOverColumnIndex(index);
    }
  };

  const handleColumnDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedColumnIndex === null || draggedColumnIndex === dropIndex) return;
    if (customColumns[dropIndex].toLowerCase() === "status") return;

    const newColumns = [...customColumns];
    const draggedColumn = newColumns[draggedColumnIndex];
    newColumns.splice(draggedColumnIndex, 1);
    newColumns.splice(dropIndex, 0, draggedColumn);

    setCustomColumns(newColumns);
    setDraggedColumnIndex(null);
    setDragOverColumnIndex(null);
    toast({
      title: "Column Reordered",
      description: `"${draggedColumn}" moved successfully.`,
    });
  };

  // Get value for any column
  const getStudentValue = (student: Student, column: string) => {
    const columnKey = column.toLowerCase().replace(/\s+/g, '');
    if (columnKey === 'status') {
      return student.joined ? 'Active' : 'Pending';
    }

    if (student.marks && student.marks[columnKey]) {
      return student.marks[columnKey];
    }
    if (student.customData && student.customData[columnKey]) {
      return student.customData[columnKey];
    }
    return '-';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-slate-600">Loading students...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-4 sm:p-6 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
      }}
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-64 h-64 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }} />
        <div className="absolute bottom-10 left-10 w-64 h-64 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-3 h-8 px-3 text-xs backdrop-blur-xl bg-white/40 border border-white/60 hover:bg-white/60"
        >
          <ArrowLeft className="mr-1 h-3 w-3" /> Back
        </Button>

        {/* Top Info Card */}
        <Card className="mb-4 border-0 overflow-hidden backdrop-blur-xl bg-white/40 shadow-lg"
          style={{ backdropFilter: 'blur(15px)', border: '1px solid rgba(255, 255, 255, 0.4)' }}>
          <div className="h-0.5 w-full" style={{
            background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #6366f1 100%)',
          }} />
          <CardHeader className="p-4">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
              <div className="flex-1">
                <CardTitle className="text-2xl font-bold mb-3 bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}>
                  {roomName}
                </CardTitle>
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg backdrop-blur-md bg-white/50 border border-white/40 shadow-sm">
                    <div className="p-1.5 rounded-lg" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' }}>
                      <Calendar className="h-3 w-3 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-indigo-600 uppercase">Created</p>
                      <p className="text-xs font-bold text-slate-800">{dateCreated}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg backdrop-blur-md bg-white/50 border border-white/40 shadow-sm">
                    <div className="p-1.5 rounded-lg" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}>
                      <Calendar className="h-3 w-3 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-purple-600 uppercase">Exam Date</p>
                      <Input
                        value={examDate}
                        onChange={(e) => setExamDate(e.target.value)}
                        className="text-xs font-bold text-slate-800 h-6 w-28 border-0 bg-transparent p-0 focus-visible:ring-0"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg backdrop-blur-md bg-white/50 border border-white/40 shadow-sm">
                    <div className="p-1.5 rounded-lg" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
                      <Users className="h-3 w-3 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-blue-600 uppercase">Students</p>
                      <p className="text-xs font-bold text-slate-800">{students.length} Enrolled</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => setShowDeleteDialog(true)}
                  className="h-8 px-3 text-xs font-semibold shadow-md hover:shadow-lg transition-all border-0 rounded-lg"
                  style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
                  <Trash2 className="mr-1 h-3 w-3" /> Delete
                </Button>
                <Button onClick={handlePublishAll}
                  className="h-8 px-3 text-xs font-semibold shadow-md hover:shadow-lg transition-all border-0 rounded-lg"
                  style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                  <Send className="mr-1 h-3 w-3" /> Publish All
                </Button>
                <Button className="h-8 px-3 text-xs font-semibold shadow-md hover:shadow-lg transition-all border-0 rounded-lg"
                  style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' }}>
                  <Download className="mr-1 h-3 w-3" /> PDF
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Add Column */}
        <Card className="mb-3 border-0 backdrop-blur-xl bg-white/40 shadow-md"
          style={{ backdropFilter: 'blur(15px)', border: '1px solid rgba(255, 255, 255, 0.4)' }}>
          <CardContent className="p-3">
            <div className="flex gap-2 items-center">
              <Input
                placeholder="Add column (e.g., Quiz 1)"
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCustomColumn()}
                className="flex-1 h-8 text-xs border border-white/50 bg-white/50 backdrop-blur-sm focus:border-indigo-400 rounded-lg font-medium"
              />
              <Button onClick={addCustomColumn}
                className="h-8 px-3 text-xs font-semibold rounded-lg border-0 shadow-md"
                style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
                <Plus className="mr-1 h-3 w-3" /> Add
              </Button>
            </div>
            <p className="text-[10px] text-slate-500 mt-2 font-medium">Tip: Drag column headers to reorder them</p>
          </CardContent>
        </Card>

        {/* Results Table */}
        <Card id="results-table" className="border-0 overflow-hidden backdrop-blur-xl bg-white/40 shadow-lg"
          style={{ backdropFilter: 'blur(15px)', border: '1px solid rgba(255, 255, 255, 0.4)' }}>
          <CardHeader className="p-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-bold text-slate-800">Student Results</CardTitle>
              <Button onClick={() => setShowAddStudentRow(true)} size="sm"
                className="h-7 px-3 text-xs font-semibold rounded-lg border-0 shadow-md"
                style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' }}
                data-html2canvas-ignore="true">
                <UserPlus className="mr-1 h-3 w-3" /> Add
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-3">
            <div className="overflow-x-auto rounded-lg">
              <table className="w-full text-xs">
                <thead>
                  <tr className="backdrop-blur-md bg-gradient-to-r from-indigo-50/60 to-purple-50/60">
                    <th className="text-center p-2 font-bold text-[10px] uppercase tracking-wide text-indigo-700 w-12">S.No</th>
                    <th className="text-left p-2 font-bold text-[10px] uppercase tracking-wide text-indigo-700">Name</th>
                    <th className="text-left p-2 font-bold text-[10px] uppercase tracking-wide text-indigo-700">Email</th>
                    {customColumns.map((col, idx) => (
                      <th
                        key={idx}
                        draggable={col.toLowerCase() !== 'status' && !editingColumns[idx]}
                        onDragStart={(e) => handleColumnDragStart(e, idx)}
                        onDragEnd={handleColumnDragEnd}
                        onDragOver={(e) => handleColumnDragOver(e, idx)}
                        onDrop={(e) => handleColumnDrop(e, idx)}
                        className={`text-left p-2 font-bold text-[10px] uppercase tracking-wide text-indigo-700 transition-all ${
                          dragOverColumnIndex === idx ? 'bg-indigo-100/80 scale-105' : ''
                        } ${col.toLowerCase() !== 'status' && !editingColumns[idx] ? 'cursor-move' : ''}`}
                        style={{ opacity: draggedColumnIndex === idx ? 0.4 : 1 }}
                      >
                        {editingColumns[idx] ? (
                          <div className="flex gap-1 items-center" data-html2canvas-ignore="true">
                            <Input
                              value={editedColumnNames[idx] || ''}
                              onChange={(e) => setEditedColumnNames({ ...editedColumnNames, [idx]: e.target.value })}
                              className="h-6 text-[10px] font-bold bg-white/80"
                            />
                            <Button size="sm" onClick={() => saveColumnName(idx)}
                              className="h-6 w-6 p-0 bg-green-500 hover:bg-green-600">
                              <Save className="h-2.5 w-2.5" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex gap-1 items-center group">
                            {col.toLowerCase() !== 'status' && <GripVertical className="h-3 w-3 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />}
                            <span>{col}</span>
                            <div className="flex gap-0.5 ml-auto" data-html2canvas-ignore="true">
                              {col.toLowerCase() !== 'status' && (
                                <>
                                  <Button size="sm" onClick={() => startEditingColumn(idx)}
                                    className="h-5 w-5 p-0 bg-blue-500 hover:bg-blue-600 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Edit2 className="h-2.5 w-2.5" />
                                  </Button>
                                  <Button size="sm" onClick={() => removeColumn(idx)}
                                    className="h-5 w-5 p-0 bg-red-500 hover:bg-red-600 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    <X className="h-2.5 w-2.5" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </th>
                    ))}
                    <th className="text-center p-2 font-bold text-[10px] uppercase tracking-wide text-indigo-700"
                      data-html2canvas-ignore="true">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Add Student Row */}
                  {showAddStudentRow && (
                    <tr className="border-b backdrop-blur-md bg-blue-50/40" data-html2canvas-ignore="true">
                      <td className="p-2 font-semibold text-slate-700 text-xs text-center">Auto</td>
                      <td className="p-2">
                        <Input placeholder="Name" value={newStudent.name}
                          onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                          className="h-7 text-xs border border-indigo-300 focus:border-indigo-500 rounded-lg bg-white/80 font-medium" />
                      </td>
                      <td className="p-2">
                        <Input placeholder="Email" value={newStudent.email}
                          onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                          className="h-7 text-xs border border-indigo-300 focus:border-indigo-500 rounded-lg bg-white/80" />
                      </td>
                      <td className="p-2 text-slate-400 font-medium text-xs" colSpan={customColumns.length}>-</td>
                      <td className="p-2 text-center">
                        <div className="flex gap-1 justify-center">
                          <Button onClick={addNewStudent} size="sm"
                            className="h-7 px-2 text-xs font-semibold rounded-lg border-0 shadow-md"
                            style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                            <Check className="mr-1 h-3 w-3" /> Save
                          </Button>
                          <Button onClick={() => { setShowAddStudentRow(false); setNewStudent({ name: "", email: "" }); }}
                            size="sm" className="h-7 px-2 text-xs font-semibold rounded-lg bg-white/60 hover:bg-white/80 border border-white/40">
                            Cancel
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* Student Rows */}
                  {students.map((student, idx) => (
                    <tr key={student._id} className={`border-b transition-all ${idx % 2 === 0 ? 'bg-white/30 hover:bg-white/50' : 'bg-white/15 hover:bg-white/35'}`}>
                      <td className="p-2 font-bold text-indigo-600 text-xs text-center w-12">
                        {idx + 1}
                      </td>
                      <td className="p-2">
                        <Input value={student.name}
                          onChange={(e) => updateStudentData(student._id, 'name', e.target.value)}
                          className="font-semibold text-slate-800 h-7 text-xs border border-indigo-100 focus:border-indigo-400 rounded-lg bg-white/50" />
                      </td>
                      <td className="p-2">
                        <Input value={student.email}
                          onChange={(e) => updateStudentData(student._id, 'email', e.target.value)}
                          className="text-slate-700 h-7 text-xs border border-indigo-100 focus:border-indigo-400 rounded-lg bg-white/50" />
                      </td>
                      {customColumns.map((col, colIdx) => {
                        const columnKey = col.toLowerCase().replace(/\s+/g, '');
                        const isStatus = columnKey === 'status';

                        return (
                          <td key={colIdx} className="p-2">
                            {isStatus ? (
                              <div className={`h-7 px-3 py-1 rounded-lg text-xs font-bold text-center border ${
                                student.joined
                                  ? 'bg-green-100 text-green-700 border-green-300'
                                  : 'bg-yellow-100 text-yellow-700 border-yellow-300'
                              }`}>
                                {student.joined ? 'Active' : 'Pending'}
                              </div>
                            ) : (
                              <Input
                                value={getStudentValue(student, col)}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  const key = columnKey;
                                  const updatedMarks = { ...student.marks, [key]: value };
                                  updateStudentData(student._id, 'marks', updatedMarks);
                                }}
                                className="h-7 text-xs font-medium text-center border border-slate-200 focus:border-indigo-400 rounded-lg bg-white/70"
                                placeholder="-"
                              />
                            )}
                          </td>
                        );
                      })}
                      <td className="p-2 text-center" data-html2canvas-ignore="true">
                        <div className="flex gap-1 justify-center items-center">
                          {!student.published ? (
                            <Button onClick={() => handlePublishIndividual(student._id)} size="sm"
                              className="h-7 px-2 text-xs font-semibold rounded-lg border-0 shadow-md"
                              style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                              <Send className="mr-1 h-2.5 w-2.5" /> Publish
                            </Button>
                          ) : (
                            <div className="h-7 px-2 flex items-center gap-1 text-xs font-semibold rounded-lg bg-green-50/70 border border-green-200/40">
                              <Check className="h-3 w-3 text-green-600" /> <span className="text-green-700">Done</span>
                            </div>
                          )}
                          <Button onClick={() => removeStudent(student._id)} size="sm"
                            className="h-7 w-7 p-0 rounded-lg border-0 shadow-md"
                            style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[450px] border-0 backdrop-blur-2xl bg-white/70 shadow-xl"
          style={{ backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.5)' }}>
          <div className="h-1 w-full absolute top-0 left-0 right-0 rounded-t-lg"
            style={{ background: 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)' }} />
          <DialogHeader className="pt-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg shadow-md"
                style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
                <AlertTriangle className="h-4 w-4 text-white" />
              </div>
              <DialogTitle className="text-xl font-bold text-slate-800">Delete Options</DialogTitle>
            </div>
            <DialogDescription className="text-slate-600 text-sm font-medium">
              Choose an action. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-4">
            <Card className="border border-red-300 hover:border-red-400 transition-all cursor-pointer shadow-md hover:shadow-lg"
              onClick={handleClearRoom}
              style={{ background: 'linear-gradient(135deg, rgba(254, 226, 226, 0.7) 0%, rgba(254, 202, 202, 0.5) 100%)' }}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg mt-0.5 shadow-md"
                    style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
                    <Trash2 className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-800 mb-1">Clear Room</h3>
                    <p className="text-xs text-slate-600 font-medium">Remove all students from this room permanently.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-orange-300 hover:border-orange-400 transition-all cursor-pointer shadow-md hover:shadow-lg"
              onClick={handleRemoveMarks}
              style={{ background: 'linear-gradient(135deg, rgba(255, 237, 213, 0.7) 0%, rgba(254, 215, 170, 0.5) 100%)' }}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg mt-0.5 shadow-md"
                    style={{ background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' }}>
                    <Trash2 className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-800 mb-1">Remove Marks</h3>
                    <p className="text-xs text-slate-600 font-medium">Clear all scores and grades. Students remain in room.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}
              className="h-8 px-4 text-xs font-semibold rounded-lg bg-white/60 hover:bg-white/80 border border-white/40">
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoomDetails;