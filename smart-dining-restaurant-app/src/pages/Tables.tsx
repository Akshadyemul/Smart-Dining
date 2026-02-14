import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table2,
  QrCode,
  Users,
  MapPin,
  ArrowLeft,
  Download,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
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
  useEffect(() => {
    const fetchTables = async () => {
      console.log('Tables.tsx - Fetching tables...');
      const data = await dataStore.getTables();
      console.log('Tables.tsx - Fetched tables:', data);
      setTables(data);
    };
    fetchTables();
  }, []);
  const generateQRCode = async (table: Table) => {
    const baseUrl = window.location.origin;
    const qrUrl = `${baseUrl}/#/qr-order/${table.id}`;
    try {
      const url = await QRCode.toDataURL(qrUrl, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
      setQrCodeUrl(url);
      setSelectedTable(table);
      // Save QR code to table
      table.qrCode = qrUrl;
      const success = await dataStore.updateTable(table);
      if (success) {
        const updatedTables = await dataStore.getTables();
        setTables(updatedTables);
      } else {
        console.error('Failed to update table with QR code');
      }
    } catch (err) {
      console.error('Failed to generate QR code:', err);
    }
  };
  const updateTableStatus = async (table: Table, status: Table['status']) => {
    table.status = status;
    const success = await dataStore.updateTable(table);
    if (success) {
      const updatedTables = await dataStore.getTables();
      setTables(updatedTables);
    }
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
  const downloadQRCode = () => {
    if (qrCodeUrl && selectedTable) {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = `table-${selectedTable.tableNumber}-qr-code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={() => navigate('/admin')} className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Table Management</h1>
            <p className="text-gray-600 mt-1">Manage tables and generate QR codes</p>
          </div>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{tables.filter(t => t.status === 'available').length}</p>
                <p className="text-sm text-gray-600">Available</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center">
              <XCircle className="h-8 w-8 text-red-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{tables.filter(t => t.status === 'occupied').length}</p>
                <p className="text-sm text-gray-600">Occupied</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center">
              <Clock className="h-8 w-8 text-yellow-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{tables.filter(t => t.status === 'reserved').length}</p>
                <p className="text-sm text-gray-600">Reserved</p>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Tables Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tables.map(table => (
            <Card key={table.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Table2 className="h-5 w-5 text-orange-500" />
                    <CardTitle className="text-lg">Table {table.tableNumber}</CardTitle>
                  </div>
                  {getStatusIcon(table.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    Capacity: {table.capacity} seats
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {table.location}
                  </div>
                  <div className="pt-2">
                    {getStatusBadge(table.status)}
                  </div>
                  {/* Status Actions */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => updateTableStatus(table, 'available')}
                      className={`flex-1 py-1 px-2 rounded text-xs font-medium transition-colors ${table.status === 'available'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 hover:bg-green-100 text-gray-700'
                        }`}
                    >
                      Available
                    </button>
                    <button
                      onClick={() => updateTableStatus(table, 'occupied')}
                      className={`flex-1 py-1 px-2 rounded text-xs font-medium transition-colors ${table.status === 'occupied'
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 hover:bg-red-100 text-gray-700'
                        }`}
                    >
                      Occupied
                    </button>
                    <button
                      onClick={() => updateTableStatus(table, 'reserved')}
                      className={`flex-1 py-1 px-2 rounded text-xs font-medium transition-colors ${table.status === 'reserved'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-100 hover:bg-yellow-100 text-gray-700'
                        }`}
                    >
                      Reserved
                    </button>
                  </div>
                  {/* QR Code Button */}
                  <Button
                    variant="outline"
                    className="w-full mt-2"
                    onClick={() => generateQRCode(table)}
                  >
                    <QrCode className="mr-2 h-4 w-4" />
                    {table.qrCode ? 'Show QR Code' : 'Generate QR Code'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      {/* QR Code Dialog */}
      <Dialog open={!!selectedTable} onOpenChange={() => setSelectedTable(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Table {selectedTable?.tableNumber} - QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center">
            {qrCodeUrl && (
              <>
                <img
                  src={qrCodeUrl}
                  alt={`QR Code for Table ${selectedTable?.tableNumber}`}
                  className="w-64 h-64 mb-4"
                />
                <p className="text-sm text-gray-600 text-center mb-4">
                  Scan this QR code to order directly from Table {selectedTable?.tableNumber}
                </p>
                <Button onClick={downloadQRCode} className="bg-orange-500 hover:bg-orange-600">
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
