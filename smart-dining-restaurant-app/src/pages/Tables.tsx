// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import {
//   Table2,
//   QrCode,
//   Users,
//   MapPin,
//   ArrowLeft,
//   Download,
//   CheckCircle,
//   XCircle,
//   Clock
// } from 'lucide-react';
// import { dataStore } from '@/services/dataStore';
// import type { Table } from '@/types';
// import QRCode from 'qrcode';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// export default function AdminTables() {
//   const navigate = useNavigate();
//   const [tables, setTables] = useState<Table[]>([]);
//   const [selectedTable, setSelectedTable] = useState<Table | null>(null);
//   const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
//   useEffect(() => {
//     const fetchTables = async () => {
//       console.log('Tables.tsx - Fetching tables...');
//       const data = await dataStore.getTables();
//       console.log('Tables.tsx - Fetched tables:', data);
//       setTables(data);
//     };
//     fetchTables();
//   }, []);
//   const generateQRCode = async (table: Table) => {
//     const baseUrl = window.location.origin;
//     const qrUrl = `${baseUrl}/#/qr-order/${table.id}`;
//     try {
//       const url = await QRCode.toDataURL(qrUrl, {
//         width: 400,
//         margin: 2,
//         color: {
//           dark: '#000000',
//           light: '#ffffff'
//         }
//       });
//       setQrCodeUrl(url);
//       setSelectedTable(table);
//       // Save QR code to table
//       table.qrCode = qrUrl;
//       const success = await dataStore.updateTable(table);
//       if (success) {
//         const updatedTables = await dataStore.getTables();
//         setTables(updatedTables);
//       } else {
//         console.error('Failed to update table with QR code');
//       }
//     } catch (err) {
//       console.error('Failed to generate QR code:', err);
//     }
//   };
//   const updateTableStatus = async (table: Table, status: Table['status']) => {
//     table.status = status;
//     const success = await dataStore.updateTable(table);
//     if (success) {
//       const updatedTables = await dataStore.getTables();
//       setTables(updatedTables);
//     }
//   };
//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case 'available':
//         return <Badge className="bg-green-500">Available</Badge>;
//       case 'occupied':
//         return <Badge className="bg-red-500">Occupied</Badge>;
//       case 'reserved':
//         return <Badge className="bg-yellow-500">Reserved</Badge>;
//       default:
//         return <Badge variant="outline">{status}</Badge>;
//     }
//   };
//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'available':
//         return <CheckCircle className="h-5 w-5 text-green-500" />;
//       case 'occupied':
//         return <XCircle className="h-5 w-5 text-red-500" />;
//       case 'reserved':
//         return <Clock className="h-5 w-5 text-yellow-500" />;
//       default:
//         return null;
//     }
//   };
//   const downloadQRCode = () => {
//     if (qrCodeUrl && selectedTable) {
//       const link = document.createElement('a');
//       link.href = qrCodeUrl;
//       link.download = `table-${selectedTable.tableNumber}-qr-code.png`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   };
//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="flex items-center mb-8">
//           <Button variant="ghost" onClick={() => navigate('/admin')} className="mr-4">
//             <ArrowLeft className="h-5 w-5" />
//           </Button>
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Table Management</h1>
//             <p className="text-gray-600 mt-1">Manage tables and generate QR codes</p>
//           </div>
//         </div>
//         {/* Stats */}
//         <div className="grid grid-cols-3 gap-4 mb-8">
//           <Card>
//             <CardContent className="p-4 flex items-center">
//               <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
//               <div>
//                 <p className="text-2xl font-bold">{tables.filter(t => t.status === 'available').length}</p>
//                 <p className="text-sm text-gray-600">Available</p>
//               </div>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="p-4 flex items-center">
//               <XCircle className="h-8 w-8 text-red-500 mr-3" />
//               <div>
//                 <p className="text-2xl font-bold">{tables.filter(t => t.status === 'occupied').length}</p>
//                 <p className="text-sm text-gray-600">Occupied</p>
//               </div>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="p-4 flex items-center">
//               <Clock className="h-8 w-8 text-yellow-500 mr-3" />
//               <div>
//                 <p className="text-2xl font-bold">{tables.filter(t => t.status === 'reserved').length}</p>
//                 <p className="text-sm text-gray-600">Reserved</p>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//         {/* Tables Grid */}
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {tables.map(table => (
//             <Card key={table.id} className="hover:shadow-lg transition-shadow">
//               <CardHeader className="pb-3">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <Table2 className="h-5 w-5 text-orange-500" />
//                     <CardTitle className="text-lg">Table {table.tableNumber}</CardTitle>
//                   </div>
//                   {getStatusIcon(table.status)}
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-3">
//                   <div className="flex items-center text-sm text-gray-600">
//                     <Users className="h-4 w-4 mr-2" />
//                     Capacity: {table.capacity} seats
//                   </div>
//                   <div className="flex items-center text-sm text-gray-600">
//                     <MapPin className="h-4 w-4 mr-2" />
//                     {table.location}
//                   </div>
//                   <div className="pt-2">
//                     {getStatusBadge(table.status)}
//                   </div>
//                   {/* Status Actions */}
//                   <div className="flex gap-2 pt-2">
//                     <button
//                       onClick={() => updateTableStatus(table, 'available')}
//                       className={`flex-1 py-1 px-2 rounded text-xs font-medium transition-colors ${table.status === 'available'
//                         ? 'bg-green-500 text-white'
//                         : 'bg-gray-100 hover:bg-green-100 text-gray-700'
//                         }`}
//                     >
//                       Available
//                     </button>
//                     <button
//                       onClick={() => updateTableStatus(table, 'occupied')}
//                       className={`flex-1 py-1 px-2 rounded text-xs font-medium transition-colors ${table.status === 'occupied'
//                         ? 'bg-red-500 text-white'
//                         : 'bg-gray-100 hover:bg-red-100 text-gray-700'
//                         }`}
//                     >
//                       Occupied
//                     </button>
//                     <button
//                       onClick={() => updateTableStatus(table, 'reserved')}
//                       className={`flex-1 py-1 px-2 rounded text-xs font-medium transition-colors ${table.status === 'reserved'
//                         ? 'bg-yellow-500 text-white'
//                         : 'bg-gray-100 hover:bg-yellow-100 text-gray-700'
//                         }`}
//                     >
//                       Reserved
//                     </button>
//                   </div>
//                   {/* QR Code Button */}
//                   <Button
//                     variant="outline"
//                     className="w-full mt-2"
//                     onClick={() => generateQRCode(table)}
//                   >
//                     <QrCode className="mr-2 h-4 w-4" />
//                     {table.qrCode ? 'Show QR Code' : 'Generate QR Code'}
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>
//       {/* QR Code Dialog */}
//       <Dialog open={!!selectedTable} onOpenChange={() => setSelectedTable(null)}>
//         <DialogContent className="max-w-md">
//           <DialogHeader>
//             <DialogTitle>Table {selectedTable?.tableNumber} - QR Code</DialogTitle>
//           </DialogHeader>
//           <div className="flex flex-col items-center">
//             {qrCodeUrl && (
//               <>
//                 <img
//                   src={qrCodeUrl}
//                   alt={`QR Code for Table ${selectedTable?.tableNumber}`}
//                   className="w-64 h-64 mb-4"
//                 />
//                 <p className="text-sm text-gray-600 text-center mb-4">
//                   Scan this QR code to order directly from Table {selectedTable?.tableNumber}
//                 </p>
//                 <Button onClick={downloadQRCode} className="bg-orange-500 hover:bg-orange-600">
//                   <Download className="mr-2 h-4 w-4" />
//                   Download QR Code
//                 </Button>
//               </>
//             )}
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }








import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Table2,
  QrCode,
  Users,
  MapPin,
  ArrowLeft,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { dataStore } from '@/services/dataStore';
import type { Table } from '@/types';
import QRCode from 'qrcode';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function AdminTables() {
  const navigate = useNavigate();

  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [newTable, setNewTable] = useState({
    tableNumber: '',
    capacity: 4,
    location: ''
  });

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    const data = await dataStore.getTables();
    setTables(data);
  };

  // ✅ Generate QR Code
  const generateQRCode = async (table: Table) => {
    try {
      const qrUrl = `${window.location.origin}/#/qr-order/${table.id}`;

      const url = await QRCode.toDataURL(qrUrl, {
        width: 400,
        margin: 2
      });

      setQrCodeUrl(url);
      setSelectedTable(table);

      const updatedTable = { ...table, qrCode: qrUrl };
      await dataStore.updateTable(updatedTable);

      fetchTables();
      toast.success('QR Code generated');
    } catch (err) {
      toast.error('Failed to generate QR code');
    }
  };

  // ✅ Update Status
  const updateTableStatus = async (table: Table, status: Table['status']) => {
    const updatedTable = { ...table, status };
    const success = await dataStore.updateTable(updatedTable);

    if (success) {
      fetchTables();
      toast.success('Status updated');
    }
  };

  // ✅ Add Table
  const handleAddTable = async () => {
    if (!newTable.tableNumber || !newTable.location) {
      toast.error('Please fill all fields');
      return;
    }

    const tableToAdd: Table = {
      id: `table-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      tableNumber: Number(newTable.tableNumber),
      capacity: newTable.capacity,
      status: 'available',
      location: newTable.location,
      qrCode: ''
    };

    const success = await dataStore.addTable(tableToAdd);

    if (success) {
      fetchTables();
      setIsAddDialogOpen(false);
      setNewTable({ tableNumber: '', capacity: 4, location: '' });
      toast.success('Table added');
    } else {
      toast.error('Failed to add table');
    }
  };

  // ✅ Delete Table
  const handleDeleteTable = async (id: string) => {
    if (!confirm('Delete this table?')) return;

    const success = await dataStore.deleteTable(id);

    if (success) {
      fetchTables();
      toast.success('Table deleted');
    } else {
      toast.error('Delete failed');
    }
  };

  // ✅ Download QR
  const downloadQRCode = () => {
    if (!qrCodeUrl || !selectedTable) return;

    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `table-${selectedTable.tableNumber}-qr.png`;
    link.click();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-500">Available</Badge>;
      case 'occupied':
        return <Badge className="bg-red-500">Occupied</Badge>;
      case 'reserved':
        return <Badge className="bg-yellow-500">Reserved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'occupied':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'reserved':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={() => navigate('/admin')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="ml-4">
            <h1 className="text-3xl font-bold">Table Management</h1>
            <p className="text-gray-600">Manage tables and QR codes</p>
          </div>

          <div className="ml-auto">
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-orange-500 hover:bg-orange-600"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Table
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {['available', 'occupied', 'reserved'].map(status => (
            <Card key={status}>
              <CardContent className="p-4 flex items-center">
                {getStatusIcon(status)}
                <div className="ml-3">
                  <p className="text-2xl font-bold">
                    {tables.filter(t => t.status === status).length}
                  </p>
                  <p className="text-sm text-gray-600 capitalize">{status}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tables Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tables.map(table => (
            <Card key={table.id} className="relative group hover:shadow-lg">

              {/* Delete Button */}
              <button
                onClick={() => handleDeleteTable(table.id)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-red-100 text-red-600 p-1.5 rounded-full"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Table2 className="h-5 w-5 text-orange-500" />
                    Table {table.tableNumber}
                  </CardTitle>
                  {getStatusIcon(table.status)}
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  {table.capacity} seats
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {table.location}
                </div>

                {getStatusBadge(table.status)}

                <div className="flex gap-2">
                  {(['available', 'occupied', 'reserved'] as Table['status'][]).map(status => (
                    <button
                      key={status}
                      onClick={() => updateTableStatus(table, status)}
                      className="flex-1 py-1 px-2 text-xs rounded bg-gray-100 hover:bg-gray-200"
                    >
                      {status}
                    </button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => generateQRCode(table)}
                >
                  <QrCode className="mr-2 h-4 w-4" />
                  {table.qrCode ? 'Show QR Code' : 'Generate QR Code'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Add Table Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Table</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Table Number</Label>
              <Input
                type="number"
                value={newTable.tableNumber}
                onChange={(e) =>
                  setNewTable({ ...newTable, tableNumber: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Capacity</Label>
              <Input
                type="number"
                value={newTable.capacity}
                onChange={(e) =>
                  setNewTable({ ...newTable, capacity: Number(e.target.value) })
                }
              />
            </div>

            <div>
              <Label>Location</Label>
              <Input
                value={newTable.location}
                onChange={(e) =>
                  setNewTable({ ...newTable, location: e.target.value })
                }
              />
            </div>

            <Button
              onClick={handleAddTable}
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              Add Table
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* QR Dialog */}
      <Dialog open={!!selectedTable} onOpenChange={() => setSelectedTable(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Table {selectedTable?.tableNumber} - QR Code
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center">
            {qrCodeUrl && (
              <>
                <img src={qrCodeUrl} className="w-64 h-64 mb-4" />
                <Button
                  onClick={downloadQRCode}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download QR Code
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
