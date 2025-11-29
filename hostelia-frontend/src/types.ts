export type Hostel = {
  id: string;
  name: string;
  address: string;
  description?: string;
};

export type Room = {
  id: string;
  roomNumber: string;
  capacity: number;
  students: Student[];
};

export type Student = {
  id: string;
  name: string;
  rollNumber: string;
  email?: string;
  phone?: string;
  monthlyFee: number;
  room?: Room;
};

export type Fee = {
  id: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  student: Student;
  receipt?: Receipt;
};

export type Receipt = {
  id: string;
  reference: string;
  paidOn: string;
  notes?: string;
};

export type DashboardSummary = {
  hostel: { id: string; name: string };
  totalRooms: number;
  totalStudents: number;
  pendingFees: number;
  occupiedRooms: number;
  vacantRooms: number;
  studentsPerRoom: Record<string, number>;
  pendingAmount: number;
};
